from collections import defaultdict
from datetime import date, timedelta
import json

from fastapi import APIRouter, Depends
from sqlalchemy import case, distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.application import Application
from app.models.enterprise import Enterprise
from app.models.match_result import MatchResult
from app.models.material import Material
from app.models.message import Message
from app.models.park import Park
from app.models.policy import Policy
from app.models.talent import Talent
from app.models.user import User
from app.models.growth import (
    GrowthConnection as GrowthConnectionModel,
    GrowthNode as GrowthNodeModel,
    GrowthStage as GrowthStageModel,
    GrowthSummary as GrowthSummaryModel,
)
from app.schemas.common import ResponseModel
from app.schemas.dashboard import (
    DashboardOverviewResponse,
    DashboardTask,
    GrowthConnection,
    GrowthNavigatorResponse,
    GrowthNode,
    GrowthStage,
    GrowthSummary,
    TrendDataPoint,
)

router = APIRouter()


@router.get("/enterprise/overview", response_model=ResponseModel[DashboardOverviewResponse])
async def get_enterprise_overview(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    week_later = today + timedelta(days=7)

    profile_completion = 0.0
    display_name = current_user.phone
    if current_user.role in ("tech_enterprise", "transform_enterprise"):
        ent = (await db.execute(select(Enterprise).where(Enterprise.user_id == current_user.id))).scalar_one_or_none()
        profile_completion = round(ent.completeness_score, 1) if ent else 0.0
        if ent and ent.name:
            display_name = ent.name
    elif current_user.role == "talent":
        talent = (await db.execute(select(Talent).where(Talent.user_id == current_user.id))).scalar_one_or_none()
        profile_completion = round(talent.completeness_score, 1) if talent else 0.0
        if talent and talent.name:
            display_name = talent.name
    elif current_user.role == "park":
        park = (await db.execute(select(Park).where(Park.user_id == current_user.id))).scalar_one_or_none()
        profile_completion = round(park.completeness_score, 1) if park else 0.0
        if park and park.name:
            display_name = park.name

    open_policies_count = (
        await db.execute(
            select(func.count())
            .select_from(MatchResult)
            .join(Policy, MatchResult.policy_id == Policy.id)
            .where(
                MatchResult.user_id == current_user.id,
                MatchResult.match_score >= 80,
                Policy.status == "active",
                Policy.apply_end_date.is_not(None),
                Policy.apply_end_date >= today,
                Policy.apply_end_date <= week_later,
            )
        )
    ).scalar() or 0

    estimated_amount = (
        await db.execute(
            select(func.coalesce(func.sum(MatchResult.estimated_amount), 0.0))
            .where(MatchResult.user_id == current_user.id, MatchResult.match_score >= 50)
        )
    ).scalar() or 0.0

    highly_matched_count = (
        await db.execute(
            select(func.count()).where(MatchResult.user_id == current_user.id, MatchResult.match_score >= 80)
        )
    ).scalar() or 0

    blocked_policies_count = (
        await db.execute(
            select(func.count()).where(MatchResult.user_id == current_user.id, MatchResult.match_score < 50)
        )
    ).scalar() or 0

    processing_statuses = (
        "draft",
        "generating",
        "pre_reviewed",
        "pending_redirect",
        "redirected",
        "estimated_reviewing",
        "reviewing",
    )
    processing_count = (
        await db.execute(
            select(func.count()).where(
                Application.user_id == current_user.id,
                Application.status.in_(processing_statuses),
            )
        )
    ).scalar() or 0

    fatal_blocker_count = (
        await db.execute(
            select(func.count()).where(
                MatchResult.user_id == current_user.id,
                MatchResult.match_score < 50,
                MatchResult.gap_list.is_not(None),
            )
        )
    ).scalar() or 0

    fatal_gap = (
        await db.execute(
            select(MatchResult.gap_list)
            .where(
                MatchResult.user_id == current_user.id,
                MatchResult.match_score < 50,
                MatchResult.gap_list.is_not(None),
            )
            .limit(1)
        )
    ).scalar_one_or_none()
    fatal_blocker_reason = "暂无致命卡点"
    if isinstance(fatal_gap, dict):
        if fatal_gap.get("reason"):
            fatal_blocker_reason = str(fatal_gap["reason"])
        elif fatal_gap.get("message"):
            fatal_blocker_reason = str(fatal_gap["message"])
    elif isinstance(fatal_gap, list) and fatal_gap:
        first = fatal_gap[0]
        if isinstance(first, dict):
            fatal_blocker_reason = str(first.get("message") or first.get("reason") or "存在前置条件未满足")
        else:
            fatal_blocker_reason = str(first)

    month_rows = (
        await db.execute(
            select(MatchResult.calculated_at, MatchResult.estimated_amount)
            .where(MatchResult.user_id == current_user.id)
        )
    ).all()
    monthly_sum: dict[int, float] = defaultdict(float)
    for calc_at, amount in month_rows:
        if calc_at is None:
            continue
        monthly_sum[calc_at.month] += float(amount or 0.0)

    trend_data: list[TrendDataPoint] = []
    for i in range(5, -1, -1):
        m = (today.month - i - 1) % 12 + 1
        trend_data.append(TrendDataPoint(month=f"{m}月", subsidies=round(monthly_sum.get(m, 0.0), 2)))

    total_policies = (await db.execute(select(func.count()).select_from(Policy))).scalar() or 0
    matched_enterprises = (await db.execute(select(func.count(distinct(MatchResult.user_id))))).scalar() or 0
    generated_materials = (await db.execute(select(func.count()).select_from(Material))).scalar() or 0

    result_stats = (
        await db.execute(
            select(
                func.count(case((Application.actual_result.is_not(None), 1))).label("reviewed"),
                func.count(case((Application.actual_result == "passed", 1))).label("passed"),
            )
        )
    ).one()
    reviewed_count = int(result_stats.reviewed or 0)
    passed_count = int(result_stats.passed or 0)
    success_rate = "0%"
    if reviewed_count > 0:
        success_rate = f"{(passed_count / reviewed_count) * 100:.1f}%"

    overview = DashboardOverviewResponse(
        displayName=display_name,
        profileCompletion=profile_completion,
        openPoliciesCount=int(open_policies_count),
        estimatedAmount=round(float(estimated_amount), 2),
        amountUnit="万元",
        opcComputeCoupon=0,
        opcModelCoupon=0,
        highlyMatchedCount=int(highly_matched_count),
        blockedPoliciesCount=int(blocked_policies_count),
        processingCount=int(processing_count),
        fatalBlockerCount=int(fatal_blocker_count),
        fatalBlockerReason=fatal_blocker_reason,
        trendData=trend_data,
        total_policies=int(total_policies),
        matched_enterprises=int(matched_enterprises),
        generated_materials=int(generated_materials),
        success_rate=success_rate,
    )
    return ResponseModel(data=overview)


@router.get("/enterprise/tasks", response_model=ResponseModel[list[DashboardTask]])
async def get_enterprise_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks: list[DashboardTask] = []

    app_rows = (
        await db.execute(
            select(Application)
            .where(Application.user_id == current_user.id)
            .order_by(Application.updated_at.desc())
            .limit(3)
        )
    ).scalars().all()
    for app in app_rows:
        status_map = {
            "draft": "草稿",
            "generating": "材料生成中",
            "pre_reviewed": "已预审",
            "pending_redirect": "待前往申报",
            "redirected": "已前往申报",
            "estimated_reviewing": "预估审核中",
            "reviewing": "审核中",
            "feedback_passed": "已通过",
            "feedback_rejected": "未通过",
            "feedback_returned": "已退回",
        }
        tasks.append(
            DashboardTask(
                id=f"app-{app.id}",
                category="申报中心",
                title=f"申报任务 #{app.id[:8]}",
                summary=f"当前状态：{status_map.get(app.status, app.status)}",
                status=app.status,
                progress=70 if app.status in ("estimated_reviewing", "reviewing") else 40,
                updatedAt=str((app.updated_at or app.created_at).date()),
                actionLabel="查看申报",
                actionPath="/applications",
            )
        )

    blocker = (
        await db.execute(
            select(MatchResult)
            .where(MatchResult.user_id == current_user.id, MatchResult.match_score < 50)
            .order_by(MatchResult.calculated_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()
    if blocker:
        reason = "存在前置条件未满足"
        if isinstance(blocker.gap_list, dict):
            reason = str(blocker.gap_list.get("message") or blocker.gap_list.get("reason") or reason)
        tasks.insert(
            0,
            DashboardTask(
                id=f"blocker-{blocker.id}",
                category="画像中心",
                title="补充关键画像信息以解锁政策",
                summary=reason,
                status="blocked",
                progress=10,
                updatedAt=str(blocker.calculated_at.date()),
                actionLabel="去完善",
                actionPath="/profile",
            ),
        )

    msg = (
        await db.execute(
            select(Message)
            .where(Message.user_id == current_user.id, Message.is_read == False)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()
    if msg:
        tasks.append(
            DashboardTask(
                id=f"msg-{msg.id}",
                category="消息中心",
                title=msg.title,
                summary=(msg.content or "有新消息待处理")[:80],
                status="unread",
                progress=0,
                updatedAt=str(msg.created_at.date()),
                actionLabel="查看消息",
                actionPath="/messages",
            )
        )

    if not tasks:
        tasks = [
            DashboardTask(
                id="bootstrap-profile",
                category="画像中心",
                title="完善画像以提升匹配精准度",
                summary="完善企业/人才基础信息可显著提升政策匹配质量",
                status="todo",
                progress=20,
                updatedAt=str(date.today()),
                actionLabel="去完善",
                actionPath="/profile",
            )
        ]

    return ResponseModel(data=tasks[:4])


@router.get("/enterprise/growth", response_model=ResponseModel[GrowthNavigatorResponse])
async def get_enterprise_growth(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    stage_rows = (
        await db.execute(select(GrowthStageModel).order_by(GrowthStageModel.order_no.asc(), GrowthStageModel.created_at.asc()))
    ).scalars().all()
    node_rows = (
        await db.execute(select(GrowthNodeModel).order_by(GrowthNodeModel.order_no.asc(), GrowthNodeModel.created_at.asc()))
    ).scalars().all()
    conn_rows = (
        await db.execute(
            select(GrowthConnectionModel)
            .order_by(GrowthConnectionModel.order_no.asc(), GrowthConnectionModel.created_at.asc())
        )
    ).scalars().all()
    summary_row = (
        await db.execute(select(GrowthSummaryModel).where(GrowthSummaryModel.scenario == "enterprise_default").limit(1))
    ).scalar_one_or_none()

    node_id_to_code = {n.id: n.code for n in node_rows}

    stages = [
        GrowthStage(id=s.code, title=s.title, period=s.period, bgColor=s.bg_color, width=s.width) for s in stage_rows
    ]
    nodes = []
    for n in node_rows:
        tags: list[str] = []
        conditions: list[str] = []
        if n.tags_json:
            try:
                parsed_tags = json.loads(n.tags_json)
                if isinstance(parsed_tags, list):
                    tags = [str(t) for t in parsed_tags]
            except json.JSONDecodeError:
                tags = []
        if n.conditions_json:
            try:
                parsed_conditions = json.loads(n.conditions_json)
                if isinstance(parsed_conditions, list):
                    conditions = [str(c) for c in parsed_conditions]
            except json.JSONDecodeError:
                conditions = []

        nodes.append(
            GrowthNode(
                id=n.code,
                label=n.label,
                type=n.node_type,
                status=n.status,
                x=n.x,
                y=n.y,
                description=n.description,
                benefit=n.benefit,
                cost=n.cost,
                tags=tags,
                conditions=conditions,
            )
        )

    connections = [
        GrowthConnection(from_node=node_id_to_code.get(c.from_node_id, ""), to_node=node_id_to_code.get(c.to_node_id, ""))
        for c in conn_rows
        if c.from_node_id in node_id_to_code and c.to_node_id in node_id_to_code
    ]

    summary = GrowthSummary(
        totalEstimatedBenefit=summary_row.total_estimated_benefit if summary_row else "",
        currentStage=summary_row.current_stage if summary_row else "",
        nextRecommendation=summary_row.next_recommendation if summary_row else "",
        nextRecommendationNodeId=(
            node_id_to_code.get(summary_row.next_recommendation_node_id, "") if summary_row else ""
        ),
    )

    data = GrowthNavigatorResponse(stages=stages, nodes=nodes, connections=connections, summary=summary)
    return ResponseModel(data=data)
