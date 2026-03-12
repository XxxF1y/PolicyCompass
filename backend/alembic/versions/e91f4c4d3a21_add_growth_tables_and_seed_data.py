"""add growth tables and seed data

Revision ID: e91f4c4d3a21
Revises: 46bed4c8812d
Create Date: 2026-03-12 17:20:00.000000

"""

from typing import Sequence, Union
import json

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e91f4c4d3a21"
down_revision: Union[str, None] = "46bed4c8812d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "growth_stages",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("title", sa.String(length=100), nullable=False),
        sa.Column("period", sa.String(length=40), nullable=False),
        sa.Column("bg_color", sa.String(length=40), nullable=False),
        sa.Column("width", sa.Integer(), nullable=False),
        sa.Column("order_no", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_growth_stages_code"), "growth_stages", ["code"], unique=True)
    op.create_index(op.f("ix_growth_stages_order_no"), "growth_stages", ["order_no"], unique=False)

    op.create_table(
        "growth_nodes",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("code", sa.String(length=20), nullable=False),
        sa.Column("stage_id", sa.String(length=32), nullable=True),
        sa.Column("label", sa.String(length=100), nullable=False),
        sa.Column("node_type", sa.String(length=30), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("x", sa.Integer(), nullable=False),
        sa.Column("y", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("benefit", sa.String(length=200), nullable=True),
        sa.Column("cost", sa.String(length=200), nullable=True),
        sa.Column("tags_json", sa.Text(), nullable=True),
        sa.Column("conditions_json", sa.Text(), nullable=True),
        sa.Column("order_no", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["stage_id"], ["growth_stages.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_growth_nodes_code"), "growth_nodes", ["code"], unique=True)
    op.create_index(op.f("ix_growth_nodes_stage_id"), "growth_nodes", ["stage_id"], unique=False)

    op.create_table(
        "growth_connections",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("from_node_id", sa.String(length=32), nullable=False),
        sa.Column("to_node_id", sa.String(length=32), nullable=False),
        sa.Column("order_no", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["from_node_id"], ["growth_nodes.id"]),
        sa.ForeignKeyConstraint(["to_node_id"], ["growth_nodes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_growth_connections_from_node_id"), "growth_connections", ["from_node_id"], unique=False)
    op.create_index(op.f("ix_growth_connections_to_node_id"), "growth_connections", ["to_node_id"], unique=False)

    op.create_table(
        "growth_summaries",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("scenario", sa.String(length=30), nullable=False),
        sa.Column("total_estimated_benefit", sa.String(length=50), nullable=False),
        sa.Column("current_stage", sa.String(length=100), nullable=False),
        sa.Column("next_recommendation", sa.String(length=200), nullable=False),
        sa.Column("next_recommendation_node_id", sa.String(length=32), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["next_recommendation_node_id"], ["growth_nodes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_growth_summaries_next_recommendation_node_id"), "growth_summaries", ["next_recommendation_node_id"], unique=False)
    op.create_index(op.f("ix_growth_summaries_scenario"), "growth_summaries", ["scenario"], unique=True)

    stage_table = sa.table(
        "growth_stages",
        sa.column("id", sa.String(32)),
        sa.column("code", sa.String(20)),
        sa.column("title", sa.String(100)),
        sa.column("period", sa.String(40)),
        sa.column("bg_color", sa.String(40)),
        sa.column("width", sa.Integer()),
        sa.column("order_no", sa.Integer()),
    )
    stage_rows = [
        {"id": "gstg000000000000000000000000001", "code": "s1", "title": "阶段一：OPC起步期", "period": "2024年", "bg_color": "bg-emerald-50/60", "width": 300, "order_no": 1},
        {"id": "gstg000000000000000000000000002", "code": "s2", "title": "阶段二：企业化转型", "period": "2025年", "bg_color": "bg-blue-50/60", "width": 380, "order_no": 2},
        {"id": "gstg000000000000000000000000003", "code": "s3", "title": "阶段三：资质积累期", "period": "2026年 (当前)", "bg_color": "bg-blue-50/60", "width": 380, "order_no": 3},
        {"id": "gstg000000000000000000000000004", "code": "s4", "title": "阶段四：成长加速期", "period": "2027年", "bg_color": "bg-slate-100/60", "width": 320, "order_no": 4},
        {"id": "gstg000000000000000000000000005", "code": "s5", "title": "阶段五：规模化发展", "period": "2028年+", "bg_color": "bg-slate-50", "width": 300, "order_no": 5},
    ]
    op.bulk_insert(stage_table, stage_rows)

    node_table = sa.table(
        "growth_nodes",
        sa.column("id", sa.String(32)),
        sa.column("code", sa.String(20)),
        sa.column("stage_id", sa.String(32)),
        sa.column("label", sa.String(100)),
        sa.column("node_type", sa.String(30)),
        sa.column("status", sa.String(20)),
        sa.column("x", sa.Integer()),
        sa.column("y", sa.Integer()),
        sa.column("description", sa.Text()),
        sa.column("benefit", sa.String(200)),
        sa.column("cost", sa.String(200)),
        sa.column("tags_json", sa.Text()),
        sa.column("conditions_json", sa.Text()),
        sa.column("order_no", sa.Integer()),
    )
    node_rows = [
        {"id": "gnd0000000000000000000000000001", "code": "1", "stage_id": "gstg000000000000000000000000001", "label": "算法备案", "node_type": "qualification", "status": "completed", "x": 80, "y": 25, "description": "互联网信息服务算法备案", "benefit": "合规经营基础", "cost": None, "tags_json": None, "conditions_json": None, "order_no": 1},
        {"id": "gnd0000000000000000000000000002", "code": "2", "stage_id": "gstg000000000000000000000000001", "label": "OPC社区入驻", "node_type": "policy", "status": "completed", "x": 150, "y": 50, "description": "针对OPC认证会员的专项扶持", "benefit": "场地补贴+启动金", "cost": None, "tags_json": None, "conditions_json": None, "order_no": 2},
        {"id": "gnd0000000000000000000000000003", "code": "3", "stage_id": "gstg000000000000000000000000001", "label": "算力补贴", "node_type": "policy", "status": "completed", "x": 220, "y": 75, "description": "降低AI模型训练成本", "benefit": "最高50万算力资源", "cost": None, "tags_json": json.dumps(["已兑付"], ensure_ascii=False), "conditions_json": None, "order_no": 3},
        {"id": "gnd0000000000000000000000000004", "code": "4", "stage_id": "gstg000000000000000000000000002", "label": "注册有限责任公司", "node_type": "milestone", "status": "completed", "x": 400, "y": 50, "description": "个体工商户转企，建立现代企业制度", "benefit": "解锁企业法人资格", "cost": None, "tags_json": json.dumps(["关键里程碑"], ensure_ascii=False), "conditions_json": None, "order_no": 4},
        {"id": "gnd0000000000000000000000000005", "code": "5", "stage_id": "gstg000000000000000000000000003", "label": "科技型中小企业入库", "node_type": "qualification", "status": "recommended", "x": 580, "y": 50, "description": "企业开展科技创新活动的重要身份标识，是后续申报各类专项资金的门票。", "benefit": "研发加计扣除/节税8万", "cost": "几乎为零", "tags_json": json.dumps(["2026复评"], ensure_ascii=False), "conditions_json": json.dumps(["在中国境内注册的居民企业", "职工总数不超过500人", "年销售收入不超过2亿元", "资产总额不超过2亿元"], ensure_ascii=False), "order_no": 5},
        {"id": "gnd0000000000000000000000000006", "code": "6", "stage_id": "gstg000000000000000000000000003", "label": "AI创新发展专项资金", "node_type": "policy", "status": "locked", "x": 760, "y": 25, "description": "苏州市级产业专项扶持", "benefit": "最高100万", "cost": None, "tags_json": None, "conditions_json": json.dumps(["需先完成2026科小入库"], ensure_ascii=False), "order_no": 6},
        {"id": "gnd0000000000000000000000000007", "code": "7", "stage_id": "gstg000000000000000000000000003", "label": "高新技术企业认定", "node_type": "qualification", "status": "locked", "x": 860, "y": 50, "description": "国家级资质，企业核心硬科技实力的证明", "benefit": "奖励30-50万+15%税惠", "cost": "审计费约3万", "tags_json": None, "conditions_json": json.dumps(["成立满3年", "拥有核心知识产权", "研发费用占比达标"], ensure_ascii=False), "order_no": 7},
        {"id": "gnd0000000000000000000000000008", "code": "8", "stage_id": "gstg000000000000000000000000003", "label": "江苏省双创人才", "node_type": "policy", "status": "locked", "x": 960, "y": 75, "description": "省级高层次人才引进计划", "benefit": "最高100万资助", "cost": None, "tags_json": None, "conditions_json": json.dumps(["依托企业载体申报", "团队人数3人以上"], ensure_ascii=False), "order_no": 8},
        {"id": "gnd0000000000000000000000000009", "code": "9", "stage_id": "gstg000000000000000000000000004", "label": "省专精特新中小企业", "node_type": "qualification", "status": "locked", "x": 1140, "y": 50, "description": "省级排头兵企业认证", "benefit": "奖励30-50万+融资便利", "cost": None, "tags_json": None, "conditions_json": json.dumps(["需先获得高企认定"], ensure_ascii=False), "order_no": 9},
        {"id": "gnd0000000000000000000000000010", "code": "10", "stage_id": "gstg000000000000000000000000004", "label": "智能制造示范工厂", "node_type": "policy", "status": "locked", "x": 1260, "y": 25, "description": "联合申报项目", "benefit": "项目资金支持", "cost": None, "tags_json": json.dumps(["协同申报机会"], ensure_ascii=False), "conditions_json": None, "order_no": 10},
        {"id": "gnd0000000000000000000000000011", "code": "11", "stage_id": "gstg000000000000000000000000005", "label": "国家级小巨人", "node_type": "qualification", "status": "future", "x": 1530, "y": 50, "description": "专精特新领域的最高荣誉", "benefit": "国家级荣誉+专项资金", "cost": None, "tags_json": None, "conditions_json": json.dumps(["需先获得省级专精特新"], ensure_ascii=False), "order_no": 11},
    ]
    op.bulk_insert(node_table, node_rows)

    connection_table = sa.table(
        "growth_connections",
        sa.column("id", sa.String(32)),
        sa.column("from_node_id", sa.String(32)),
        sa.column("to_node_id", sa.String(32)),
        sa.column("order_no", sa.Integer()),
    )
    connection_rows = [
        {"id": "gcn0000000000000000000000000001", "from_node_id": "gnd0000000000000000000000000002", "to_node_id": "gnd0000000000000000000000000004", "order_no": 1},
        {"id": "gcn0000000000000000000000000002", "from_node_id": "gnd0000000000000000000000000004", "to_node_id": "gnd0000000000000000000000000005", "order_no": 2},
        {"id": "gcn0000000000000000000000000003", "from_node_id": "gnd0000000000000000000000000005", "to_node_id": "gnd0000000000000000000000000006", "order_no": 3},
        {"id": "gcn0000000000000000000000000004", "from_node_id": "gnd0000000000000000000000000005", "to_node_id": "gnd0000000000000000000000000007", "order_no": 4},
        {"id": "gcn0000000000000000000000000005", "from_node_id": "gnd0000000000000000000000000004", "to_node_id": "gnd0000000000000000000000000008", "order_no": 5},
        {"id": "gcn0000000000000000000000000006", "from_node_id": "gnd0000000000000000000000000007", "to_node_id": "gnd0000000000000000000000000009", "order_no": 6},
        {"id": "gcn0000000000000000000000000007", "from_node_id": "gnd0000000000000000000000000009", "to_node_id": "gnd0000000000000000000000000011", "order_no": 7},
        {"id": "gcn0000000000000000000000000008", "from_node_id": "gnd0000000000000000000000000001", "to_node_id": "gnd0000000000000000000000000004", "order_no": 8},
        {"id": "gcn0000000000000000000000000009", "from_node_id": "gnd0000000000000000000000000003", "to_node_id": "gnd0000000000000000000000000005", "order_no": 9},
    ]
    op.bulk_insert(connection_table, connection_rows)

    summary_table = sa.table(
        "growth_summaries",
        sa.column("id", sa.String(32)),
        sa.column("scenario", sa.String(30)),
        sa.column("total_estimated_benefit", sa.String(50)),
        sa.column("current_stage", sa.String(100)),
        sa.column("next_recommendation", sa.String(200)),
        sa.column("next_recommendation_node_id", sa.String(32)),
    )
    op.bulk_insert(
        summary_table,
        [
            {
                "id": "gsm0000000000000000000000000001",
                "scenario": "enterprise_default",
                "total_estimated_benefit": "400-600万",
                "current_stage": "阶段三：资质积累期",
                "next_recommendation": "立即申报：科技型中小企业评价",
                "next_recommendation_node_id": "gnd0000000000000000000000000005",
            }
        ],
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_growth_summaries_scenario"), table_name="growth_summaries")
    op.drop_index(op.f("ix_growth_summaries_next_recommendation_node_id"), table_name="growth_summaries")
    op.drop_table("growth_summaries")

    op.drop_index(op.f("ix_growth_connections_to_node_id"), table_name="growth_connections")
    op.drop_index(op.f("ix_growth_connections_from_node_id"), table_name="growth_connections")
    op.drop_table("growth_connections")

    op.drop_index(op.f("ix_growth_nodes_stage_id"), table_name="growth_nodes")
    op.drop_index(op.f("ix_growth_nodes_code"), table_name="growth_nodes")
    op.drop_table("growth_nodes")

    op.drop_index(op.f("ix_growth_stages_order_no"), table_name="growth_stages")
    op.drop_index(op.f("ix_growth_stages_code"), table_name="growth_stages")
    op.drop_table("growth_stages")
