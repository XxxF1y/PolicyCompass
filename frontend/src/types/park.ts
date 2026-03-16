export interface IndustryHeatmapItem {
    industry: string;
    count: number;
    heat: number;
}

export interface GeoDistributionItem {
    city: string;
    count: number;
    kind: 'registered' | 'office' | string;
}

export interface IndustryChainNode {
    id: string;
    name: string;
    category: string;
    size: number;
}

export interface IndustryChainLink {
    source: string;
    target: string;
    relation: string;
    weight: number;
}

export interface TrendIndustryPoint {
    industry: string;
    count: number;
}

export interface TimeTrendItem {
    month: string;
    total: number;
    series: TrendIndustryPoint[];
}

export interface ParkInsightsOverview {
    total_enterprises: number;
    in_park_enterprises: number;
    outside_enterprises: number;
    industry_types: number;
}

export interface ParkInsightsData {
    park_name: string;
    overview: ParkInsightsOverview;
    industry_heatmap: IndustryHeatmapItem[];
    geo_distribution: GeoDistributionItem[];
    industry_chain: {
        nodes: IndustryChainNode[];
        links: IndustryChainLink[];
    };
    time_trends: TimeTrendItem[];
}

export interface ParkInvestmentTarget {
    id: string;
    name: string;
    in_park: boolean;
    matchScore: string;
    industry: string;
    size: string;
    location: string;
    opcStage: string;
    aiDirection: string;
    productType: string;
    valuePoints: { text: string; type?: 'high' | 'normal' }[];
    strategy: string[];
}

export interface ParkInvestmentResponse {
    park_name: string;
    summary: {
        total: number;
        recommended: number;
        out_of_park: number;
    };
    recommended: ParkInvestmentTarget[];
    items: ParkInvestmentTarget[];
}

export interface ParkPolicyPushItem {
    id: string;
    park_id: string;
    policy_title: string;
    policy_level?: string | null;
    issuing_department?: string | null;
    publish_date?: string | null;
    deadline?: string | null;
    applicable_targets?: string[] | null;
    regions?: string[] | null;
    channels?: string[] | null;
    target_tags?: string[] | null;
    keywords?: string[] | null;
    push_scope?: string | null;
    status: string;
    reach_count: number;
    open_count: number;
    click_count: number;
    intent_count: number;
    conversion_rate: number;
    last_pushed_at?: string | null;
    created_at: string;
    updated_at: string;
}
