from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.talent import Talent
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.talent import TalentResponse, TalentUpdate

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


def _calc_talent_completeness(talent: Talent) -> float:
    jsonb_fields = [
        "basic_info",
        "education",
        "work_experience",
        "professional_skills",
        "achievements",
        "talent_titles",
        "social_insurance",
        "opc_info",
    ]
    filled = sum(1 for f in jsonb_fields if _is_filled(getattr(talent, f)))
    return round(filled / len(jsonb_fields) * 100, 1)


@router.get("/mine", response_model=ResponseModel[TalentResponse])
async def get_my_talent(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Talent).where(Talent.user_id == current_user.id))
    talent = result.scalar_one_or_none()
    if not talent:
        raise HTTPException(status_code=404, detail="人才档案不存在")
    return ResponseModel(data=TalentResponse.model_validate(talent))


@router.get("/{talent_id}", response_model=ResponseModel[TalentResponse])
async def get_talent(talent_id: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Talent).where(Talent.id == talent_id))
    talent = result.scalar_one_or_none()
    if not talent:
        raise HTTPException(status_code=404, detail="人才档案不存在")
    return ResponseModel(data=TalentResponse.model_validate(talent))


@router.put("/{talent_id}", response_model=ResponseModel[TalentResponse])
async def update_talent(
    talent_id: str,
    body: TalentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Talent).where(Talent.id == talent_id))
    talent = result.scalar_one_or_none()
    if not talent:
        raise HTTPException(status_code=404, detail="人才档案不存在")
    if talent.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(talent, field, value)
    talent.completeness_score = _calc_talent_completeness(talent)
    await db.commit()
    await db.refresh(talent)
    return ResponseModel(data=TalentResponse.model_validate(talent))
