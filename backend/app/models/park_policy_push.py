from datetime import date, datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ParkPolicyPush(Base):
    __tablename__ = "park_policy_pushes"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    park_id: Mapped[str] = mapped_column(String(32), ForeignKey("parks.id"), index=True)

    policy_title: Mapped[str] = mapped_column(String(255), index=True)
    policy_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    issuing_department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    publish_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    deadline: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    applicable_targets: Mapped[Optional[list[str]]] = mapped_column(JSONB, nullable=True)
    regions: Mapped[Optional[list[str]]] = mapped_column(JSONB, nullable=True)
    channels: Mapped[Optional[list[str]]] = mapped_column(JSONB, nullable=True)
    target_tags: Mapped[Optional[list[str]]] = mapped_column(JSONB, nullable=True)
    keywords: Mapped[Optional[list[str]]] = mapped_column(JSONB, nullable=True)
    push_scope: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    status: Mapped[str] = mapped_column(String(20), default="active", index=True)

    reach_count: Mapped[int] = mapped_column(Integer, default=0)
    open_count: Mapped[int] = mapped_column(Integer, default=0)
    click_count: Mapped[int] = mapped_column(Integer, default=0)
    intent_count: Mapped[int] = mapped_column(Integer, default=0)
    conversion_rate: Mapped[float] = mapped_column(default=0.0)
    last_pushed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


class ParkPolicyPushLog(Base):
    __tablename__ = "park_policy_push_logs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    push_id: Mapped[str] = mapped_column(String(32), ForeignKey("park_policy_pushes.id"), index=True)
    channel: Mapped[str] = mapped_column(String(30), default="站内消息")
    batch_no: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    reach_count: Mapped[int] = mapped_column(Integer, default=0)
    open_count: Mapped[int] = mapped_column(Integer, default=0)
    click_count: Mapped[int] = mapped_column(Integer, default=0)
    intent_count: Mapped[int] = mapped_column(Integer, default=0)

    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
