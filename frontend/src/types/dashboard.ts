// Dashboard Data Types for both Enterprise and Park views

export interface TrendDataPoint {
    month: string;
    subsidies: number;
}

export interface ParkTrendDataPoint {
    name: string;
    aiCount: number;
    value: number; // Valuation in millions or billions
}

export interface InvestmentTarget {
    id: number;
    name: string;
    // Basic Attributes
    matchScore: string;
    industry: string;
    size: string;
    location: string;

    // Value & Strategy
    valuePoints: { text: string; type?: 'high' | 'normal' }[];
    strategy: string[];

    // Legacy fields (kept for backward compatibility during transition)
    direction?: string;
    value?: string;
    stage?: string;
    probability?: string;
    reason?: string;
}

export interface PolicyMatch {
    name: string;
    matchScore: number;
    benefit: string;
}

export interface TargetDetail extends InvestmentTarget {
    foundedDate?: string;
    legalPerson?: string;
    registeredCapital?: string;
    policyMatches?: PolicyMatch[];
}

export interface DashboardStats {
    profileCompletion: number;
    openPoliciesCount: number;
    estimatedAmount: number;
    amountUnit: string;
    opcComputeCoupon: number;
    opcModelCoupon: number;
    highlyMatchedCount: number;
    blockedPoliciesCount: number;
    processingCount: number;
    fatalBlockerCount: number;
    fatalBlockerReason: string;
    trendData: TrendDataPoint[];
    total_policies: number;
    matched_enterprises: number;
    generated_materials: number;
    success_rate: string;
}

export interface ParkStats {
    newLeads: number;
    leadsGrowth: number; // percentage e.g. 15
    opcPoolCount: number;
    convertedCount: number;
    convertedGrowth: number;
    investmentTargets: InvestmentTarget[];
    trendData: ParkTrendDataPoint[];
}
