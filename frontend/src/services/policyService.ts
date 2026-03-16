import { Coins, Landmark, Lightbulb, Building2 } from 'lucide-react';
import { apiClient } from './apiClient';
import type {
    PolicyDetail,
    MatchPolicy,
    ProcessStep,
    PolicySupport,
    MaterialTemplateItem,
    BlockerDetail,
} from '../types/policy';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

interface PaginatedData<T> {
    total: number;
    page: number;
    page_size: number;
    items: T[];
}

interface PolicyListItemApi {
    id: string;
    title: string;
    issuing_authority: string | null;
    level: string | null;
    policy_type: string | null;
    support_domain: string | null;
    applicable_target: string | null;
    department_category: string | null;
    source_type: string;
    status: string;
    is_opc_policy: boolean;
    is_favorited: boolean;
    region: string | null;
    support_details: Record<string, unknown> | null;
    publish_date: string | null;
    apply_end_date: string | null;
}

interface PolicyDetailApi extends PolicyListItemApi {
    policy_number: string | null;
    classification: Record<string, unknown> | null;
    application_info: Record<string, unknown> | null;
    conditions: Record<string, unknown> | null;
    prerequisites: Record<string, unknown> | null;
    materials_required: Record<string, unknown> | null;
    review_status: string;
    original_text: string | null;
    interpretation: string | null;
    effective_date: string | null;
    expiry_date: string | null;
    apply_start_date: string | null;
    official_url: string | null;
    apply_url: string | null;
    created_at: string;
    updated_at: string;
}

const pickSupportIcon = (title: string) => {
    if (title.includes('补贴') || title.includes('资金')) return Coins;
    if (title.includes('认定') || title.includes('资质')) return Landmark;
    if (title.includes('入驻') || title.includes('场地')) return Building2;
    return Lightbulb;
};

