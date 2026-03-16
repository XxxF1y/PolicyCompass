from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.park import Park
from app.models.park_policy_push import ParkPolicyPush
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.park import (
    ParkPolicyPushCreate,
    ParkPolicyPushResponse,
    ParkResponse,
    ParkUpdate,
)

router = APIRouter()


def _is_filled(value) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, dict):
        return any(_is_filled(v) for v in value.values())
    if isinstance(value, list):
        return any(_is_filled(v) for v in value)
    return True


def _calc_park_completeness(park: Park) -> float:
    jsonb_fields = ["basic_info", "industry_focus", "tenant_info", "investment_needs", "opc_community_info"]
    filled = sum(1 for f in jsonb_fields if _is_filled(getattr(park, f)))
    return round(filled / len(jsonb_fields) * 100, 1)


async def _get_my_park_or_404(db: AsyncSession, current_user: User) -> Park:
    result = await db.execute(select(Park).where(Park.user_id == current_user.id))
    park = result.scalar_one_or_none()
    if not park:
        raise HTTPException(status_code=404, detail="园区不存在")
    return park


@router.get("/mine", response_model=ResponseModel[ParkResponse])
async def get_my_park(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    park = await _get_my_park_or_404(db, current_user)
    return ResponseModel(data=ParkResponse.model_validate(park))


@router.get("/{park_id}", response_model=ResponseModel[ParkResponse])
async def get_park(park_id: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Park).where(Park.id == park_id))
    park = result.scalar_one_or_none()
    if not park:
        raise HTTPException(status_code=404, detail="园区不存在")
    return ResponseModel(data=ParkResponse.model_validate(park))


@router.put("/{park_id}", response_model=ResponseModel[ParkResponse])
async def update_park(
    park_id: str,
    body: ParkUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Park).where(Park.id == park_id))
    park = result.scalar_one_or_none()
    if not park:
        raise HTTPException(status_code=404, detail="园区不存在")
    if park.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(park, field, value)
    park.completeness_score = _calc_park_completeness(park)
    await db.commit()
    await db.refresh(park)
    return ResponseModel(data=ParkResponse.model_validate(park))


@router.post("/{park_id}/policies", response_model=ResponseModel)
async def publish_park_policy(park_id: str, _: User = Depends(get_current_user)):
    # TODO: accept policy file upload, AI parse, and publish
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{park_id}/policy-matches", response_model=ResponseModel)
async def get_policy_matches(park_id: str, _: User = Depends(get_current_user)):
    # TODO: return matched users for park policies
    return ResponseModel(data=[])


@router.post("/{park_id}/push-policy", response_model=ResponseModel)
async def push_policy(park_id: str, _: User = Depends(get_current_user)):
    # TODO: push policy to matched users
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{park_id}/push-history", response_model=ResponseModel)
async def get_push_history(park_id: str, _: User = Depends(get_current_user)):
    # TODO: return push history
    return ResponseModel(data=[])


@router.get("/mine/pushes", response_model=ResponseModel[list[ParkPolicyPushResponse]])
async def list_my_policy_pushes(
    status: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    park = await _get_my_park_or_404(db, current_user)
    stmt = select(ParkPolicyPush).where(ParkPolicyPush.park_id == park.id)
    if status:
        stmt = stmt.where(ParkPolicyPush.status == status)
    rows = (await db.execute(stmt.order_by(desc(ParkPolicyPush.created_at)))).scalars().all()
    return ResponseModel(data=[ParkPolicyPushResponse.model_validate(r) for r in rows])


@router.get("/mine/pushes/{push_id}", response_model=ResponseModel[ParkPolicyPushResponse])
async def get_my_policy_push(
    push_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    park = await _get_my_park_or_404(db, current_user)
    row = (
        await db.execute(
            select(ParkPolicyPush).where(
                ParkPolicyPush.id == push_id,
                ParkPolicyPush.park_id == park.id,
            )
        )
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="政策推送记录不存在")
    return ResponseModel(data=ParkPolicyPushResponse.model_validate(row))


@router.post("/mine/pushes", response_model=ResponseModel[ParkPolicyPushResponse])
async def create_my_policy_push(
    body: ParkPolicyPushCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    park = await _get_my_park_or_404(db, current_user)
    row = ParkPolicyPush(
        id=uuid4().hex,
        park_id=park.id,
        policy_title=body.policy_title,
        policy_level=body.policy_level,
        issuing_department=body.issuing_department,
        publish_date=body.publish_date,
        deadline=body.deadline,
        applicable_targets=body.applicable_targets,
        regions=body.regions,
        channels=body.channels,
        target_tags=body.target_tags,
        keywords=body.keywords,
        push_scope=body.push_scope,
        status=body.status,
        last_pushed_at=datetime.now(),
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return ResponseModel(data=ParkPolicyPushResponse.model_validate(row))
