import {
  MotherPartnerRelationship,
  GranularSharingPermissions,
  AvailableMotherSummary,
  UserAccount,
  UserProfile
} from '@/types';

export const DEFAULT_SHARING_PERMISSIONS: GranularSharingPermissions = {
  viewPregnancyProgress: true,
  viewAppointments: true,
  viewSharedMilestones: true,
  viewHealthSummaries: false,
  viewBirthPlan: true,
  viewHospitalChecklist: true,
  editSharedTasks: true,
  receiveReminders: true,
  viewUltrasounds: false,
  viewAIConversations: false,
  viewJournalEntries: false,
  shareVitals: false,
  shareMood: false,
  shareAppointments: true,
  shareHospitalChecklist: true,
  shareBirthPlan: true
};

export const INITIAL_RELATIONSHIPS: MotherPartnerRelationship[] = [
  {
    id: 'rel_siri_rohan_2026',
    mother_user_id: 'usr_mother_siri',
    mother_name: 'Siri Rao',
    mother_email: 'siri@garbhsarthi.com',
    mother_code: 'MAMA-2026',
    partner_user_id: 'usr_partner_rohan',
    partner_name: 'Rohan Rao',
    partner_email: 'rohan@garbhsarthi.com',
    partner_code: 'PAPA-7140',
    pairing_code_id: 'code_mama_2026',
    status: 'ACTIVE',
    requested_at: '2026-10-15T09:30:00Z',
    accepted_at: '2026-10-15T09:35:00Z',
    created_at: '2026-10-15T09:30:00Z',
    updated_at: '2026-10-15T09:35:00Z',
    permissions: {
      ...DEFAULT_SHARING_PERMISSIONS,
      viewHealthSummaries: true
    }
  }
];

export class PairingManager {
  private relationships: MotherPartnerRelationship[];

  constructor() {
    this.relationships = this.loadRelationships();
  }

