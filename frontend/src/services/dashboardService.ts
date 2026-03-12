import type { DashboardStats, DashboardTask, ParkStats } from '../types/dashboard';
import { apiClient } from './apiClient';

const mockEnterpriseDashboard: DashboardStats = {
    displayName: '超级个体测试账户',
    profileCompletion: 30,
    openPoliciesCount: 3,
    estimatedAmount: 15.5,
    amountUnit: '万元',
    opcComputeCoupon: 5,
    opcModelCoupon: 2,
    highlyMatchedCount: 8,
    blockedPoliciesCount: 4,
    processingCount: 2,
    fatalBlockerCount: 1,
    fatalBlockerReason: '需完成《算法备案》前置解锁',
    total_policies: 12450,
    matched_enterprises: 834,
    generated_materials: 2156,
    success_rate: '94.5%',
    trendData: [
        { month: '1月', subsidies: 0 },
        { month: '2月', subsidies: 12 },
        { month: '3月', subsidies: 45 },
        { month: '4月', subsidies: 30 },
        { month: '5月', subsidies: 80 },
        { month: '6月', subsidies: 120 }
    ]
};

const mockDashboardTasks: DashboardTask[] = [
    {
        id: 'task-profile',
        category: '画像中心',
        title: '补充您的 OPC 技术资产与合规属性',
        summary: '有 4 项专精特新/算法政策因前置条件缺失被锁定',
        status: 'blocked',
        progress: 10,
        updatedAt: '今天',
        actionLabel: '去完善',
        actionPath: '/profile',
    },
    {
        id: 'task-application',
        category: '申报中心',
        title: '2026年市级人工智能场景应用补贴（医疗方向）',
        summary: 'AI 撰写中，待用户补充财务报表',
        status: 'generating',
        progress: 80,
        updatedAt: '2小时前',
        actionLabel: '查看申报',
        actionPath: '/applications',
    },
];

const mockParkSpaceDashboard: ParkStats = {
    newLeads: 124,
    leadsGrowth: 15, // +15%
    opcPoolCount: 45,
    convertedCount: 8,
    convertedGrowth: 2,
    investmentTargets: [
        {
            id: 1,
            name: '某AI芯片设计公司',
            matchScore: '95%',
            industry: '集成电路设计 - AI芯片',
            size: 'B轮融资、估值5亿、员工150人',
            location: '北京中关村',
            valuePoints: [
                { text: '补链价值高：填补园区AI芯片设计空白', type: 'high' },
                { text: '协同效应强：可与园区45家AI企业形成供需关系', type: 'high' },
                { text: '搬迁意向：正在寻找长三角研发中心选址' }
            ],
            strategy: [
                '重点推介园区AI产业集群优势和潜在客户资源',
                '可提供政策：落户奖励500万 + 研发补贴 + 人才公寓'
            ]
        },
        {
            id: 2,
            name: '某智能算法科技公司',
            matchScore: '88%',
            industry: '人工智能 - 核心算法',
            size: 'A轮融资、估值2亿、员工80人',
            location: '深圳南山',
            valuePoints: [
                { text: '强链价值：提升园区AI产业技术含量', type: 'high' },
                { text: '技术领先：拥有多项核心算法专利', type: 'high' },
                { text: '成长性好：近两年营收增长200%+' }
            ],
            strategy: [
                '匹配"雏鹰计划"算力补贴，降低研发成本',
                '可提供政策：每年300万算力券 + 免费过渡办公空间'
            ]
        },
        {
            id: 3,
            name: '未名大语言模型团队 (张博士)',
            matchScore: '85%',
            industry: '基础大模型 - OPC',
            size: '天使轮 (OPC)、估值5000万、核心团队8人',
            location: '上海徐汇',
            valuePoints: [
                { text: '孵化潜力：顶尖高校背景，技术壁垒极高', type: 'high' },
                { text: '政策契合：完美匹配园区OPC早期扶持计划' }
            ],
            strategy: [
                '主打"拎包入住"与"免费算力"',
                '可提供政策：首年全面免租 + 100万启动基金'
            ]
        }
    ],
    trendData: [
        { name: '1月', aiCount: 45, value: 120 },
        { name: '2月', aiCount: 52, value: 180 },
        { name: '3月', aiCount: 61, value: 250 },
        { name: '4月', aiCount: 75, value: 390 },
        { name: '5月', aiCount: 88, value: 480 },
        { name: '6月', aiCount: 105, value: 650 },
    ]
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DashboardService = {
    getEnterpriseStats: async (): Promise<DashboardStats> => {
        try {
            const response = await apiClient.get<{ success: boolean; data: DashboardStats; message: string }>(
                '/api/v1/dashboard/enterprise/overview',
            );
            return response.data.data;
        } catch {
            // Keep dashboard usable when backend or token is unavailable during demos.
            await delay(700);
            return mockEnterpriseDashboard;
        }
    },

    getParkStats: async (): Promise<ParkStats> => {
        await delay(700);
        return mockParkSpaceDashboard;
    },

    getEnterpriseTasks: async (): Promise<DashboardTask[]> => {
        try {
            const response = await apiClient.get<{ success: boolean; data: DashboardTask[]; message: string }>(
                '/api/v1/dashboard/enterprise/tasks',
            );
            return response.data.data;
        } catch {
            await delay(300);
            return mockDashboardTasks;
        }
    },
};
