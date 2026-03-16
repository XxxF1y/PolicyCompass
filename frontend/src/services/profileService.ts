import { apiClient } from './apiClient';
import type { ProfileData, ProfileTip, RadarDataPoint } from '../types/profile';

type ProfileRole = 'talent' | 'enterprise' | 'park';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

interface EnterpriseApi {
    id: string;
    name: string;
    credit_code: string | null;
    basic_info: Record<string, unknown> | null;
    operation_data: Record<string, unknown> | null;
    certifications: Record<string, unknown> | null;
    intellectual_property: Record<string, unknown> | null;
    ai_compliance: Record<string, unknown> | null;
    general_compliance: Record<string, unknown> | null;
    opc_info: Record<string, unknown> | null;
    completeness_score: number;
}

interface TalentApi {
    id: string;
    name: string;
    basic_info: Record<string, unknown> | null;
    education: Record<string, unknown> | null;
    work_experience: Record<string, unknown> | null;
    professional_skills: Record<string, unknown> | null;
    achievements: Record<string, unknown> | null;
    talent_titles: Record<string, unknown> | null;
    social_insurance: Record<string, unknown> | null;
    opc_info: Record<string, unknown> | null;
    completeness_score: number;
}

interface ParkApi {
    id: string;
    name: string;
    address: string | null;
    basic_info: Record<string, unknown> | null;
    industry_focus: Record<string, unknown> | null;
    tenant_info: Record<string, unknown> | null;
    investment_needs: Record<string, unknown> | null;
    opc_community_info: Record<string, unknown> | null;
    completeness_score: number;
}

export interface ProfileEditorData {
    id: string;
    role: ProfileRole;
    name: string;
    secondaryLabel: string;
    secondaryValue: string;
    sections: Array<{ key: string; label: string; value: string }>;
}

const toJsonText = (value: Record<string, unknown> | null | undefined): string => {
    if (!value) return '{}';
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return '{}';
    }
};

const parseJsonText = (raw: string, label: string): Record<string, unknown> => {
    const text = raw.trim();
    if (!text) return {};
    try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>;
        }
        throw new Error(`${label} 必须是 JSON 对象`);
    } catch {
        throw new Error(`${label} 不是合法 JSON`);
    }
};

const scoreBuckets = (completion: number): RadarDataPoint[] => [
    { subject: '基础信息', A: Math.min(100, Math.max(20, completion + 8)), fullMark: 100 },
    { subject: '经营能力', A: Math.min(100, Math.max(15, completion - 5)), fullMark: 100 },
    { subject: '资质体系', A: Math.min(100, Math.max(10, completion - 12)), fullMark: 100 },
    { subject: '创新能力', A: Math.min(100, Math.max(15, completion + 2)), fullMark: 100 },
    { subject: '合规状态', A: Math.min(100, Math.max(20, completion - 8)), fullMark: 100 },
    { subject: '生态协同', A: Math.min(100, Math.max(10, completion - 4)), fullMark: 100 },
];

const buildTips = (missingCount: number): ProfileTip[] => {
    if (missingCount <= 0) {
        return [{ id: 'ok-1', content: '画像信息较完整，可继续提升加分项。', actionLabel: '继续优化', type: 'success' }];
    }
    return [
        { id: 'miss-1', content: '补齐关键字段后可提升政策匹配准确度。', actionLabel: '待完善', type: 'warning' },
        { id: 'miss-2', content: '建议先完善基础信息与经营数据。', actionLabel: '优先项', type: 'bonus' },
    ];
};

const roleSubject = (role: ProfileRole) => {
    if (role === 'talent') return '人才';
    if (role === 'park') return '园区';
    return '企业';
};

const countFilled = (obj: unknown): number => {
    if (!obj || typeof obj !== 'object') return 0;
    return Object.values(obj as Record<string, unknown>).filter((v) => {
        if (v === null || v === undefined) return false;
        if (typeof v === 'string') return v.trim().length > 0;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'object') return Object.keys(v as Record<string, unknown>).length > 0;
        return true;
    }).length;
};

const mapToProfileData = (
    role: ProfileRole,
    completionScore: number,
    buckets: Array<Record<string, unknown> | null | undefined>,
): ProfileData => {
    const completionRate = Math.round(completionScore);
    const missingCount = Math.max(0, buckets.length * 3 - buckets.reduce((acc, b) => acc + countFilled(b), 0));
    return {
        role,
        completionRate,
        radarData: scoreBuckets(completionRate),
        alert: {
            title: `${roleSubject(role)}画像${missingCount > 0 ? '待补全提示' : '健康度良好'}`,
            description:
                missingCount > 0
                    ? `当前仍有 ${missingCount} 项关键信息建议补充，完善后可提升匹配与推荐质量。`
                    : '画像关键字段已较完整，可继续迭代高价值标签。',
            missingCount,
            tips: buildTips(missingCount),
        },
    };
};

const fetchEnterprise = async (): Promise<EnterpriseApi> => {
    const response = await apiClient.get<ApiResponse<EnterpriseApi>>('/api/v1/enterprises/mine');
    return response.data.data;
};

