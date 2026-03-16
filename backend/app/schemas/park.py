from datetime import datetime
from datetime import date

from pydantic import BaseModel


class ParkCreate(BaseModel):
    name: str
    address: str | None = None


class ParkUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    basic_info: dict | None = None
    industry_focus: dict | None = None
    tenant_info: dict | None = None
    investment_needs: dict | None = None
    opc_community_info: dict | None = None


class ParkResponse(BaseModel):
    id: str
    user_id: str
    name: str
    address: str | None = None
    basic_info: dict | None = None
    industry_focus: dict | None = None
    tenant_info: dict | None = None
    investment_needs: dict | None = None
    opc_community_info: dict | None = None
    completeness_score: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ParkPolicyPushCreate(BaseModel):
    policy_title: str
    policy_level: str | None = None
    issuing_department: str | None = None
    publish_date: date | None = None
    deadline: date | None = None
    applicable_targets: list[str] | None = None
    regions: list[str] | None = None
    channels: list[str] | None = None
    target_tags: list[str] | None = None
    keywords: list[str] | None = None
    push_scope: str | None = None
    status: str = "active"


class ParkPolicyPushResponse(BaseModel):
    id: str
    park_id: str
    policy_title: str
    policy_level: str | None = None
    issuing_department: str | None = None
    publish_date: date | None = None
    deadline: date | None = None
    applicable_targets: list[str] | None = None
    regions: list[str] | None = None
    channels: list[str] | None = None
    target_tags: list[str] | None = None
    keywords: list[str] | None = None
    push_scope: str | None = None
    status: str
    reach_count: int
    open_count: int
    click_count: int
    intent_count: int
    conversion_rate: float
    last_pushed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
