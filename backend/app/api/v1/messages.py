from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.message import Message
from app.models.user import User
from app.schemas.common import PaginatedData, ResponseModel
from app.schemas.message import MessageListItem, MessageResponse

router = APIRouter()


@router.get("", response_model=ResponseModel[PaginatedData[MessageListItem]])
async def list_messages(
    msg_type: str | None = None,
    is_read: bool | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Message).where(Message.user_id == current_user.id)
    count_query = select(func.count()).select_from(Message).where(Message.user_id == current_user.id)
    if msg_type:
        query = query.where(Message.msg_type == msg_type)
        count_query = count_query.where(Message.msg_type == msg_type)
    if is_read is not None:
        query = query.where(Message.is_read == is_read)
        count_query = count_query.where(Message.is_read == is_read)
    result = await db.execute(query.order_by(Message.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    total = (await db.execute(count_query)).scalar() or 0
    items = [MessageListItem.model_validate(m) for m in result.scalars().all()]
    return ResponseModel(data=PaginatedData(total=int(total), page=page, page_size=page_size, items=items))


@router.get("/{message_id}", response_model=ResponseModel[MessageResponse])
async def get_message(
    message_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = (
        await db.execute(select(Message).where(Message.id == message_id, Message.user_id == current_user.id).limit(1))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Message not found")
    return ResponseModel(data=MessageResponse.model_validate(row))


@router.patch("/{message_id}/read", response_model=ResponseModel)
async def mark_message_read(
    message_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = (
        await db.execute(select(Message).where(Message.id == message_id, Message.user_id == current_user.id).limit(1))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Message not found")
    if not row.is_read:
        await db.execute(
            update(Message).where(Message.id == message_id, Message.user_id == current_user.id).values(is_read=True)
        )
        await db.commit()
    return ResponseModel(message="已标记为已读")


@router.patch("/read-all", response_model=ResponseModel)
async def mark_all_read(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.execute(update(Message).where(Message.user_id == current_user.id, Message.is_read == False).values(is_read=True))
    await db.commit()
    return ResponseModel(message="全部已读")


@router.post("/read-all", response_model=ResponseModel)
async def mark_all_read_compat(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.execute(update(Message).where(Message.user_id == current_user.id, Message.is_read == False).values(is_read=True))
    await db.commit()
    return ResponseModel(message="全部已读")


@router.delete("/{message_id}", response_model=ResponseModel)
async def delete_message(
    message_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exists = (
        await db.execute(select(Message.id).where(Message.id == message_id, Message.user_id == current_user.id).limit(1))
    ).scalar_one_or_none()
    if not exists:
        raise HTTPException(status_code=404, detail="Message not found")
    await db.execute(delete(Message).where(Message.id == message_id, Message.user_id == current_user.id))
    await db.commit()
    return ResponseModel(message="删除成功")
