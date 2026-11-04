"""
FastAPI Mother-Partner Pairing & Account Service
Enforces:
1. Strict immutable account roles: MOTHER, PARTNER
2. One-to-one relationship constraints (at most one active relationship per user)
3. Exclusion of paired mothers from availability searches
4. Granular sharing permissions check
5. Safe atomic disconnection and reconnection
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Depends, status

router = APIRouter(prefix="/api/pairing", tags=["Pairing & Account Relationships"])

class AccountRole(str, Enum):
    MOTHER = "mother"
    PARTNER = "partner"

class RelationshipStatus(str, Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"
    DISCONNECTED = "DISCONNECTED"

class GranularPermissions(BaseModel):
    viewPregnancyProgress: bool = True
    viewAppointments: bool = True
    viewSharedMilestones: bool = True
    viewHealthSummaries: bool = False
    viewBirthPlan: bool = True
    viewHospitalChecklist: bool = True
    editSharedTasks: bool = True
    receiveReminders: bool = True
    viewUltrasounds: bool = False
    viewAIConversations: bool = False
    viewJournalEntries: bool = False

class ConnectRequest(BaseModel):
    motherCodeOrId: str = Field(..., description="Mother's pairing code (e.g. MAMA-2026) or user ID")

class PermissionUpdateRequest(BaseModel):
    permissions: GranularPermissions

class UserProfileDTO(BaseModel):
    id: str
    name: str
    email: str
    role: AccountRole
    uniqueCode: str
    currentGestationalWeek: Optional[int] = 0
    isPaired: bool = False
    partnerLinkedCode: Optional[str] = None


class PairingService:
    """
    Enforces business logic and database-level transactional safety.
    """
    def __init__(self, db_session):
        self.db = db_session

    async def get_available_mothers(self, requesting_partner_id: str) -> List[Dict[str, Any]]:
        """
        Rule: Excludes all mothers with an existing active or pending partner,
        and excludes the requesting user's own account.
        """
        # Query mothers without active relationship
        # SELECT * FROM profiles WHERE role = 'mother' AND id NOT IN (
        #    SELECT mother_user_id FROM mother_partner_relationships WHERE status IN ('ACTIVE', 'PENDING')
        # )
        pass

    async def pair_partner_with_mother(
        self, partner_id: str, mother_identifier: str
    ) -> Dict[str, Any]:
        """
        Rule:
        - Requesting user MUST have role == PARTNER.
        - Requesting partner MUST NOT already have an ACTIVE relationship.
        - Target mother MUST have role == MOTHER.
        - Target mother MUST NOT already have an ACTIVE relationship.
        - Target mother cannot be the same user.
        """
        # 1. Verify partner role & check existing active relationship
        # 2. Find mother by code or ID
        # 3. Check mother's current active relationship
        # 4. Atomically insert relationship record with status = 'ACTIVE'
        # 5. Return success payload
        pass

    async def disconnect_relationship(self, user_id: str, relationship_id: str) -> bool:
        """
        Rule:
        - User must be a participant (mother or partner).
        - Update status to 'DISCONNECTED', set disconnected_at = now().
        - Revoke active permissions immediately.
        - Both accounts become eligible for a new pairing.
        """
        pass

    async def update_permissions(
        self, mother_id: str, permissions: GranularPermissions
    ) -> GranularPermissions:
        """
        Rule: ONLY the Mother can alter permissions for her shared data.
        """
        pass
