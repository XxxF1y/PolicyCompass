from pydantic import BaseModel, Field


class TrendDataPoint(BaseModel):
    month: str
    subsidies: float


class DashboardOverviewResponse(BaseModel):
    displayName: str
    profileCompletion: float
    openPoliciesCount: int
    estimatedAmount: float
    amountUnit: str
    opcComputeCoupon: float
    opcModelCoupon: float
    highlyMatchedCount: int
    blockedPoliciesCount: int
    processingCount: int
    fatalBlockerCount: int
    fatalBlockerReason: str
    trendData: list[TrendDataPoint]
    total_policies: int
    matched_enterprises: int
    generated_materials: int
    success_rate: str


class DashboardTask(BaseModel):
    id: str
    category: str
    title: str
    summary: str
    status: str
    progress: int = 0
    updatedAt: str
    actionLabel: str
    actionPath: str


class GrowthNode(BaseModel):
    id: str
    label: str
    type: str
    status: str
    x: int
    y: int
    description: str | None = None
    benefit: str | None = None
    cost: str | None = None
    tags: list[str] = []
    conditions: list[str] = []


class GrowthConnection(BaseModel):
    from_node: str = Field(alias="from")
    to_node: str = Field(alias="to")

    model_config = {"populate_by_name": True}


class GrowthStage(BaseModel):
    id: str
    title: str
    period: str
    bgColor: str
    width: int


class GrowthSummary(BaseModel):
    totalEstimatedBenefit: str
    currentStage: str
    nextRecommendation: str
    nextRecommendationNodeId: str


class GrowthNavigatorResponse(BaseModel):
    stages: list[GrowthStage]
    nodes: list[GrowthNode]
    connections: list[GrowthConnection]
    summary: GrowthSummary
