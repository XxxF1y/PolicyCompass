import type { ProfileData } from '../types/profile';

const mockEnterpriseProfile: ProfileData = {
    role: 'enterprise',
    completionRate: 75,
    radarData: [
        { subject: '企业规模', A: 85, fullMark: 100 },
        { subject: '创新能力', A: 90, fullMark: 100 },
        { subject: '知识产权', A: 65, fullMark: 100 },
        { subject: '合规程度', A: 95, fullMark: 100 },
        { subject: '人才结构', A: 70, fullMark: 100 },
        { subject: '财务健康', A: 80, fullMark: 100 },
    ],
    alert: {
        title: '画像待补全提示',
        description: '系统检测到您当前有关键财务指标尚未填写，这直接导致【省专精特新】等 4 项政策的智能匹配精准度下降。',
        missingCount: 2,
        tips: [
            { id: 't1', content: '更新 2025 年度累计营收预估', actionLabel: '缺失关键指标', type: 'warning' },
            { id: 't2', content: '补充近期新增的大模型备案号', actionLabel: '加分项', type: 'bonus' }
        ]
    }
};

const mockTalentProfile: ProfileData = {
    role: 'talent',
    completionRate: 65,
    radarData: [
        { subject: '学历背景', A: 95, fullMark: 100 },
        { subject: '项目经验', A: 85, fullMark: 100 },
        { subject: '科研产出', A: 90, fullMark: 100 },
        { subject: '资质荣誉', A: 75, fullMark: 100 },
        { subject: 'OPC潜力', A: 88, fullMark: 100 },
        { subject: '技术稀缺度', A: 80, fullMark: 100 },
    ],
    alert: {
        title: 'OPC 创业者专属推荐',
        description: '您已标记为 OPC 超级个体。请补充算力需求，系统将为您精准匹配【算力券补贴】及【免租工位】。',
        tips: [
            { id: 't3', content: '完善所需模型参数及算力级别', actionLabel: '解锁算力补贴', type: 'bonus' }
        ]
    }
};

const mockParkProfile: ProfileData = {
    role: 'park',
    completionRate: 90,
    radarData: [
        { subject: '园区规模', A: 90, fullMark: 100 },
        { subject: '入驻密度', A: 85, fullMark: 100 },
        { subject: 'OPC服务', A: 65, fullMark: 100 },
        { subject: '政策优势', A: 95, fullMark: 100 },
        { subject: '产业聚集', A: 80, fullMark: 100 },
        { subject: '算力基建', A: 75, fullMark: 100 },
    ],
    alert: {
        title: '园区画像健康度良好',
        description: '当前园区信息已基本完善。建议进一步细化补链/强链需求，以提升智能招商推荐的转化率。',
        tips: [
            { id: 't4', content: '明确目标招商企业的年营收集群', actionLabel: '提升招商精度', type: 'success' }
        ]
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProfileService = {
    getProfile: async (role: 'talent' | 'enterprise' | 'park'): Promise<ProfileData> => {
        await delay(600);
        switch (role) {
            case 'talent': return mockTalentProfile;
            case 'park': return mockParkProfile;
            case 'enterprise':
            default: return mockEnterpriseProfile;
        }
    }
};