  private loadRelationships(): MotherPartnerRelationship[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_relationships');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse relationships:', e);
        }
      }
    }
    return INITIAL_RELATIONSHIPS;
  }

  private saveRelationships() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_relationships', JSON.stringify(this.relationships));
    }
  }

  public getAllRelationships(): MotherPartnerRelationship[] {
    return [...this.relationships];
  }

  public getActiveRelationshipForUser(userId: string): MotherPartnerRelationship | null {
    return this.relationships.find(
      r => r.status === 'ACTIVE' && (r.mother_user_id === userId || r.partner_user_id === userId)
    ) || null;
  }

  public isMotherPaired(motherUserId: string): boolean {
    return this.relationships.some(
      r => r.status === 'ACTIVE' && r.mother_user_id === motherUserId
    );
  }

  public isPartnerPaired(partnerUserId: string): boolean {
    return this.relationships.some(
      r => r.status === 'ACTIVE' && r.partner_user_id === partnerUserId
    );
  }

  /**
   * Filter Registered Mothers to display ONLY genuinely available mothers:
   * 1. Must have role == 'mother'
   * 2. Must NOT have an existing ACTIVE relationship
   * 3. Must NOT be the requesting user
   */
  public getAvailableMothers(
    allAccounts: UserAccount[],
    requestingUserId?: string
  ): AvailableMotherSummary[] {
    return allAccounts
      .filter(a => a.role === 'mother')
      .map(mother => {
        const activeRel = this.relationships.find(
          r => r.status === 'ACTIVE' && r.mother_user_id === mother.id
        );
        const isSelf = requestingUserId && mother.id === requestingUserId;
        const isAvailable = !activeRel && !isSelf && !mother.isPaired;

        return {
          id: mother.id,
          name: mother.name,
          email: mother.email,
          code: mother.uniqueCode,
          gestationalWeek: mother.profile.currentGestationalWeek || 20,
          estimatedDueDate: mother.profile.estimatedDueDate || '2027-04-15',
          isAvailable,
          pairedPartnerName: activeRel ? activeRel.partner_name : (mother.isPaired ? (mother.profile.partnerProfile?.name || 'Connected Partner') : undefined)
        };
      });
  }

  /**
   * Enforces 1-to-1 Mother-Partner Pairing with strict backend-style validations:
   * - Requesting user MUST be PARTNER role
   * - Target user MUST be MOTHER role
   * - Target mother MUST NOT already be paired with someone else
   * - Partner MUST NOT already be paired with another mother
   * - Cannot pair with self
   */
  public connectPartnerWithMother(
    partnerAccount: UserAccount,
    targetMotherAccount: UserAccount
  ): {
    success: boolean;
    message: string;
    relationship?: MotherPartnerRelationship;
  } {
    // 1. Role validation
    if (partnerAccount.role !== 'partner') {
      return {
        success: false,
        message: 'Security validation error: Only registered Partner accounts can initiate mother pairing.'
      };
    }
    if (targetMotherAccount.role !== 'mother') {
      return {
        success: false,
        message: 'Security validation error: Target account is not a registered Expecting Mother.'
      };
    }

    // 2. Self connection check
    if (partnerAccount.id === targetMotherAccount.id) {
      return {
        success: false,
        message: 'Security validation error: Cannot pair an account with itself.'
      };
    }

    // 3. Check if partner already has an active relationship
    const partnerActiveRel = this.getActiveRelationshipForUser(partnerAccount.id);
    if (partnerActiveRel) {
      return {
        success: false,
        message: `Your partner account is already paired with ${partnerActiveRel.mother_name}. Under 1-to-1 privacy rules, you must disconnect first before connecting with another mother.`
      };
    }

    // 4. Check if target mother already has an active relationship
    const motherActiveRel = this.getActiveRelationshipForUser(targetMotherAccount.id);
    if (motherActiveRel) {
      return {
        success: false,
        message: `${targetMotherAccount.name} already has an active connected partner (${motherActiveRel.partner_name}). She is not available for new pairing.`
      };
    }

    // 5. Create new Active 1-to-1 Relationship
    const now = new Date().toISOString();
    const newRel: MotherPartnerRelationship = {
      id: `rel_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      mother_user_id: targetMotherAccount.id,
      mother_name: targetMotherAccount.name,
      mother_email: targetMotherAccount.email,
      mother_code: targetMotherAccount.uniqueCode,
      partner_user_id: partnerAccount.id,
      partner_name: partnerAccount.name,
      partner_email: partnerAccount.email,
      partner_code: partnerAccount.uniqueCode,
      pairing_code_id: `code_${targetMotherAccount.uniqueCode}`,
      status: 'ACTIVE',
      requested_at: now,
      accepted_at: now,
      created_at: now,
      updated_at: now,
      permissions: { ...DEFAULT_SHARING_PERMISSIONS }
    };

    // Close any previous disconnected relationships between these two
    this.relationships = this.relationships.map(r => {
      if (
        (r.mother_user_id === targetMotherAccount.id || r.partner_user_id === partnerAccount.id) &&
        r.status === 'ACTIVE'
      ) {
        return { ...r, status: 'DISCONNECTED', disconnected_at: now };
      }
      return r;
    });

    this.relationships.unshift(newRel);
    this.saveRelationships();

    return {
      success: true,
      message: `Successfully connected with ${targetMotherAccount.name}! Caregiver view and permitted records are synchronized.`,
      relationship: newRel
    };
  }

  /**
   * Safely disconnect relationship:
   * - Marks status as 'DISCONNECTED'
   * - Sets disconnected_at
   * - Revokes active sharing access immediately
   * - Frees both accounts to be eligible for future pairing
   */
  public disconnectRelationship(
    relationshipId: string,
    requestingUserId: string
  ): { success: boolean; message: string } {
    const relIndex = this.relationships.findIndex(r => r.id === relationshipId);
    if (relIndex === -1) {
      return { success: false, message: 'Relationship not found.' };
    }

    const rel = this.relationships[relIndex];
    if (rel.mother_user_id !== requestingUserId && rel.partner_user_id !== requestingUserId) {
      return { success: false, message: 'Unauthorized: You are not a party to this relationship.' };
    }

    const now = new Date().toISOString();
    this.relationships[relIndex] = {
      ...rel,
      status: 'DISCONNECTED',
      disconnected_at: now,
      updated_at: now
    };

    this.saveRelationships();
    return {
      success: true,
      message: 'Pairing successfully disconnected. Both accounts are now eligible for new pairing.'
    };
  }

  /**
   * Granular Permissions Update:
   * ONLY the mother can change permissions.
   */
  public updatePermissions(
    relationshipId: string,
    requestingMotherId: string,
    newPermissions: Partial<GranularSharingPermissions>
  ): { success: boolean; message: string; permissions?: GranularSharingPermissions } {
    const relIndex = this.relationships.findIndex(r => r.id === relationshipId);
    if (relIndex === -1) {
      return { success: false, message: 'Relationship not found.' };
    }

    const rel = this.relationships[relIndex];
    if (rel.mother_user_id !== requestingMotherId) {
      return {
        success: false,
        message: 'Unauthorized: Only the mother can modify shared privacy permissions.'
      };
    }

    const updatedPermissions: GranularSharingPermissions = {
      ...rel.permissions,
      ...newPermissions
    };

    this.relationships[relIndex] = {
      ...rel,
      permissions: updatedPermissions,
      updated_at: new Date().toISOString()
    };

    this.saveRelationships();
    return {
      success: true,
      message: 'Sharing permissions updated successfully.',
      permissions: updatedPermissions
    };
  }
}

export const pairingService = new PairingManager();