const fetchTalent = async (): Promise<TalentApi> => {
    const response = await apiClient.get<ApiResponse<TalentApi>>('/api/v1/talents/mine');
    return response.data.data;
};

const fetchPark = async (): Promise<ParkApi> => {
    const response = await apiClient.get<ApiResponse<ParkApi>>('/api/v1/parks/mine');
    return response.data.data;
};

export const ProfileService = {
    getProfile: async (role: ProfileRole): Promise<ProfileData> => {
        if (role === 'enterprise') {
            const e = await fetchEnterprise();
            return mapToProfileData(role, e.completeness_score, [
                e.basic_info,
                e.operation_data,
                e.certifications,
                e.intellectual_property,
                e.ai_compliance,
                e.general_compliance,
                e.opc_info,
            ]);
        }
        if (role === 'talent') {
            const t = await fetchTalent();
            return mapToProfileData(role, t.completeness_score, [
                t.basic_info,
                t.education,
                t.work_experience,
                t.professional_skills,
                t.achievements,
                t.talent_titles,
                t.social_insurance,
                t.opc_info,
            ]);
        }
        const p = await fetchPark();
        return mapToProfileData(role, p.completeness_score, [
            p.basic_info,
            p.industry_focus,
            p.tenant_info,
            p.investment_needs,
            p.opc_community_info,
        ]);
    },

    getProfileEditor: async (role: ProfileRole): Promise<ProfileEditorData> => {
        if (role === 'enterprise') {
            const e = await fetchEnterprise();
            return {
                id: e.id,
                role,
                name: e.name,
                secondaryLabel: '统一社会信用代码',
                secondaryValue: e.credit_code || '',
                sections: [
                    { key: 'basic_info', label: '基础信息 JSON', value: toJsonText(e.basic_info) },
                    { key: 'operation_data', label: '经营数据 JSON', value: toJsonText(e.operation_data) },
                    { key: 'certifications', label: '资质信息 JSON', value: toJsonText(e.certifications) },
                    { key: 'intellectual_property', label: '知识产权 JSON', value: toJsonText(e.intellectual_property) },
                    { key: 'ai_compliance', label: 'AI合规 JSON', value: toJsonText(e.ai_compliance) },
                    { key: 'general_compliance', label: '通用合规 JSON', value: toJsonText(e.general_compliance) },
                    { key: 'opc_info', label: 'OPC信息 JSON', value: toJsonText(e.opc_info) },
                ],
            };
        }
        if (role === 'talent') {
            const t = await fetchTalent();
            return {
                id: t.id,
                role,
                name: t.name,
                secondaryLabel: '人才档案标识',
                secondaryValue: t.id,
                sections: [
                    { key: 'basic_info', label: '基础信息 JSON', value: toJsonText(t.basic_info) },
                    { key: 'education', label: '教育信息 JSON', value: toJsonText(t.education) },
                    { key: 'work_experience', label: '工作经历 JSON', value: toJsonText(t.work_experience) },
                    { key: 'professional_skills', label: '专业技能 JSON', value: toJsonText(t.professional_skills) },
                    { key: 'achievements', label: '成果信息 JSON', value: toJsonText(t.achievements) },
                    { key: 'talent_titles', label: '人才头衔 JSON', value: toJsonText(t.talent_titles) },
                    { key: 'social_insurance', label: '社保信息 JSON', value: toJsonText(t.social_insurance) },
                    { key: 'opc_info', label: 'OPC信息 JSON', value: toJsonText(t.opc_info) },
                ],
            };
        }
        const p = await fetchPark();
        return {
            id: p.id,
            role,
            name: p.name,
            secondaryLabel: '园区地址',
            secondaryValue: p.address || '',
            sections: [
                { key: 'basic_info', label: '基础信息 JSON', value: toJsonText(p.basic_info) },
                { key: 'industry_focus', label: '产业聚焦 JSON', value: toJsonText(p.industry_focus) },
                { key: 'tenant_info', label: '租户信息 JSON', value: toJsonText(p.tenant_info) },
                { key: 'investment_needs', label: '招商需求 JSON', value: toJsonText(p.investment_needs) },
                { key: 'opc_community_info', label: 'OPC社区 JSON', value: toJsonText(p.opc_community_info) },
            ],
        };
    },

    saveProfileEditor: async (draft: ProfileEditorData): Promise<void> => {
        const sectionMap = Object.fromEntries(
            draft.sections.map((s) => [s.key, parseJsonText(s.value, s.label)]),
        );

        if (draft.role === 'enterprise') {
            await apiClient.put(`/api/v1/enterprises/${draft.id}`, {
                name: draft.name,
                credit_code: draft.secondaryValue || null,
                ...sectionMap,
            });
            return;
        }
        if (draft.role === 'talent') {
            await apiClient.put(`/api/v1/talents/${draft.id}`, {
                name: draft.name,
                ...sectionMap,
            });
            return;
        }
        await apiClient.put(`/api/v1/parks/${draft.id}`, {
            name: draft.name,
            address: draft.secondaryValue || null,
            ...sectionMap,
        });
    },
};

