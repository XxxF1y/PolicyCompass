import type { PolicyDetail, MatchPolicy } from '../types/policy';
import { Coins, Landmark, Lightbulb, Building2 } from 'lucide-react';

// Hardcoded mock data from the frontend components

const policiesDB: Record<string, PolicyDetail> = {
    'p1': {
        id: 'p1',
        title: '人工智能算力平台专项补贴',
        department: '苏州市工信局',
        publishDate: '2024-03-15',
        validUntil: '2025-12-31',
        status: 'active',
        matchScore: 100,
        blockers: [],
        conditions: {
            required: [
                { text: '注册满1年以上', met: true, gap: null },
                { text: '购买或租赁园区OPC官方认证的智算中心算力服务', met: true, gap: null },
                { text: '年度算力支出规模≥50万元', met: true, gap: null }
            ],
            bonus: [
                { text: '使用国产架构GPU算力', score: '+10分', met: true }
            ],
            exclusion: [
                { text: '近3年无重大安全事故', passed: true }
            ]
        },
        supports: [
            { icon: Coins, title: '算力补贴', desc: '按实际支付算力费用的30%给予补贴，最高200万元。' }
        ],
        process: [
            { step: 1, title: '线上申报', date: '截止 2024.05.31', status: 'pending' },
            { step: 2, title: '算力核验', date: '预计 6月中旬', status: 'upcoming' },
            { step: 3, title: '资金下达', date: '预计 7月下旬', status: 'upcoming' }
        ]
    },
    'p2': {
        id: 'p2',
        title: '企业研发机构与创新平台奖励 (省级专项)',
        department: '江苏省科技厅',
        publishDate: '2024-01-10',
        validUntil: '2024-10-31',
        status: 'active',
        matchScore: 85,
        blockers: [
            { id: 1, text: '需拥有的总知识产权数量不足 (目标至少5项，当前3项)', current: 3, target: 5, type: 'warning' }
        ],
        conditions: {
            required: [
                { text: '在省内注册满3年以上', met: true, gap: null },
                { text: '已建有市级以上企业研发机构', met: true, gap: null },
                { text: '拥有核心自主知识产权≥5项', met: false, gap: '当前3项，还差2项' }
            ],
            bonus: [
                { text: '主导或参与制定过国家级标准', score: '+20分', met: false }
            ],
            exclusion: [
                { text: '近3年无环保处罚记录', passed: true }
            ]
        },
        supports: [
            { icon: Landmark, title: '平台奖励', desc: '首次荣获省级研发平台认定的，给予 100 万元一次性奖励。' }
        ],
        process: [
            { step: 1, title: '省厅申报', date: '截止 2024.10.31', status: 'pending' }
        ]
    },
    'p3': {
        id: 'p3',
        title: '高新技术企业培育资金',
        department: '苏州市科技局',
        publishDate: '2024-02-01',
        validUntil: '2024-11-30',
        status: 'active',
        matchScore: 49,
        blockers: [
            { id: 1, text: '前置身份缺失：必须先完成《科技型中小企业入库》', current: 0, target: 1, type: 'critical' }
        ],
        conditions: {
            required: [
                { text: '已入库成为国家科技型中小企业', met: false, gap: '前置依赖未达成' },
                { text: '研发费用占比≥5%', met: true, gap: null },
                { text: '高新收入占比≥60%', met: true, gap: null }
            ],
            bonus: [],
            exclusion: [
                { text: '环保严重失信单', passed: true }
            ]
        },
        supports: [
            { icon: Lightbulb, title: '入库培育金', desc: '进入市高企培育库企业，一次性奖励20万元。' }
        ],
        process: [
            { step: 1, title: '系统填报', date: '滚动申报', status: 'pending' }
        ]
    },
    'p4': {
        id: 'p4',
        title: 'OPC 开发者生态联合入驻扶持',
        department: '苏州工业园区管委会',
        publishDate: '2024-04-01',
        validUntil: '2026-12-31',
        status: 'active',
        matchScore: 45,
        blockers: [
            { id: 1, text: '政策要求企业注册地必须在 OPC 生态社区内', current: 0, target: 1, type: 'critical' }
        ],
        conditions: {
            required: [
                { text: '入驻官方认证的OPC产业载体', met: false, gap: '当前注册地址非OPC园区' },
                { text: '核心团队规模≥10人', met: true, gap: null }
            ],
            bonus: [
                { text: '创始人拥有海外顶尖名校AI方向背景', score: '直接过审', met: false }
            ],
            exclusion: [
                { text: '近2年有未解决的劳动争议诉讼', passed: true }
            ]
        },
        supports: [
            { icon: Building2, title: '免租优惠', desc: '提供最高500平米，最长2年的全额免租场地支持。' }
        ],
        process: [
            { step: 1, title: '意向对接', date: '常态化', status: 'pending' },
            { step: 2, title: '入驻签约', date: '待定', status: 'upcoming' }
        ]
    }
};

