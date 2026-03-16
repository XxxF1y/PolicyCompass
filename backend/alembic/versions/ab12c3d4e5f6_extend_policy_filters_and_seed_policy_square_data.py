"""extend policy filters and seed policy square data

Revision ID: ab12c3d4e5f6
Revises: e91f4c4d3a21
Create Date: 2026-03-13 00:20:00.000000

"""

from datetime import date
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "ab12c3d4e5f6"
down_revision: Union[str, None] = "e91f4c4d3a21"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("policies", sa.Column("support_domain", sa.String(length=20), nullable=True))
    op.add_column("policies", sa.Column("applicable_target", sa.String(length=20), nullable=True))
    op.add_column("policies", sa.Column("department_category", sa.String(length=20), nullable=True))
    op.create_index(op.f("ix_policies_support_domain"), "policies", ["support_domain"], unique=False)
    op.create_index(op.f("ix_policies_applicable_target"), "policies", ["applicable_target"], unique=False)
    op.create_index(op.f("ix_policies_department_category"), "policies", ["department_category"], unique=False)

    bind = op.get_bind()
    existing = bind.execute(
        sa.text("select count(*) from policies where id in ('p1','p2','p3','p4')")
    ).scalar() or 0
    if existing == 0:
        policy_table = sa.table(
            "policies",
            sa.column("id", sa.String(32)),
            sa.column("title", sa.String(255)),
            sa.column("policy_number", sa.String(100)),
            sa.column("issuing_authority", sa.String(100)),
            sa.column("level", sa.String(20)),
            sa.column("policy_type", sa.String(20)),
            sa.column("support_domain", sa.String(20)),
            sa.column("applicable_target", sa.String(20)),
            sa.column("department_category", sa.String(20)),
            sa.column("classification", postgresql.JSONB(astext_type=sa.Text())),
            sa.column("support_details", postgresql.JSONB(astext_type=sa.Text())),
            sa.column("application_info", postgresql.JSONB(astext_type=sa.Text())),
            sa.column("conditions", postgresql.JSONB(astext_type=sa.Text())),
            sa.column("prerequisites", postgresql.JSONB(astext_type=sa.Text())),
            sa.column("materials_required", postgresql.JSONB(astext_type=sa.Text())),
            sa.column("source_type", sa.String(20)),
            sa.column("source_park_id", sa.String(32)),
            sa.column("is_opc_policy", sa.Boolean()),
            sa.column("region", sa.String(50)),
            sa.column("status", sa.String(20)),
            sa.column("review_status", sa.String(20)),
            sa.column("original_text", sa.Text()),
            sa.column("interpretation", sa.Text()),
            sa.column("publish_date", sa.Date()),
            sa.column("effective_date", sa.Date()),
            sa.column("expiry_date", sa.Date()),
            sa.column("apply_start_date", sa.Date()),
            sa.column("apply_end_date", sa.Date()),
            sa.column("official_url", sa.String(500)),
            sa.column("apply_url", sa.String(500)),
        )

        op.bulk_insert(
            policy_table,
            [
                {
                    "id": "p1",
                    "title": "人工智能算力平台专项补贴",
                    "policy_number": "SZGX-2024-001",
                    "issuing_authority": "苏州市工信局",
                    "level": "市",
                    "policy_type": "资金补贴",
                    "support_domain": "算力",
                    "applicable_target": "科技企业",
                    "department_category": "工信部",
                    "classification": {"tags": ["算力补贴", "OPC先行"]},
                    "support_details": {
                        "amount": "最高 50 万",
                        "match_score": 100,
                        "match_reason": "企业算力需求与政策支持方向高度一致",
                        "supports": [{"title": "算力补贴", "desc": "按实际支付算力费用30%给予补贴，最高200万元"}],
                    },
                    "application_info": {
                        "process": [
                            {"step": 1, "title": "线上申报", "date": "截止 2024.05.31", "status": "pending"},
                            {"step": 2, "title": "算力核验", "date": "预计 6月中旬", "status": "upcoming"},
                        ]
                    },
                    "conditions": {
                        "required": [
                            {"text": "注册满1年以上", "met": True},
                            {"text": "年度算力支出规模≥50万元", "met": True},
                        ],
                        "bonus": [{"text": "使用国产GPU算力", "score": "+10分", "met": True}],
                        "exclusion": [{"text": "近3年无重大安全事故", "passed": True}],
                    },
                    "prerequisites": {"blockers": [], "blocker_details": []},
                    "materials_required": {
                        "templates": [
                            {"id": "m1", "name": "企业注册登记表", "status": "ready", "sourceOrHint": "已从素材库匹配：营业执照"},
                            {"id": "m2", "name": "算力服务合同与发票", "status": "ready", "sourceOrHint": "已从素材库匹配：算力凭证"},
                        ]
                    },
                    "source_type": "government",
                    "source_park_id": None,
                    "is_opc_policy": True,
                    "region": "苏州",
                    "status": "active",
                    "review_status": "unreviewed",
                    "original_text": "人工智能算力补贴政策原文",
                    "interpretation": "鼓励企业使用合规算力资源，降低训练成本。",
                    "publish_date": date(2024, 3, 15),
                    "effective_date": date(2024, 3, 15),
                    "expiry_date": date(2025, 12, 31),
                    "apply_start_date": date(2024, 3, 20),
                    "apply_end_date": date(2024, 5, 31),
                    "official_url": None,
                    "apply_url": None,
                },
                {
                    "id": "p2",
                    "title": "企业研发机构与创新平台奖励",
                    "policy_number": "JSKJ-2024-118",
                    "issuing_authority": "江苏省科技厅",
                    "level": "省",
                    "policy_type": "资质认定",
                    "support_domain": "技术",
                    "applicable_target": "科技企业",
                    "department_category": "科技部",
                    "classification": {"tags": ["研发资金", "省级专项"]},
                    "support_details": {
                        "amount": "30 - 100 万",
                        "match_score": 85,
                        "match_reason": "研发投入达标但知识产权数量不足",
                    },
                    "application_info": {
                        "process": [{"step": 1, "title": "省厅申报", "date": "截止 2024.10.31", "status": "pending"}]
                    },
                    "conditions": {
                        "required": [
                            {"text": "在省内注册满3年以上", "met": True},
                            {"text": "拥有核心自主知识产权≥5项", "met": False, "gap": "当前3项，还差2项"},
                        ],
                        "bonus": [{"text": "主导国家级标准", "score": "+20分", "met": False}],
                        "exclusion": [{"text": "近3年无环保处罚记录", "passed": True}],
                    },
                    "prerequisites": {
                        "blockers": [{"id": "b1", "type": "warning", "text": "核心知识产权数量不足"}],
                        "blocker_details": [
                            {
                                "id": "p2-b1",
                                "title": "核心知识产权数量不足",
                                "requirement": "拥有核心自主知识产权 ≥ 5 项",
                                "currentStatus": "当前仅3项",
                                "gap": "还差2项",
                                "suggestions": ["补齐软著/专利", "梳理已有成果避免漏录"],
                                "estimatedCost": "2-10 万",
                                "estimatedTimeline": "1-3 个月",
                            }
                        ],
                    },
                    "materials_required": {
                        "templates": [
                            {"id": "m1", "name": "企业注册登记表", "status": "ready", "sourceOrHint": "已从素材库匹配：营业执照"},
                            {"id": "m2", "name": "研发费用专项审计报告", "status": "missing", "sourceOrHint": "需会计师事务所出具"},
                        ]
                    },
                    "source_type": "government",
                    "source_park_id": None,
                    "is_opc_policy": False,
                    "region": "其他",
                    "status": "active",
                    "review_status": "unreviewed",
                    "original_text": "研发平台奖励政策原文",
                    "interpretation": "支持企业建设创新平台，提升研发组织能力。",
                    "publish_date": date(2024, 1, 10),
                    "effective_date": date(2024, 1, 10),
                    "expiry_date": date(2024, 10, 31),
                    "apply_start_date": date(2024, 6, 1),
                    "apply_end_date": date(2024, 10, 31),
                    "official_url": None,
                    "apply_url": None,
                },
                {
                    "id": "p3",
                    "title": "高新技术企业培育资金",
                    "policy_number": "SZKJ-2024-052",
                    "issuing_authority": "苏州市科技局",
                    "level": "市",
                    "policy_type": "资质认定",
                    "support_domain": "技术",
                    "applicable_target": "科技企业",
                    "department_category": "科技部",
                    "classification": {"tags": ["资质认定", "一票否决"]},
                    "support_details": {"amount": "20 万", "match_score": 49, "match_reason": "前置资质未满足"},
                    "application_info": {"process": [{"step": 1, "title": "系统填报", "date": "滚动申报", "status": "pending"}]},
                    "conditions": {
                        "required": [
                            {"text": "已入库成为国家科技型中小企业", "met": False, "gap": "前置依赖未达成"},
                            {"text": "高新收入占比≥60%", "met": True},
                        ],
                        "bonus": [],
                        "exclusion": [{"text": "无严重失信记录", "passed": True}],
                    },
                    "prerequisites": {
                        "blockers": [{"id": "b1", "type": "critical", "text": "前置资质缺失：未完成科小入库"}],
                        "blocker_details": [
                            {
                                "id": "p3-b1",
                                "title": "前置资质缺失：未完成科小入库",
                                "requirement": "已入库成为国家科技型中小企业",
                                "currentStatus": "当前状态：未入库",
                                "gap": "缺少前置身份",
                                "suggestions": ["优先完成科小入库流程", "完成后解锁高新培育申报资格"],
                                "estimatedCost": "0-5 万",
                                "estimatedTimeline": "1-2 个月",
                            }
                        ],
                    },
                    "materials_required": {
                        "templates": [
                            {"id": "m1", "name": "企业注册登记表", "status": "ready", "sourceOrHint": "已从素材库匹配：营业执照"},
                            {"id": "m2", "name": "科技型中小企业入库证明", "status": "missing", "sourceOrHint": "前置资质尚未完成"},
                        ]
                    },
                    "source_type": "government",
                    "source_park_id": None,
                    "is_opc_policy": False,
                    "region": "苏州",
                    "status": "active",
                    "review_status": "unreviewed",
                    "original_text": "高新技术企业培育政策原文",
                    "interpretation": "作为高新认定前置培育资金，优先支持创新主体。",
                    "publish_date": date(2024, 2, 1),
                    "effective_date": date(2024, 2, 1),
                    "expiry_date": date(2024, 11, 30),
                    "apply_start_date": date(2024, 2, 15),
                    "apply_end_date": date(2024, 9, 30),
                    "official_url": None,
                    "apply_url": None,
                },
                {
                    "id": "p4",
                    "title": "OPC 开发者生态联合入驻扶持",
                    "policy_number": "SIP-OPC-2024-008",
                    "issuing_authority": "苏州工业园区管委会",
                    "level": "园区",
                    "policy_type": "场景开放",
                    "support_domain": "生态",
                    "applicable_target": "OPC创业者",
                    "department_category": "园区/OPC社区",
                    "classification": {"tags": ["OPC专属", "场地资金"]},
                    "support_details": {"amount": "免租 2 年 + 启动金", "match_score": 45, "match_reason": "需先具备OPC社区入驻身份"},
                    "application_info": {
                        "process": [
                            {"step": 1, "title": "意向对接", "date": "常态化", "status": "pending"},
                            {"step": 2, "title": "入驻签约", "date": "待定", "status": "upcoming"},
                        ]
                    },
                    "conditions": {
                        "required": [
                            {"text": "入驻官方认证的OPC产业载体", "met": False, "gap": "当前注册地址非OPC园区"},
                            {"text": "核心团队规模≥10人", "met": True},
                        ],
                        "bonus": [{"text": "创始人具备顶尖AI背景", "score": "直接过审", "met": False}],
                        "exclusion": [{"text": "近2年无重大法律诉讼", "passed": True}],
                    },
                    "prerequisites": {
                        "blockers": [{"id": "b1", "type": "critical", "text": "未入驻OPC社区"}],
                        "blocker_details": [
                            {
                                "id": "p4-b1",
                                "title": "未入驻OPC社区",
                                "requirement": "企业注册地需在官方认证OPC社区内",
                                "currentStatus": "当前注册地址非OPC园区",
                                "gap": "缺少社区入驻身份",
                                "suggestions": ["优先申请入驻认证OPC社区", "补充入驻后收益测算"],
                                "estimatedCost": "0-3 万",
                                "estimatedTimeline": "2-6 周",
                            }
                        ],
                    },
                    "materials_required": {
                        "templates": [
                            {"id": "m1", "name": "企业注册信息", "status": "ready", "sourceOrHint": "已从素材库匹配：营业执照"},
                            {"id": "m2", "name": "OPC社区入驻证明", "status": "missing", "sourceOrHint": "需先完成社区入驻"},
                        ]
                    },
                    "source_type": "park",
                    "source_park_id": None,
                    "is_opc_policy": True,
                    "region": "苏州",
                    "status": "active",
                    "review_status": "unreviewed",
                    "original_text": "OPC 社区扶持政策原文",
                    "interpretation": "鼓励AI创业者入驻园区，享受场地与生态扶持。",
                    "publish_date": date(2024, 4, 1),
                    "effective_date": date(2024, 4, 1),
                    "expiry_date": date(2026, 12, 31),
                    "apply_start_date": date(2024, 4, 10),
                    "apply_end_date": date(2026, 12, 31),
                    "official_url": None,
                    "apply_url": None,
                },
            ],
        )


def downgrade() -> None:
    op.drop_index(op.f("ix_policies_department_category"), table_name="policies")
    op.drop_index(op.f("ix_policies_applicable_target"), table_name="policies")
    op.drop_index(op.f("ix_policies_support_domain"), table_name="policies")
    op.drop_column("policies", "department_category")
    op.drop_column("policies", "applicable_target")
    op.drop_column("policies", "support_domain")
