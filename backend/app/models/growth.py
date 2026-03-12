from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class GrowthStage(Base):
    __tablename__ = "growth_stages"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    period: Mapped[str] = mapped_column(String(40))
    bg_color: Mapped[str] = mapped_column(String(40))
    width: Mapped[int] = mapped_column(Integer)
    order_no: Mapped[int] = mapped_column(Integer, index=True)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


class GrowthNode(Base):
    __tablename__ = "growth_nodes"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    stage_id: Mapped[Optional[str]] = mapped_column(String(32), ForeignKey("growth_stages.id"), nullable=True, index=True)
    label: Mapped[str] = mapped_column(String(100))
    node_type: Mapped[str] = mapped_column(String(30))
    status: Mapped[str] = mapped_column(String(20))
    x: Mapped[int] = mapped_column(Integer)
    y: Mapped[int] = mapped_column(Integer)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    benefit: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    cost: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    tags_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    conditions_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    order_no: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


class GrowthConnection(Base):
    __tablename__ = "growth_connections"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    from_node_id: Mapped[str] = mapped_column(String(32), ForeignKey("growth_nodes.id"), index=True)
    to_node_id: Mapped[str] = mapped_column(String(32), ForeignKey("growth_nodes.id"), index=True)
    order_no: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())


class GrowthSummary(Base):
    __tablename__ = "growth_summaries"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    scenario: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    total_estimated_benefit: Mapped[str] = mapped_column(String(50))
    current_stage: Mapped[str] = mapped_column(String(100))
    next_recommendation: Mapped[str] = mapped_column(String(200))
    next_recommendation_node_id: Mapped[Optional[str]] = mapped_column(
        String(32), ForeignKey("growth_nodes.id"), nullable=True, index=True
    )

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
