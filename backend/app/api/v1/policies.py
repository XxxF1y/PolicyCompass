from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select, func as sa_func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.favorite import Favorite
from app.models.policy import Policy
from app.models.user import User
from app.schemas.common import PaginatedData, ResponseModel
from app.schemas.policy import PolicyCreate, PolicyListItem, PolicyResponse

router = APIRouter()


@router.get("", response_model=ResponseModel[PaginatedData[PolicyListItem]])
async def list_policies(
    keyword: str | None = None,
    level: str | None = None,
    policy_type: str | None = None,
    support_domain: str | None = None,
    applicable_target: str | None = None,
    department_category: str | None = None,
    source_type: str | None = None,
    status: str | None = None,
    is_opc_policy: bool | None = None,
    region: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Policy)
    count_query = select(sa_func.count()).select_from(Policy)

    if keyword:
        pattern = f"%{keyword}%"
        keyword_clause = or_(
            Policy.title.ilike(pattern),
            Policy.issuing_authority.ilike(pattern),
            Policy.original_text.ilike(pattern),
            Policy.interpretation.ilike(pattern),
        )
        query = query.where(keyword_clause)
        count_query = count_query.where(keyword_clause)
    if level:
        query = query.where(Policy.level == level)
        count_query = count_query.where(Policy.level == level)
    if policy_type:
        query = query.where(Policy.policy_type == policy_type)
        count_query = count_query.where(Policy.policy_type == policy_type)
    if support_domain:
        query = query.where(Policy.support_domain == support_domain)
        count_query = count_query.where(Policy.support_domain == support_domain)
    if applicable_target:
        query = query.where(Policy.applicable_target == applicable_target)
        count_query = count_query.where(Policy.applicable_target == applicable_target)
    if department_category:
        query = query.where(Policy.department_category == department_category)
        count_query = count_query.where(Policy.department_category == department_category)
    if source_type:
        query = query.where(Policy.source_type == source_type)
        count_query = count_query.where(Policy.source_type == source_type)
    if status:
        query = query.where(Policy.status == status)
        count_query = count_query.where(Policy.status == status)
    if is_opc_policy is not None:
        query = query.where(Policy.is_opc_policy == is_opc_policy)
        count_query = count_query.where(Policy.is_opc_policy == is_opc_policy)
    if region:
        query = query.where(Policy.region == region)
        count_query = count_query.where(Policy.region == region)

    total = (await db.execute(count_query)).scalar() or 0
    result = await db.execute(
        query.offset((page - 1) * page_size).limit(page_size).order_by(Policy.created_at.desc())
    )
    rows = result.scalars().all()
    policy_ids = [p.id for p in rows]
    favorite_set: set[str] = set()
    if policy_ids:
        fav_rows = await db.execute(
            select(Favorite.policy_id).where(Favorite.user_id == current_user.id, Favorite.policy_id.in_(policy_ids))
        )
        favorite_set = set(fav_rows.scalars().all())
    items = [
        PolicyListItem(
            id=p.id,
            title=p.title,
            issuing_authority=p.issuing_authority,
            level=p.level,
            policy_type=p.policy_type,
            support_domain=p.support_domain,
            applicable_target=p.applicable_target,
            department_category=p.department_category,
            source_type=p.source_type,
            status=p.status,
            is_opc_policy=p.is_opc_policy,
            is_favorited=p.id in favorite_set,
            region=p.region,
            publish_date=p.publish_date,
            apply_end_date=p.apply_end_date,
            support_details=p.support_details,
        )
        for p in rows
    ]
    return ResponseModel(data=PaginatedData(total=total, page=page, page_size=page_size, items=items))


@router.get("/{policy_id}", response_model=ResponseModel[PolicyResponse])
async def get_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Policy).where(Policy.id == policy_id))
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="政策不存在")
    fav = (
        await db.execute(select(Favorite.id).where(Favorite.user_id == current_user.id, Favorite.policy_id == policy_id))
    ).scalar_one_or_none()
    payload = PolicyResponse(
        id=policy.id,
        title=policy.title,
        issuing_authority=policy.issuing_authority,
        level=policy.level,
        policy_type=policy.policy_type,
        support_domain=policy.support_domain,
        applicable_target=policy.applicable_target,
        department_category=policy.department_category,
        source_type=policy.source_type,
        status=policy.status,
        is_opc_policy=policy.is_opc_policy,
        is_favorited=bool(fav),
        region=policy.region,
        publish_date=policy.publish_date,
        apply_end_date=policy.apply_end_date,
        support_details=policy.support_details,
        policy_number=policy.policy_number,
        classification=policy.classification,
        application_info=policy.application_info,
        conditions=policy.conditions,
        prerequisites=policy.prerequisites,
        materials_required=policy.materials_required,
        review_status=policy.review_status,
        original_text=policy.original_text,
        interpretation=policy.interpretation,
        effective_date=policy.effective_date,
        expiry_date=policy.expiry_date,
        apply_start_date=policy.apply_start_date,
        official_url=policy.official_url,
        apply_url=policy.apply_url,
        created_at=policy.created_at,
        updated_at=policy.updated_at,
    )
    return ResponseModel(data=payload)


@router.post("", response_model=ResponseModel[PolicyResponse])
async def create_policy(
    body: PolicyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ("park", "admin"):
        raise HTTPException(status_code=403, detail="仅园区或管理员可创建政策")
    policy = Policy(id=uuid4().hex, **body.model_dump())
    if current_user.role == "park":
        policy.source_type = "park"
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return ResponseModel(data=PolicyResponse.model_validate(policy))


@router.post("/{policy_id}/favorite", response_model=ResponseModel)
async def favorite_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.policy_id == policy_id)
    )
    if existing.scalar_one_or_none():
        return ResponseModel(message="已收藏")
    db.add(Favorite(id=uuid4().hex, user_id=current_user.id, policy_id=policy_id))
    await db.commit()
    return ResponseModel(message="收藏成功")


@router.delete("/{policy_id}/favorite", response_model=ResponseModel)
async def unfavorite_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.policy_id == policy_id)
    )
    fav = result.scalar_one_or_none()
    if fav:
        await db.delete(fav)
        await db.commit()
    return ResponseModel(message="取消收藏")