const matchPoliciesDB: MatchPolicy[] = [
    {
        id: 'p1',
        title: '人工智能算力平台专项补贴',
        agency: '苏州市工信局',
        tags: ['算力补贴', 'OPC先行'],
        amount: '最高 50 万',
        matchScore: 100,
        matchText: '完全匹配',
        statusColor: '#38a169',
        matchReason: '企业算力需求与平台补贴政策高度吻合，可补充园区AI算力设计空白，可与园区40家AI应用企业形成算力供需关系，完善"芯片-算法-应用"全链条',
        isOpcExclusive: true
    },
    {
        id: 'p2',
        title: '企业研发机构与创新平台奖励',
        agency: '江苏省科技厅',
        tags: ['研发资金', '省级专项'],
        amount: '30 - 100 万',
        matchScore: 85,
        matchText: '高度匹配',
        statusColor: '#3182ce',
        matchReason: '企业研发投入符合省级创新平台奖励标准，大模型是AI产业发展趋势，可带动园区算法层和应用层企业整体升级',
        blockers: [
            { type: 'qualification', message: '需拥有的总知识产权数量不足', gap: '目标至少 5 项，当前仅有 3 项 (含软著/专利)' }
        ]
    },
    {
        id: 'p3',
        title: '高新技术企业培育资金',
        agency: '苏州市科技局',
        tags: ['资质认定', '一票否决'],
        amount: '20 万',
        matchScore: 49,
        matchText: '逻辑锁降级',
        statusColor: '#ed8936',
        matchReason: '高新技术企业认定是获取后续更多扶持政策的前置条件，建议优先完成入库',
        blockers: [
            { type: 'qualification', message: '前置身份缺失', gap: '必须先完成《科技型中小企业入库》，当前状态为未入库', isLogicLock: true }
        ]
    },
    {
        id: 'p4',
        title: 'OPC 开发者生态联合入驻扶持',
        agency: '苏州工业园区管委会',
        tags: ['OPC专属', '场地资金'],
        amount: '免租 2 年 + 启动金',
        matchScore: 45,
        matchText: '需前置动作',
        statusColor: '#718096',
        matchReason: '园区生态政策要求企业注册地在OPC生态社区内，入驻后可享受免租及启动金等一揽子扶持',
        isOpcExclusive: true,
        blockers: [
            { type: 'opc', message: '尚未入驻任何官方认证的 OPC 社区', gap: '政策要求企业注册地必须在 OPC 生态社区内', isLogicLock: true }
        ]
    }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const PolicyService = {
    // Get all matched policies for the matching page
    getMatchedPolicies: async (): Promise<MatchPolicy[]> => {
        await delay(800); // 800ms virtual network config
        return matchPoliciesDB;
    },

    // Get detail of a specific policy by ID
    getPolicyDetail: async (id: string): Promise<PolicyDetail> => {
        await delay(600);
        const policy = policiesDB[id];
        if (!policy) {
            // Provide a fallback if not found, since we only mocked 4
            return policiesDB['p1'];
        }
        return policy;
    }
};
