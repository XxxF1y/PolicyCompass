export type CollaborationTab = 'opportunities' | 'needs' | 'records';
export type MatchLevel = 'strong' | 'normal';
export type CollabStatus = 'pending_response' | 'needs_info' | 'connected';

export interface CollabOpportunity {
    id: string;
    level: MatchLevel;
    type: string; // e.g., '上下游联合申报', '企业+人才协同'
    policyTitle: string;
    partnerName: string;
    partnerInfo: string;
    description: string;
    matchReason?: string;
    blocker?: string;
    expectedReturn: string;
    status: CollabStatus;
    statusLabel: string;
}
