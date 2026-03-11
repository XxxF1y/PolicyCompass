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
}

export interface MatchPolicy {
    id: string;
    title: string;
    agency: string;
    tags: string[];
    amount: string;
    matchScore: number;
    matchText: string;
    statusColor: string;
    matchReason?: string;
    blockers?: Blocker[];
    isOpcExclusive?: boolean;
}
