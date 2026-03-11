export type NodeType = 'milestone' | 'policy' | 'qualification';
export type NodeStatus = 'completed' | 'recommended' | 'locked' | 'future';

export interface GrowthNode {
    id: string;
    label: string;
    type: NodeType;
    status: NodeStatus;
    x: number;              // pixel position from left (用于图谱横向布局)
    y: number;              // percentage from top (用于图谱纵向泳道，如 25/50/75)
    description?: string;
    benefit?: string;       // 预估收益描述
    cost?: string;          // 预估投入描述
    tags?: string[];
    conditions?: string[];  // 申报条件 / 前置要求
}

export interface GrowthConnection {
    from: string;           // 起始 node id
    to: string;             // 目标 node id
}

export interface GrowthStage {
    id: string;
    title: string;
    period: string;         // 如 "2026年 (当前)"
    bgColor: string;        // Tailwind class
    width: number;          // 像素宽度
}

export interface GrowthSummary {
    totalEstimatedBenefit: string;   // 如 "400-600万"
    currentStage: string;            // 如 "阶段三：资质积累期"
    nextRecommendation: string;      // 如 "立即申报：科技型中小企业评价"
    nextRecommendationNodeId: string;// 关联的推荐节点ID
}

export interface GrowthNavigatorData {
    stages: GrowthStage[];
    nodes: GrowthNode[];
    connections: GrowthConnection[];
    summary: GrowthSummary;
}
