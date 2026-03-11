import type { GrowthNavigatorData } from '../types/growth';

const mockGrowthData: GrowthNavigatorData = {
    stages: [
        { id: 's1', title: '阶段一：OPC起步期', period: '2024年', bgColor: 'bg-emerald-50/60', width: 300 },
        { id: 's2', title: '阶段二：企业化转型', period: '2025年', bgColor: 'bg-blue-50/60', width: 380 },
        { id: 's3', title: '阶段三：资质积累期', period: '2026年 (当前)', bgColor: 'bg-blue-50/60', width: 380 },
        { id: 's4', title: '阶段四：成长加速期', period: '2027年', bgColor: 'bg-slate-100/60', width: 320 },
        { id: 's5', title: '阶段五：规模化发展', period: '2028年+', bgColor: 'bg-slate-50', width: 300 },
    ],
    nodes: [
        // Stage 1
        {
            id: '1', label: '算法备案', type: 'qualification', status: 'completed', x: 80, y: 25,
            benefit: '合规经营基础', description: '互联网信息服务算法备案'
        },
        {
            id: '2', label: 'OPC社区入驻', type: 'policy', status: 'completed', x: 150, y: 50,
            benefit: '场地补贴+启动金', description: '针对OPC认证会员的专项扶持'
        },
        {
            id: '3', label: '算力补贴', type: 'policy', status: 'completed', x: 220, y: 75,
            benefit: '最高50万算力资源', tags: ['已兑付'], description: '降低AI模型训练成本'
        },
        // Stage 2
        {
            id: '4', label: '注册有限责任公司', type: 'milestone', status: 'completed', x: 400, y: 50,
            benefit: '解锁企业法人资格', description: '个体工商户转企，建立现代企业制度', tags: ['关键里程碑']
        },
        {
            id: '5', label: '科技型中小企业入库', type: 'qualification', status: 'recommended', x: 580, y: 50,
            benefit: '研发加计扣除/节税8万', cost: '几乎为零', tags: ['2026复评'],
            description: '企业开展科技创新活动的重要身份标识，是后续申报各类专项资金的"门票"。2026年申报通道已开启。',
            conditions: ['在中国境内注册的居民企业', '职工总数不超过500人', '年销售收入不超过2亿元', '资产总额不超过2亿元', '未发生重大安全/质量事故']
        },
        // Stage 3
        {
            id: '6', label: 'AI创新发展专项资金', type: 'policy', status: 'locked', x: 760, y: 25,
            benefit: '最高100万', description: '苏州市级产业专项扶持', conditions: ['需先完成2026科小入库']
        },
        {
            id: '7', label: '高新技术企业认定', type: 'qualification', status: 'locked', x: 860, y: 50,
            benefit: '奖励30-50万+15%税惠', cost: '审计费约3万', description: '国家级资质，企业核心硬科技实力的证明',
            conditions: ['成立满3年 (2026.03满足)', '拥有核心知识产权', '研发费用占比达标']
        },
        {
            id: '8', label: '江苏省双创人才', type: 'policy', status: 'locked', x: 960, y: 75,
            benefit: '最高100万资助', description: '省级高层次人才引进计划', conditions: ['依托企业载体申报', '团队人数3人以上']
        },
        // Stage 4
        {
            id: '9', label: '省专精特新中小企业', type: 'qualification', status: 'locked', x: 1140, y: 50,
            benefit: '奖励30-50万+融资便利', description: '省级"排头兵"企业认证', conditions: ['需先获得高企认定']
        },
        {
            id: '10', label: '智能制造示范工厂', type: 'policy', status: 'locked', x: 1260, y: 25,
            benefit: '项目资金支持', tags: ['协同申报机会'], description: '联合申报项目'
        },
        // Stage 5
        {
            id: '11', label: '国家级"小巨人"', type: 'qualification', status: 'future', x: 1530, y: 50,
            benefit: '国家级荣誉+专项资金', description: '专精特新领域的最高荣誉', conditions: ['需先获得省级专精特新']
        },
    ],
    connections: [
        { from: '2', to: '4' },
        { from: '4', to: '5' },
        { from: '5', to: '6' },
        { from: '5', to: '7' },
        { from: '4', to: '8' },
        { from: '7', to: '9' },
        { from: '9', to: '11' },
        { from: '1', to: '4' },
        { from: '3', to: '5' },
    ],
    summary: {
        totalEstimatedBenefit: '400-600万',
        currentStage: '阶段三：资质积累期',
        nextRecommendation: '立即申报：科技型中小企业评价',
        nextRecommendationNodeId: '5',
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const GrowthService = {
    getGrowthNavigatorData: async (): Promise<GrowthNavigatorData> => {
        await delay(600);
        return mockGrowthData;
    }
};
