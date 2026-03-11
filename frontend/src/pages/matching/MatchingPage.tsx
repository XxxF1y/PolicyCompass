import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    AlertCircle,

    Lock,
    Building2,
    Users,
    MapPin,
    Tag,

    Eye
} from 'lucide-react';

import { PolicyService } from '../../services/policyService';
import type { MatchPolicy } from '../../types/policy';

export default function MatchingPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | '100' | 'opc'>('all');
    const [policiesData, setPoliciesData] = useState<MatchPolicy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await PolicyService.getMatchedPolicies();
                setPoliciesData(data);
            } catch (error) {
                console.error("Failed to fetch policies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicies();
    }, []); const filteredPolicies = policiesData.filter(p => {
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
                                        {policy.blockers.map((blocker: any, idx: number) => (
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
                                <button
                                    onClick={() => navigate(`/policy/${policy.id}`)}
                                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors duration-200" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                                >
                                    <Eye className="w-4 h-4" />
                                    查看政策详情
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