const fmtDate = (v?: string | null): string => {
    if (!v) return '-';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const mapProcess = (applicationInfo: Record<string, unknown> | null): ProcessStep[] => {
    const rows = (applicationInfo?.process as unknown[]) || [];
    return rows.map((r, idx) => {
        const item = (r || {}) as Record<string, unknown>;
        return {
            step: Number(item.step || idx + 1),
            title: String(item.title || `步骤${idx + 1}`),
            date: String(item.date || '-'),
            status: (item.status as ProcessStep['status']) || 'pending',
        };
    });
};

const mapSupports = (supportDetails: Record<string, unknown> | null): PolicySupport[] => {
    const rows = (supportDetails?.supports as unknown[]) || [];
    return rows.map((r) => {
        const item = (r || {}) as Record<string, unknown>;
        const title = String(item.title || '支持项');
        return {
            icon: pickSupportIcon(title),
            title,
            desc: String(item.desc || ''),
        };
    });
};

const mapMaterialTemplates = (materialsRequired: Record<string, unknown> | null): MaterialTemplateItem[] => {
    const rows = (materialsRequired?.templates as unknown[]) || [];
    return rows.map((r, idx) => {
        const item = (r || {}) as Record<string, unknown>;
        return {
            id: String(item.id || `m-${idx + 1}`),
            name: String(item.name || `材料${idx + 1}`),
            status: (item.status as MaterialTemplateItem['status']) || 'pending',
            sourceOrHint: String(item.sourceOrHint || ''),
        };
    });
};

const mapBlockerDetails = (prerequisites: Record<string, unknown> | null): BlockerDetail[] => {
    const rows = (prerequisites?.blocker_details as unknown[]) || [];
    return rows.map((r, idx) => {
        const item = (r || {}) as Record<string, unknown>;
        return {
            id: String(item.id || `b-${idx + 1}`),
            title: String(item.title || `卡点${idx + 1}`),
            requirement: String(item.requirement || ''),
            currentStatus: String(item.currentStatus || ''),
            gap: String(item.gap || ''),
            suggestions: Array.isArray(item.suggestions) ? item.suggestions.map(String) : [],
            estimatedCost: String(item.estimatedCost || ''),
            estimatedTimeline: String(item.estimatedTimeline || ''),
        };
    });
};

const mapPolicyList = (row: PolicyListItemApi): MatchPolicy => {
    const supportDetails = row.support_details || {};
    const blockers = ((supportDetails.blockers as unknown[]) || []) as MatchPolicy['blockers'];
    return {
        id: row.id,
        title: row.title,
        agency: row.issuing_authority || '-',
        policyLevel: (row.level as MatchPolicy['policyLevel']) || undefined,
        supportType: (row.policy_type as MatchPolicy['supportType']) || undefined,
        supportDomain: (row.support_domain as MatchPolicy['supportDomain']) || undefined,
        applicableTarget: (row.applicable_target as MatchPolicy['applicableTarget']) || undefined,
        departmentCategory: (row.department_category as MatchPolicy['departmentCategory']) || undefined,
        policyStatus: (row.status === 'active' ? '申报中' : row.status === 'expired' ? '已失效' : row.status === 'closed' ? '已截止' : '即将开始') as MatchPolicy['policyStatus'],
        policySource: (row.source_type === 'park' ? '园区发布' : '政府发布') as MatchPolicy['policySource'],
        region: (row.region as MatchPolicy['region']) || '其他',
        isOpcPolicy: row.is_opc_policy,
        isFavorited: row.is_favorited,
        tags: (((supportDetails.tags as unknown[]) || []) as string[]).length
            ? ((supportDetails.tags as unknown[]) || []).map(String)
            : [row.policy_type || '政策'],
        amount: String((supportDetails.amount as string) || '以政策原文为准'),
        matchScore: Number((supportDetails.match_score as number) || 80),
        matchText: '匹配中',
        statusColor: '#3182ce',
        matchReason: String((supportDetails.match_reason as string) || ''),
        blockers,
        isOpcExclusive: row.is_opc_policy,
    };
};

const mapPolicyDetail = (row: PolicyDetailApi): PolicyDetail => {
    const supportDetails = row.support_details || {};
    const conditions = row.conditions || {};
    const prerequisites = row.prerequisites || {};
    const materialTemplates = mapMaterialTemplates(row.materials_required || null);
    const blockerDetails = mapBlockerDetails(prerequisites);
    return {
        id: row.id,
        title: row.title,
        department: row.issuing_authority || '-',
        publishDate: fmtDate(row.publish_date),
        validUntil: fmtDate(row.expiry_date || row.apply_end_date),
        status: row.status === 'active' ? 'active' : row.status === 'expired' ? 'closed' : 'expiring',
        matchScore: Number((supportDetails.match_score as number) || 80),
        blockers: (((prerequisites.blockers as unknown[]) || []) as PolicyDetail['blockers']) || [],
        conditions: {
            required: (Array.isArray(conditions.required) ? conditions.required : []) as PolicyDetail['conditions']['required'],
            bonus: (Array.isArray(conditions.bonus) ? conditions.bonus : []) as PolicyDetail['conditions']['bonus'],
            exclusion: (Array.isArray(conditions.exclusion) ? conditions.exclusion : []) as PolicyDetail['conditions']['exclusion'],
        },
        supports: mapSupports(supportDetails),
        process: mapProcess(row.application_info || null),
        materialTemplates,
        blockerDetails,
    };
};

export const PolicyService = {
    getMatchedPolicies: async (): Promise<MatchPolicy[]> => {
        const response = await apiClient.get<ApiResponse<PaginatedData<PolicyListItemApi>>>('/api/v1/policies', {
            params: { page: 1, page_size: 100 },
        });
        return (response.data.data?.items || []).map(mapPolicyList);
    },

    getPolicyDetail: async (id: string): Promise<PolicyDetail> => {
        const response = await apiClient.get<ApiResponse<PolicyDetailApi>>(`/api/v1/policies/${id}`);
        return mapPolicyDetail(response.data.data);
    },

    toggleFavorite: async (policyId: string, isFavorited: boolean): Promise<boolean> => {
        if (isFavorited) {
            await apiClient.delete(`/api/v1/policies/${policyId}/favorite`);
            return false;
        }
        await apiClient.post(`/api/v1/policies/${policyId}/favorite`);
        return true;
    },
};
