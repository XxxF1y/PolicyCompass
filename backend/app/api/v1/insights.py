from collections import Counter, defaultdict
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.enterprise import Enterprise
from app.models.park import Park
from app.models.user import User
from app.schemas.common import ResponseModel

router = APIRouter()


def _value_from_keys(raw: dict[str, Any] | None, keys: list[str], default: str = "") -> str:
    if not isinstance(raw, dict):
        return default
    for key in keys:
        value = raw.get(key)
        if value is None:
            continue
        text = str(value).strip()
        if text:
            return text
    return default


def _normalize_industry(raw: str) -> str:
    text = (raw or "").strip()
    if not text:
        return "未知"
    if "芯片" in text:
        return "AI芯片"
    if "模型" in text:
        return "基础模型"
    if "算法" in text:
        return "算法服务"
    if "数据" in text:
        return "数据服务"
    if "机器人" in text or "终端" in text or "硬件" in text:
        return "智能硬件"
    if "医疗" in text or "金融" in text or "制造" in text or "教育" in text:
        return "行业应用"
    if "应用" in text:
        return "行业应用"
    return text


def _industry_chain_level(industry: str) -> int:
    mapping = {
        "AI芯片": 1,
        "基础模型": 2,
        "算法服务": 3,
        "数据服务": 4,
        "行业应用": 5,
        "智能硬件": 6,
        "未知": 99,
    }
    return mapping.get(industry, 99)


def _guess_in_park(ent: Enterprise, park_name: str) -> bool:
    basic = ent.basic_info or {}
    opc = ent.opc_info or {}
    joined = " ".join(
        [
            _value_from_keys(basic, ["所属园区", "入驻园区", "园区名称", "所在园区"]),
            _value_from_keys(opc, ["入驻OPC社区", "OPC社区名称", "是否已加入OPC创新生态圈", "是否 OPC 企业"]),
        ]
    )
    if park_name and park_name in joined:
        return True
    if "已入驻" in joined or "是" in joined:
        return True
    return False


def _extract_location(ent: Enterprise) -> tuple[str, str]:
    basic = ent.basic_info or {}
    reg = _value_from_keys(
        basic,
        ["企业注册地", "注册地址", "注册地", "注册城市", "公司注册地址"],
        default="未知",
    )
    office = _value_from_keys(
        basic,
        ["实际办公地", "办公地址", "办公地", "所在城市", "公司办公地址"],
        default="未知",
    )
    return reg, office


def _extract_target_fields(ent: Enterprise) -> dict[str, str]:
    basic = ent.basic_info or {}
    operation = ent.operation_data or {}
    opc = ent.opc_info or {}
    certifications = ent.certifications or {}

    industry_raw = _value_from_keys(
        basic,
        ["所属赛道", "行业方向", "主营行业", "行业", "AI技术方向"],
        default="未知",
    )
    stage = _value_from_keys(
        opc,
        ["OPC创业阶段", "创业阶段", "融资阶段"],
        default=_value_from_keys(operation, ["发展阶段", "企业阶段"], default="未知"),
    )
    ai_direction = _value_from_keys(
        opc,
        ["AI技术方向", "技术方向"],
        default=industry_raw,
    )
    product_type = _value_from_keys(
        opc,
        ["AI产品/服务类型", "产品类型", "服务类型"],
        default=_value_from_keys(basic, ["产品类型", "主营产品"], default="未知"),
    )
    team_size = _value_from_keys(operation, ["员工规模", "团队规模", "人员规模"], default="")
    revenue = _value_from_keys(operation, ["年营收(万元)", "年营收", "营收规模"], default="")
    financing = _value_from_keys(operation, ["融资阶段", "融资情况"], default="")
    cert = _value_from_keys(certifications, ["核心资质", "资质等级"], default="")
    reg, office = _extract_location(ent)
    location = office if office != "未知" else reg

    size_parts = [part for part in [financing, team_size, revenue] if part]
    if not size_parts:
        size_parts = [cert] if cert else ["信息待补充"]

    return {
        "industry_raw": industry_raw,
        "industry": _normalize_industry(industry_raw),
        "opc_stage": stage or "未知",
        "ai_direction": ai_direction or "未知",
        "product_type": product_type or "未知",
        "size": "、".join(size_parts),
        "location": location,
    }


