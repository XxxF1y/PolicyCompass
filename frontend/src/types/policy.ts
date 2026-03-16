export type BlockerType = 'warning' | 'critical' | 'qualification' | 'data' | 'opc';

export interface Blocker {
    id?: number | string;
    type: BlockerType;
    text?: string;
    message?: string; // from matching page
    current?: number;
    target?: number;
    gap?: string;
    isLogicLock?: boolean;
}

export interface Condition {
    text: string;
    met?: boolean;
    passed?: boolean; // for exclusions
    gap?: string | null;
    score?: string; // for bonus
}

export interface PolicySupport {
    icon?: any; // Lucide icon reference, handle cautiously when fetching from API
    title: string;
    desc: string;
}

export interface ProcessStep {
    step: number;
    title: string;
    date: string;
    status: 'pending' | 'upcoming' | 'past';
}

export interface MaterialTemplateItem {
    id: string;
    name: string;
    status: 'ready' | 'pending' | 'missing';
    sourceOrHint: string;
}

export interface BlockerDetail {
    id: string;
    title: string;
    requirement: string;
    currentStatus: string;
    gap: string;
    suggestions: string[];
    estimatedCost: string;
    estimatedTimeline: string;
}

export interface PolicyDetail {
    id: string;
    title: string;
    department: string;
    publishDate: string;
    validUntil: string;
    status: 'active' | 'expiring' | 'closed';
    matchScore: number;
    blockers: Blocker[];
    conditions: {
        required: Condition[];
        bonus: Condition[];
        exclusion: Condition[];
    };
    supports: PolicySupport[];
    process: ProcessStep[];
    materialTemplates?: MaterialTemplateItem[];
    blockerDetails?: BlockerDetail[];
}

export interface MatchPolicy {
    id: string;
    title: string;
    agency: string;
    policyLevel?: '国家' | '省' | '市' | '区' | '园区';
    supportType?: '资金补贴' | '资质认定' | '税收优惠' | '人才补贴' | '设备补贴' | '场景开放';
    supportDomain?: '算力' | '技术' | '场景' | '人才' | '生态';
    applicableTarget?: '人才' | '科技企业' | '转型企业' | '园区' | 'OPC创业者';
    departmentCategory?: '工信部' | '网信办' | '数据局' | '人社部' | '财政部' | '发改委' | '科技部' | '市监局' | '园区/OPC社区';
    policyStatus?: '申报中' | '即将开始' | '已截止' | '已失效';
    policySource?: '政府发布' | '园区发布';
    region?: '全国' | '深圳' | '苏州' | '北京' | '上海' | '南京' | '杭州' | '其他';
    isOpcPolicy?: boolean;
    isFavorited?: boolean;
    tags: string[];
    amount: string;
    matchScore: number;
    matchText: string;
    statusColor: string;
    matchReason?: string;
    blockers?: Blocker[];
    isOpcExclusive?: boolean;
}
