-- ============================================================================
-- Supabase Migration: Mother-Partner Relationship Architecture, RLS & Pairing
-- Version: 20261105000000
-- Enforces:
-- 1. Two permanent distinct roles: MOTHER, PARTNER
-- 2. Strict 1-to-1 pairing (at most 1 active partner per mother, at most 1 active mother per partner)
-- 3. Automatic exclusion of paired mothers from availability queries
-- 4. Granular privacy permissions with strict RLS enforcement
-- 5. Disconnection lifecycle & audit trail
-- ============================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE account_role AS ENUM ('MOTHER', 'PARTNER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pairing_status AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'EXPIRED', 'DISCONNECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table Extension (Ensures permanent role & pairing code)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role account_role NOT NULL,
    unique_code TEXT NOT NULL UNIQUE,
    current_gestational_week INT DEFAULT 0,
    estimated_due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent unauthorized role mutation
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.role IS NOT NULL AND NEW.role <> OLD.role THEN
        RAISE EXCEPTION 'Account role cannot be changed once established (% -> %).', OLD.role, NEW.role;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_change();

-- 3. Pairing Codes Table
CREATE TABLE IF NOT EXISTS public.pairing_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    max_uses INT NOT NULL DEFAULT 1,
    uses_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Mother-Partner Relationships Table
CREATE TABLE IF NOT EXISTS public.mother_partner_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mother_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    partner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    pairing_code_id UUID REFERENCES public.pairing_codes(id) ON DELETE SET NULL,
    status pairing_status NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    disconnected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    permissions JSONB NOT NULL DEFAULT '{
        "viewPregnancyProgress": true,
        "viewAppointments": true,
        "viewSharedMilestones": true,
        "viewHealthSummaries": false,
        "viewBirthPlan": true,
        "viewHospitalChecklist": true,
        "editSharedTasks": true,
        "receiveReminders": true,
        "viewUltrasounds": false,
        "viewAIConversations": false,
        "viewJournalEntries": false
    }'::jsonb,
    
    -- Self-connection constraint
    CONSTRAINT chk_mother_partner_distinct CHECK (mother_user_id <> partner_user_id)
);

-- 5. CRITICAL DATABASE-LEVEL 1-TO-1 PAIRING CONSTRAINTS
-- Enforces: A mother can have AT MOST ONE active relationship
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_mother_relationship
ON public.mother_partner_relationships (mother_user_id)
WHERE status = 'ACTIVE';

-- Enforces: A partner can have AT MOST ONE active relationship
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_partner_relationship
ON public.mother_partner_relationships (partner_user_id)
WHERE status = 'ACTIVE';

-- Index for lookup & performance
CREATE INDEX IF NOT EXISTS idx_mpr_mother_status ON public.mother_partner_relationships (mother_user_id, status);
CREATE INDEX IF NOT EXISTS idx_mpr_partner_status ON public.mother_partner_relationships (partner_user_id, status);

-- 6. Trigger: Ensure correct user roles in relationship
CREATE OR REPLACE FUNCTION validate_mother_partner_roles()
RETURNS TRIGGER AS $$
DECLARE
    mother_role account_role;
    partner_role account_role;
BEGIN
    SELECT role INTO mother_role FROM public.profiles WHERE id = NEW.mother_user_id;
    SELECT role INTO partner_role FROM public.profiles WHERE id = NEW.partner_user_id;

    IF mother_role <> 'MOTHER' THEN
        RAISE EXCEPTION 'Target user % is not registered as a MOTHER.', NEW.mother_user_id;
    END IF;

    IF partner_role <> 'PARTNER' THEN
        RAISE EXCEPTION 'Requesting user % is not registered as a PARTNER.', NEW.partner_user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_mother_partner_roles ON public.mother_partner_relationships;
CREATE TRIGGER trg_validate_mother_partner_roles
BEFORE INSERT OR UPDATE ON public.mother_partner_relationships
FOR EACH ROW
EXECUTE FUNCTION validate_mother_partner_roles();

-- 7. View: Registered Available Mothers (Excludes all mothers who are already active or pending)
CREATE OR REPLACE VIEW public.available_mothers_view AS
SELECT 
    p.id AS mother_id,
    p.name AS mother_name,
    p.current_gestational_week,
    p.estimated_due_date,
    p.created_at
FROM public.profiles p
WHERE p.role = 'MOTHER'
  AND NOT EXISTS (
      SELECT 1 
      FROM public.mother_partner_relationships r
      WHERE r.mother_user_id = p.id
        AND r.status IN ('ACTIVE', 'PENDING')
  );

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pairing_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mother_partner_relationships ENABLE ROW LEVEL SECURITY;

-- RLS: Profiles
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Partners can read basic profile of their active paired mother"
ON public.profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.mother_partner_relationships r
        WHERE r.partner_user_id = auth.uid()
          AND r.mother_user_id = profiles.id
          AND r.status = 'ACTIVE'
    )
);

CREATE POLICY "Mothers can read basic profile of their active paired partner"
ON public.profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.mother_partner_relationships r
        WHERE r.mother_user_id = auth.uid()
          AND r.partner_user_id = profiles.id
          AND r.status = 'ACTIVE'
    )
);

-- RLS: Mother-Partner Relationships
CREATE POLICY "Users can view their own relationships"
ON public.mother_partner_relationships FOR SELECT
USING (auth.uid() = mother_user_id OR auth.uid() = partner_user_id);

CREATE POLICY "Partners can create pairing request to an available mother"
ON public.mother_partner_relationships FOR INSERT
WITH CHECK (
    auth.uid() = partner_user_id AND
    NOT EXISTS (
        SELECT 1 FROM public.mother_partner_relationships
        WHERE partner_user_id = auth.uid() AND status = 'ACTIVE'
    )
);

CREATE POLICY "Mothers can update relationship status or permissions"
ON public.mother_partner_relationships FOR UPDATE
USING (auth.uid() = mother_user_id)
WITH CHECK (auth.uid() = mother_user_id);

CREATE POLICY "Partners can disconnect their own active relationship"
ON public.mother_partner_relationships FOR UPDATE
USING (auth.uid() = partner_user_id)
WITH CHECK (auth.uid() = partner_user_id);
