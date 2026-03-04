from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/")
async def get_realtime_stats() -> Dict[str, Any]:
    """
    获取平台实时汇总统计数据
    用于落地页实时数据大屏展示
    """
    # 模拟从数据库聚合查询的真实态势数据
    return {
        "status": "success",
        "data": {
            "total_policies": 10564,
            "matched_enterprises": 1342,
            "generated_materials": 45890,
            "ai_processing_time_saved_hours": 12850,
            "success_rate": "98.5%",
            "top_categories": [
                {"name": "高新认定", "value": 35},
                {"name": "专精特新", "value": 25},
                {"name": "算力补贴", "value": 20},
                {"name": "人才引进", "value": 15},
                {"name": "其他", "value": 5}
            ]
        }
    }