@router.get("/park/insights", response_model=ResponseModel)
async def get_park_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    park = (
        await db.execute(select(Park).where(Park.user_id == current_user.id))
    ).scalar_one_or_none()
    park_name = park.name if park and park.name else ""

    enterprises = (await db.execute(select(Enterprise))).scalars().all()

    industry_counter: Counter[str] = Counter()
    reg_counter: Counter[str] = Counter()
    office_counter: Counter[str] = Counter()
    month_counter: dict[str, Counter[str]] = defaultdict(Counter)

    for ent in enterprises:
        fields = _extract_target_fields(ent)
        industry = fields["industry"]
        industry_counter[industry] += 1

        reg, office = _extract_location(ent)
        reg_counter[reg] += 1
        office_counter[office] += 1

        month = (ent.created_at.date() if ent.created_at else date.today()).strftime("%Y-%m")
        month_counter[month][industry] += 1

    heatmap = [
        {"industry": k, "count": v, "heat": min(100, v * 20)}
        for k, v in industry_counter.most_common()
    ]

    geo_distribution = []
    for city, count in reg_counter.items():
        geo_distribution.append({"city": city, "count": count, "kind": "registered"})
    for city, count in office_counter.items():
        geo_distribution.append({"city": city, "count": count, "kind": "office"})

    industries_by_level = sorted(industry_counter.keys(), key=_industry_chain_level)
    chain_nodes = [
        {
            "id": f"ind-{name}",
            "name": name,
            "category": "industry",
            "size": max(12, min(40, 12 + industry_counter[name] * 2)),
        }
        for name in industries_by_level
    ]
    chain_links = []
    for idx in range(len(industries_by_level) - 1):
        source = industries_by_level[idx]
        target = industries_by_level[idx + 1]
        weight = min(industry_counter[source], industry_counter[target])
        if weight <= 0:
            continue
        chain_links.append(
            {
                "source": f"ind-{source}",
                "target": f"ind-{target}",
                "relation": "supply",
                "weight": weight,
            }
        )

    trend_rows = []
    for month in sorted(month_counter.keys()):
        by_industry = month_counter[month]
        trend_rows.append(
            {
                "month": month,
                "total": int(sum(by_industry.values())),
                "series": [{"industry": k, "count": v} for k, v in by_industry.items()],
            }
        )

    in_park_count = 0
    for ent in enterprises:
        if _guess_in_park(ent, park_name):
            in_park_count += 1

    return ResponseModel(
        data={
            "park_name": park_name,
            "overview": {
                "total_enterprises": len(enterprises),
                "in_park_enterprises": in_park_count,
                "outside_enterprises": max(0, len(enterprises) - in_park_count),
                "industry_types": len(industry_counter),
            },
            "industry_heatmap": heatmap,
            "geo_distribution": geo_distribution,
            "industry_chain": {"nodes": chain_nodes, "links": chain_links},
            "time_trends": trend_rows,
        }
    )


@router.get("/park/investment-targets", response_model=ResponseModel)
async def get_park_investment_targets(
    keyword: str | None = Query(default=None),
    opc_stage: str | None = Query(default=None),
    ai_direction: str | None = Query(default=None),
    product_type: str | None = Query(default=None),
    in_park: bool | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    park = (
        await db.execute(select(Park).where(Park.user_id == current_user.id))
    ).scalar_one_or_none()
    park_name = park.name if park and park.name else ""

    enterprises = (await db.execute(select(Enterprise))).scalars().all()
    normalized_keyword = (keyword or "").strip().lower()

    def _matches_filter(text: str, query: str | None) -> bool:
        if not query:
            return True
        return query.strip().lower() in (text or "").lower()

    items = []
    for ent in enterprises:
        fields = _extract_target_fields(ent)
        is_in_park = _guess_in_park(ent, park_name)
        if in_park is not None and in_park != is_in_park:
            continue

        haystack = " ".join(
            [
                ent.name or "",
                fields["industry_raw"],
                fields["ai_direction"],
                fields["product_type"],
                fields["location"],
            ]
        ).lower()
        if normalized_keyword and normalized_keyword not in haystack:
            continue
        if not _matches_filter(fields["opc_stage"], opc_stage):
            continue
        if not _matches_filter(fields["ai_direction"], ai_direction):
            continue
        if not _matches_filter(fields["product_type"], product_type):
            continue

        match_score = 60
        if not is_in_park:
            match_score += 15
        if fields["opc_stage"] != "未知":
            match_score += 10
        if "AI" in fields["industry_raw"] or "算法" in fields["industry_raw"] or "模型" in fields["industry_raw"]:
            match_score += 10
        match_score = min(match_score, 98)

        value_points = [
            {"text": f"行业方向：{fields['industry_raw'] or fields['industry']}", "type": "high"},
            {"text": f"技术方向：{fields['ai_direction']}"},
            {"text": f"产品/服务：{fields['product_type']}"},
        ]
        strategy = [
            "建议先推送园区适配政策，再安排线下对接",
            "结合企业阶段提供空间、算力和资金组合包",
        ]
        if not is_in_park:
            strategy.insert(0, "当前未入驻园区，可列入重点招商池")

        items.append(
            {
                "id": ent.id,
                "name": ent.name or "未命名企业",
                "in_park": is_in_park,
                "matchScore": f"{match_score}%",
                "industry": fields["industry_raw"] or fields["industry"],
                "size": fields["size"],
                "location": fields["location"],
                "opcStage": fields["opc_stage"],
                "aiDirection": fields["ai_direction"],
                "productType": fields["product_type"],
                "valuePoints": value_points,
                "strategy": strategy,
            }
        )

    items.sort(key=lambda x: (x["in_park"], -int(x["matchScore"].replace("%", "")), x["name"]))
    recommended = [item for item in items if not item["in_park"]][:10]

    return ResponseModel(
        data={
            "park_name": park_name,
            "summary": {
                "total": len(items),
                "recommended": len(recommended),
                "out_of_park": len([item for item in items if not item["in_park"]]),
            },
            "recommended": recommended,
            "items": items,
        }
    )


@router.get("/industry-map/{park_id}", response_model=ResponseModel)
async def get_industry_map_legacy(park_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = await get_park_insights(db=db, current_user=current_user)
    return ResponseModel(data={"park_id": park_id, **data.data})


@router.get("/investment-targets/{park_id}", response_model=ResponseModel)
async def get_investment_targets_legacy(
    park_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = await get_park_investment_targets(db=db, current_user=current_user)
    return ResponseModel(data={"park_id": park_id, **data.data})
