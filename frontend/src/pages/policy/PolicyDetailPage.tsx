import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Sparkles,
    Calendar,
    Building2,
    Clock,
    AlertCircle,
    Target,
    CheckCircle2,
    XCircle,
    Ban,
    ArrowDownToLine,
    Star,
    ArrowRight,
    ArrowDown
} from 'lucide-react';

import { PolicyService } from '../../services/policyService';
import type { PolicyDetail } from '../../types/policy';

export default function PolicyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState<PolicyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                // If ID is completely missing, defaults to p1 inside the service layer
                const data = await PolicyService.getPolicyDetail(id || 'p1');
                setPolicy(data);
            } catch (error) {
                console.error("Failed to load policy:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolicy();
    }, [id]);

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-pulse mt-8">
                {/* Header Skeleton */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8">
                    <div className="h-6 w-1/4 bg-slate-200 rounded mb-4"></div>
                    <div className="h-10 w-3/4 bg-slate-200 rounded mb-6"></div>
                    <div className="flex gap-8">
                        <div className="h-4 w-32 bg-slate-100 rounded"></div>
                        <div className="h-4 w-40 bg-slate-100 rounded"></div>
                    </div>
                </div>
                {/* Body skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-50 h-64 rounded-2xl border border-slate-100"></div>
                        <div className="bg-slate-50 h-96 rounded-2xl border border-slate-100"></div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-50 h-80 rounded-2xl border border-slate-100"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
                <h2 className="text-xl font-bold mb-2">未找到该政策</h2>
                <p>该政策可能已被移除或地址错误</p>
                <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-brand-tech text-white rounded-lg font-medium shadow-md hover:bg-brand-tech/90 transition-colors">
                    返回列表
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Top Navigation */}
            <div className="flex items-center gap-2 text-adaptive-text-muted hover:text-brand-tech cursor-pointer w-fit transition-colors" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">返回返回政策列表</span>
            </div>

            {/* 1. Basic Info Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-adaptive-border p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-tech"></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-500/10 text-green-600 border border-green-500/20">
                                申报中
                            </span>
                            <span className="text-xs font-medium text-brand-tech bg-brand-tech/10 px-2 py-0.5 rounded">
                                {policy.id}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-deep leading-tight">
                            {policy.title}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-adaptive-text-muted">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-adaptive-text-muted/70" />
                        <span>{policy.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-adaptive-text-muted/70" />
                        <span>发布: {policy.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-adaptive-text-muted/70" />
                        <span>有效期至: {policy.validUntil}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 2. AI Interpretation */}
                    <div className="bg-gradient-to-br from-brand-tech/5 to-transparent rounded-2xl shadow-sm border border-brand-tech/20 p-6 relative">
                        <div className="absolute top-4 right-4 text-brand-tech/20">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-deep mb-4">
                            <Sparkles className="w-5 h-5 text-brand-tech" /> AI 通俗解读
                        </h2>
                        <div className="prose prose-sm text-adaptive-text relative z-10 leading-relaxed">
                            <p>
                                这是一项鼓励企业发展**人工智能核心技术**和**算力租赁**的综合性补贴政策。
                            </p>
                            <p>
                                **划重点**：如果你买/租了智算算力（比如 A800 节点），政府可以给你报销 30%，最高拿 200 万！另外，如果有重大的 AI 研发项目（比如搞大模型底座研发），还能申请最高 500 万的研发补贴。
                            </p>
                            <p>
                                **避坑指南**：门槛是营收和专利，必须有实际发票，且必须在苏州市内产生。如果是“专精特新”企业或者发明专利多于3项，会有明显的加分，提高中标率。
                            </p>
                        </div>
                    </div>

                    {/* 5. Deconstructed Conditions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-adaptive-border p-6 md:p-8">
                        <h2 className="text-xl font-bold text-brand-deep mb-6">📝 申报条件拆解</h2>

                        <div className="space-y-6">
                            {/* Required */}
                            <div>
                                <h3 className="text-sm font-bold text-brand-deep mb-3 inline-block px-3 py-1 bg-slate-100 rounded-md">
                                    必要条件 (必须全部满足)
                                </h3>
                                <div className="space-y-2">
                                    {policy.conditions.required.map((cond: any, i: number) => (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${cond.met ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${cond.met ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="text-sm font-medium text-slate-700">{cond.text}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {cond.met ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600"><CheckCircle2 className="w-4 h-4" /> 已满足</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4" /> 未满足 {cond.gap && `(${cond.gap})`}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bonus */}
                            <div>
                                <h3 className="text-sm font-bold text-brand-deep mb-3 inline-block px-3 py-1 bg-brand-tech/10 text-brand-tech rounded-md">
                                    加分条件 (满足可提高评审得分)
                                </h3>
                                <div className="space-y-2">
                                    {policy.conditions.bonus.map((cond: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full border border-slate-400"></div>
                                                <span className="text-sm font-medium text-slate-700">{cond.text}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold text-brand-tech bg-brand-tech/10 px-2 py-0.5 rounded">{cond.score}</span>
                                                {cond.met ? (
                                                    <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 具备</span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">未具备</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Exclusion */}
                            <div>
                                <h3 className="text-sm font-bold text-brand-deep mb-3 inline-block px-3 py-1 bg-slate-100 rounded-md">
                                    排除条件 (触发任一项则无法申报)
                                </h3>
                                <div className="space-y-2">
                                    {policy.conditions.exclusion.map((cond: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                                            <div className="flex items-center gap-3">
                                                <Ban className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">{cond.text}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" /> 通过
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Core Support Benefits */}
                    <div className="bg-white rounded-2xl shadow-sm border border-adaptive-border p-6">
                        <h2 className="text-lg font-bold text-brand-deep mb-5">支持内容与额度</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {policy.supports.map((support: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl border border-adaptive-border-light bg-gradient-to-b from-transparent to-adaptive-bg text-center">
                                    <div className="w-12 h-12 mx-auto bg-brand-tech/10 rounded-full flex items-center justify-center mb-3">
                                        <support.icon className="w-6 h-6 text-brand-tech" />
                                    </div>
                                    <h3 className="font-bold text-brand-deep mb-2">{support.title}</h3>
                                    <p className="text-xs text-adaptive-text-muted leading-relaxed text-left">{support.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">

                    {/* 3. My Matching Analysis */}
                    <div className="bg-white rounded-2xl shadow-sm border border-adaptive-border overflow-hidden">
                        <div className="bg-brand-deep p-4 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                <Target className="w-4 h-4 text-brand-tech" /> 我的智能匹配分析
                            </h2>
                            <span className="text-xs text-white/70">基于当前企业画像</span>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-center mb-6">
                                {/* SVG Donut Chart for Score */}
                                <div className="relative w-32 h-32">
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-gray-100" strokeWidth="12" />
                                        <circle
                                            cx="50" cy="50" r="40" fill="transparent" stroke="currentColor"
                                            className="text-brand-tech drop-shadow-md" strokeWidth="12"
                                            strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * policy.matchScore) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-brand-deep">{policy.matchScore}<span className="text-sm text-adaptive-text-muted">%</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-adaptive-text-muted border-b border-adaptive-border-light pb-2">卡点分析 (待解决的阻碍)</h3>
                                {policy.blockers.map((blocker: any) => (
                                    <div key={blocker.id} className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            {blocker.type === 'critical' ? (
                                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                            )}
                                            <span className="text-xs text-adaptive-text leading-tight">{blocker.text}</span>
                                        </div>
                                        {/* Progress bar if applicable */}
                                        {blocker.target > 1 && (
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-6 w-[calc(100%-24px)]">
                                                <div
                                                    className={`h-full rounded-full ${blocker.type === 'critical' ? 'bg-red-500' : 'bg-warning'}`}
                                                    style={{ width: `${Math.min(100, (blocker.current / blocker.target) * 100)}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-6 bg-brand-tech text-white py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(49,130,206,0.4)] hover:shadow-[0_0_20px_rgba(49,130,206,0.6)] focus:outline-none focus:ring-2 focus:ring-brand-tech focus:ring-offset-2 transition-all">
                                补齐缺失资质 (成长导航)
                            </button>
                        </div>
                    </div>

                    {/* 4. Knowledge Graph / Trajectory */}
                    <div className="bg-white rounded-2xl shadow-sm border border-adaptive-border p-6 overflow-hidden">
                        <h2 className="text-lg font-bold text-brand-deep mb-6">🔗 政策知识图谱</h2>

                        <div className="space-y-8">
                            {/* Vertical Derivation */}
                            <div>
                                <div className="text-xs font-bold text-adaptive-text-muted mb-4 flex items-center gap-2">
                                    <ArrowDown className="w-4 h-4" /> 纵向政策派生关系：
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col items-center w-fit mx-auto md:mx-0">
                                    {/* Top Level */}
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm z-10 relative">
                                            <span className="text-sm font-bold text-slate-500">
                                                [国家级]
                                            </span>
                                            <span className="text-sm font-bold text-slate-700">
                                                高新技术企业认定管理办法
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow Line */}
                                    <div className="flex flex-col items-center -my-1">
                                        <div className="w-0.5 h-6 bg-slate-300"></div>
                                        <div className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 z-10">
                                            落地细则
                                        </div>
                                        <div className="w-0.5 h-6 bg-slate-300"></div>
                                        <ArrowDown className="w-4 h-4 text-slate-400 -mt-2 z-10" />
                                    </div>

                                    {/* Current Level */}
                                    <div className="flex flex-col items-center z-10 relative mt-1">
                                        <div className="px-4 py-2 bg-brand-tech text-white rounded-lg shadow-md ring-2 ring-brand-tech/30 ring-offset-2 flex items-center gap-2">
                                            <span className="text-sm font-bold">
                                                (当前政策)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Growth */}
                            <div>
                                <div className="text-xs font-bold text-adaptive-text-muted mb-4 flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4" /> 横向资质成长关系：
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-sm bg-brand-tech/5 p-4 rounded-xl border border-brand-tech/10">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-2 py-1 bg-adaptive-panel border border-adaptive-border text-slate-600 rounded text-[11px] font-bold shrink-0">[前置依赖]</span>
                                        <span className="font-medium text-slate-600 line-through decoration-slate-400 shrink-0">科技型中小企业</span>
                                    </div>
                                    <div className="flex items-center text-brand-tech shrink-0">
                                        <span className="text-xs hidden sm:inline px-1">──解锁──&gt;</span>
                                        <ArrowRight className="w-4 h-4 sm:hidden mx-1" />
                                    </div>
                                    <div className="flex items-center gap-2 text-brand-tech shrink-0">
                                        <span className="px-2 py-1 bg-brand-tech text-white rounded text-sm font-bold shadow-md ring-2 ring-brand-tech/30 ring-offset-1">
                                            (当前政策)
                                        </span>
                                    </div>
                                    <div className="flex items-center text-purple-600 shrink-0">
                                        <span className="text-xs hidden sm:inline px-1">──高概率接续──&gt;</span>
                                        <ArrowRight className="w-4 h-4 sm:hidden mx-1" />
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                                        <span className="font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 shadow-sm cursor-pointer hover:bg-purple-200 transition-colors">
                                            进入 专精特新中小企业
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 text-right mt-2">* 点击上方节点可查看政策摘要并直接跳转</p>
                        </div>
                    </div>

                    {/* 7. Materials & Workflow */}
                    <div className="bg-white rounded-2xl shadow-sm border border-adaptive-border p-5">
                        <h2 className="text-sm font-bold text-brand-deep mb-4 border-b border-adaptive-border-light pb-2">提交流程与节点</h2>

                        <div className="space-y-4">
                            {policy.process.map((step: any, i: number) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${step.status === 'past' ? 'bg-green-500/10 border-green-500/30 text-green-600' : step.status === 'pending' ? 'bg-brand-tech text-white border-brand-tech shadow-md' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                            {step.step}
                                        </div>
                                        {i < policy.process.length - 1 && <div className={`w-0.5 h-8 ${step.status === 'past' ? 'bg-green-500/30' : 'bg-gray-100'} mt-1`}></div>}
                                    </div>
                                    <div className="pt-0.5">
                                        <div className={`text-sm font-bold ${step.status === 'pending' ? 'text-brand-deep' : 'text-adaptive-text'}`}>{step.title}</div>
                                        <div className="text-xs text-adaptive-text-muted">{step.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Pad the bottom so the main content isn't hidden under the fixed bar */}
            <div className="h-24 md:h-20"></div>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-adaptive-border shadow-[0_-10px_30px_rgba(0,0,0,0.06)] z-50 p-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
                        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-brand-tech/10 border border-brand-tech/20">
                            <Target className="w-6 h-6 text-brand-tech" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-brand-deep">我的匹配度: <span className="text-xl text-brand-tech font-black">80%</span></span>
                            <span className="text-xs text-adaptive-text-muted truncate max-w-[300px] md:max-w-[400px]">
                                <span className="font-bold text-red-500 mr-1">卡点:</span>研发费用占比当前2.5%，需≥3% <span className="mx-1 opacity-50">|</span> <span className="text-brand-tech font-bold">建议:</span>增加研发投入约50万元可达标
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-adaptive-border text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
                            <Star className="w-4 h-4 text-orange-400" />
                            收藏政策
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-tech text-white font-bold shadow-lg shadow-brand-tech/30 hover:bg-blue-600 transition-all ring-offset-2 hover:ring-2 hover:ring-brand-tech">
                            <ArrowDownToLine className="w-4 h-4" />
                            生成申报材料
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
