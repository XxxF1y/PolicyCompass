import { useState } from 'react';
import {
    Target,
    AlertCircle,

    Lock,
    Building2,
    Users,
    MapPin,
    Tag,

    Mail,
    Eye,
    Plus
} from 'lucide-react';

// Data types based on PRD
interface Blocker {
    type: 'qualification' | 'data' | 'opc';
    message: string;
    gap?: string;
    isLogicLock?: boolean; // PRD: 一票否决机制
}

interface MatchPolicy {
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

const policiesData: MatchPolicy[] = [
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

export default function MatchingPage() {
    const [activeTab, setActiveTab] = useState<'all' | '100' | 'opc'>('all');

    const filteredPolicies = policiesData.filter(p => {
        if (activeTab === '100') return p.matchScore === 100;
        if (activeTab === 'opc') return p.isOpcExclusive;
        return true;
    });

    // Get match score color
    const getScoreColor = (score: number) => {
        if (score >= 90) return '#38a169';
        if (score >= 70) return '#3182ce';
        if (score >= 50) return '#ed8936';
        return '#718096';
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">

            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                            智能匹配中枢
                            <Target className="w-6 h-6 text-blue-500" />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            您的企业画像数据已与 <strong className="text-slate-700">24,591</strong> 条本年度最新政策完成交叉测算，系统已通过 6 维引擎识别出专属扶持矩阵。
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-8">
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">高度可配政策</span>
                    <span className="text-3xl font-black text-slate-800 ml-2">12</span>
                    <span className="text-sm text-slate-500">项</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">预估最高扶持</span>
                    <span className="text-3xl font-black text-emerald-600 ml-2">580</span>
                    <span className="text-sm text-emerald-600">万元</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'all' ? 'shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                    style={activeTab === 'all' ? { backgroundColor: '#2563eb', color: '#ffffff' } : {}}
                >
                    全部高配 (12)
                </button>
                <button
                    onClick={() => setActiveTab('100')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === '100' ? 'text-white bg-emerald-600 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >
                    100% 极度吻合 (1)
                </button>
                <button
                    onClick={() => setActiveTab('opc')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'opc' ? 'text-white bg-slate-700 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >
                    <Building2 className="w-4 h-4" />
                    OPC 专属生态 (2)
                </button>
            </div>

            {/* Policy Cards List */}
            <div className="space-y-4">
                {filteredPolicies.map(policy => (
                    <div
                        key={policy.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200 overflow-hidden"
                    >
                        <div className="flex">
                            {/* Left Color Stripe */}
                            <div className="w-2 shrink-0 rounded-l-xl" style={{ backgroundColor: policy.blockers && policy.blockers.length > 0 ? '#ed8936' : '#38a169' }}></div>
                            {/* Main Content Area */}
                            <div className="flex-1 p-5 md:p-6">
                                {/* Row 1: Tags + Title + Score */}
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                        {/* Tags */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {policy.tags.map(tag => (
                                                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-slate-800 leading-snug">{policy.title}</h3>
                                    </div>
                                    {/* Match Score */}
                                    <div className="shrink-0 text-right">
                                        <div className="text-[11px] text-slate-400 font-medium mb-0.5">智能匹配度</div>
                                        <div className="text-3xl font-black tracking-tight" style={{ color: getScoreColor(policy.matchScore) }}>
                                            {policy.matchScore}<span className="text-lg">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Metadata */}
                                <div className="flex items-center gap-5 mb-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 opacity-60" />
                                        <span>{policy.agency}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 opacity-60" />
                                        <span>{policy.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 opacity-60" />
                                        <span>面向企业主体</span>
                                    </div>
                                </div>

                                {/* Row 3: Match Reason Box */}
                                {policy.matchReason && (
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-2.5">
                                            <div className="mt-0.5 shrink-0">
                                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-600 mb-1">匹配理由</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">{policy.matchReason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Row 4: Blockers (if any) */}
                                {policy.blockers && policy.blockers.length > 0 && (
                                    <div className="space-y-2">
                                        {policy.blockers.map((blocker, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-lg flex items-start gap-2.5 border text-sm ${blocker.isLogicLock
                                                    ? 'bg-orange-50 border-orange-200'
                                                    : 'bg-blue-50 border-blue-100'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 shrink-0 ${blocker.isLogicLock ? 'text-orange-500' : 'text-blue-500'}`}>
                                                    {blocker.isLogicLock ? <Lock className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold ${blocker.isLogicLock ? 'text-orange-700' : 'text-slate-700'}`}>
                                                        {blocker.isLogicLock && (
                                                            <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded text-[10px] bg-orange-500 text-white uppercase tracking-wider align-middle">致命项</span>
                                                        )}
                                                        {blocker.message}
                                                    </span>
                                                    {blocker.gap && (
                                                        <p className="text-xs text-slate-500 mt-1">{blocker.gap}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Action Buttons Column */}
                            <div className="shrink-0 w-44 border-l border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-4 gap-3">
                                <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors duration-200" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                    <Eye className="w-4 h-4" />
                                    查看详情
                                </button>
                                <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200">
                                    <Plus className="w-4 h-4" />
                                    生成申报材料
                                </button>
                                <button className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-600 font-medium text-xs transition-colors duration-200 pt-1">
                                    <Mail className="w-3.5 h-3.5" />
                                    发送园区介绍
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
