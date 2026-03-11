import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Target, Search, Filter, TrendingUp, Building2, MapPin, Briefcase, Users, Cpu, FileText, Upload, Zap, ArrowRight, CheckCircle2, Send, PieChart, Bell } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import ViewDetailsModal from './components/ViewDetailsModal';
import GenerateProposalModal from './components/GenerateProposalModal';

import { DashboardService } from '../../services/dashboardService';
import type { ParkStats } from '../../types/dashboard';

type ParkTab = 'investment' | 'policies' | 'insights';

export default function ParkSpacePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const pathMap: Record<string, ParkTab> = {
        '/park/investment': 'investment',
        '/park/policies': 'policies',
        '/park/insights': 'insights',
        '/park/dashboard': 'investment'
    };
    const activeTab = pathMap[location.pathname] || 'investment';

    const [stats, setStats] = useState<ParkStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [isProposalOpen, setIsProposalOpen] = useState(false);
    const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

    const handleViewDetails = (targetId: string) => {
        setSelectedTargetId(targetId);
        setIsViewDetailsOpen(true);
    };

    const handleGenerateProposal = (targetId: string) => {
        setIsViewDetailsOpen(false); // Close details if open
        setSelectedTargetId(targetId);
        setIsProposalOpen(true);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await DashboardService.getParkStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load park stats", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading || !stats) {
        return (
            <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-pulse p-8">
                <div className="h-20 bg-slate-100 rounded-xl mb-8"></div>
                <div className="h-14 bg-slate-100 w-1/3 rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>)}
                </div>
                <div className="h-96 bg-slate-100 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-brand-deep tracking-tight">园区管理控制台</h1>
                    <p className="text-sm font-medium text-adaptive-text-muted mt-1">
                        为园区运营方提供智能招商、政策全态发布及产业洞察引擎
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-adaptive-border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        <Upload className="w-4 h-4 text-brand-tech" />
                        批量导入企业库
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-tech hover:bg-brand-deep border border-transparent rounded-lg text-sm font-bold text-white transition-all shadow-md">
                        <FileText className="w-4 h-4" />
                        新建园区政策
                    </button>
                </div>
            </div>

            {/* Premium Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-adaptive-bg/50 border border-adaptive-border rounded-xl w-fit backdrop-blur-sm shadow-sm font-medium">
                <button
                    onClick={() => navigate('/park/investment')}
                    className={`px - 5 py - 2.5 rounded - lg transition - all duration - 300 flex items - center gap - 2 text - sm ${activeTab === 'investment'
                        ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                        : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        } `}
                >
                    <Target className="w-4 h-4" />
                    智能招商
                </button>
                <button
                    onClick={() => navigate('/park/policies')}
                    className={`px - 5 py - 2.5 rounded - lg transition - all duration - 300 flex items - center gap - 2 text - sm ${activeTab === 'policies'
                        ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                        : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        } `}
                >
                    <Send className="w-4 h-4" />
                    政策发布与推送
                </button>
                <button
                    onClick={() => navigate('/park/insights')}
                    className={`px - 5 py - 2.5 rounded - lg transition - all duration - 300 flex items - center gap - 2 text - sm ${activeTab === 'insights'
                        ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                        : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        } `}
                >
                    <PieChart className="w-4 h-4" />
                    产业洞察
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">

                {/* ===================== TAB 1: 智能招商 ===================== */}
                {activeTab === 'investment' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl border border-adaptive-border p-6 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-adaptive-text-muted">本月新增补链线索</p>
                                    <p className="text-2xl font-bold text-slate-800">{stats.newLeads} <span className="text-xs text-green-500 font-medium">+{stats.leadsGrowth}%</span></p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-adaptive-border p-6 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-adaptive-text-muted">OPC 创业者跟踪池</p>
                                    <p className="text-2xl font-bold text-slate-800">{stats.opcPoolCount} <span className="text-xs text-brand-tech font-medium">高优</span></p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-adaptive-border p-6 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-adaptive-text-muted">已转化入驻企业</p>
                                    <p className="text-2xl font-bold text-slate-800">{stats.convertedCount} <span className="text-xs text-green-500 font-medium">+{stats.convertedGrowth}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Investment Suggestions Panel */}
                        <div className="bg-white rounded-xl border border-adaptive-border shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-tech/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4 relative z-10">
                                📋 招商建议
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Cpu className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-slate-800">🎯 补链方向：AI芯片设计企业</h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-slate-600 mt-3">
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">原因：</span>
                                            <span>园区AI企业多，但缺少上游芯片设计环节</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">目标：</span>
                                            <span className="text-slate-700 font-medium">引进2-3家AI芯片设计企业，形成完整产业链</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-slate-800">🎯 强链方向：AI算法企业</h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-slate-600 mt-3">
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">原因：</span>
                                            <span>现有AI企业以应用为主，算法层较薄弱</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-400 font-medium whitespace-nowrap">目标：</span>
                                            <span className="text-slate-700 font-medium">引进1-2家核心算法企业，提升产业链技术含量</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation Cards */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-2">
                                    🏢 推荐招商目标
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" placeholder="搜索企业名称或标签..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech w-64 bg-white shadow-sm" />
                                    </div>
                                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 bg-white hover:text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {stats.investmentTargets.map((target) => (
                                <div key={target.id} className="bg-white rounded-xl border border-adaptive-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                    {/* Card Header */}
                                    <div className="p-5 border-b border-adaptive-border bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 group-hover:text-brand-tech transition-colors">{target.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2 bg-brand-tech/10 text-brand-deep px-3 py-1.5 rounded-full font-bold text-sm">
                                            <Zap className="w-4 h-4" />
                                            匹配度：{target.matchScore}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                                        {/* Basic Info */}
                                        <div className="md:col-span-4 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Briefcase className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium mb-1">行业</p>
                                                    <p className="text-sm font-semibold text-slate-700">{target.industry}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <TrendingUp className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium mb-1">规模</p>
                                                    <p className="text-sm font-semibold text-slate-700">{target.size}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium mb-1">现址</p>
                                                    <p className="text-sm font-semibold text-slate-700">{target.location}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Values & Strategy */}
                                        <div className="md:col-span-8 flex flex-col sm:flex-row gap-6 bg-slate-50/50 rounded-lg p-5 border border-slate-100">
                                            {/* Value Points */}
                                            <div className="flex-1 space-y-3">
                                                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                                                    <Target className="w-4 h-4 text-brand-tech" />
                                                    招引价值
                                                </h5>
                                                <ul className="space-y-2.5">
                                                    {target.valuePoints?.map((vp, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${vp.type === 'high' ? 'text-green-500' : 'text-blue-400'} `} />
                                                            <span className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                {vp.text}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Strategy */}
                                            <div className="flex-1 space-y-3 pt-4 sm:pt-0 sm:border-l border-slate-200 sm:pl-6">
                                                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                                                    <FileText className="w-4 h-4 text-brand-tech" />
                                                    招引策略建议
                                                </h5>
                                                <ul className="space-y-2 text-sm text-slate-600">
                                                    {target.strategy?.map((s, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 relative pl-3">
                                                            <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-brand-tech/60"></div>
                                                            <span className="leading-relaxed font-medium">{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="px-5 py-4 bg-slate-50/80 border-t border-adaptive-border flex justify-end gap-3 flex-wrap">
                                        <button
                                            onClick={() => handleViewDetails(String(target.id))}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 hover:text-brand-tech transition-colors"
                                        >
                                            查看详情
                                        </button>
                                        <button
                                            onClick={() => handleGenerateProposal(String(target.id))}
                                            className="px-4 py-2 bg-brand-tech text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-deep transition-colors flex items-center gap-2"
                                        >
                                            生成招商方案
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===================== TAB 2: 政策发布与推送 ===================== */}
                {activeTab === 'policies' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                        {/* 左侧：内容上传与设置 */}
                        <div className="col-span-1 border border-adaptive-border bg-white rounded-xl shadow-sm p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                    <Upload className="w-5 h-5 text-brand-tech" />
                                    发布新园区政策
                                </h3>
                                <p className="text-xs text-adaptive-text-muted">上传政策文件，AI 将自动结构化提炼核心条件，并全网精准匹配企业。</p>
                            </div>

                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-brand-tech" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-700">拖拽或点击上传文件</h4>
                                <p className="text-xs text-slate-400 mt-1">支持 PDF, Word, HTML (最大 50MB)</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100 mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-600">定向推送范围</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 cursor-pointer">
                                        <input type="checkbox" className="rounded text-brand-tech focus:ring-brand-tech" defaultChecked />
                                        <span>园内已入驻企业 (自动匹配)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 cursor-pointer">
                                        <input type="checkbox" className="rounded text-brand-tech focus:ring-brand-tech" defaultChecked />
                                        <span>园外全网高潜力 OPC 企业</span>
                                        <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">招商</span>
                                    </label>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-brand-tech hover:bg-brand-deep text-white font-bold text-sm rounded-lg shadow-md transition-all">
                                上传并由 AI 解析
                            </button>
                        </div>

                        {/* 右侧：已发布记录 */}
                        <div className="col-span-1 lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                已生效园区政策
                            </h3>

                            {/* 政策卡片 1 */}
                            <div className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="inline-block px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded mb-2">
                                            生效中
                                        </span>
                                        <h4 className="font-bold text-lg text-slate-800">2026年苏州AI产业园“雏鹰计划”工位补贴</h4>
                                        <p className="text-xs text-slate-500 mt-1">发布时间：2026-03-01 &bull; 涵盖范围：OPC团队、初创AI企业</p>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-brand-tech">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-6 pt-3 border-t border-slate-100 mt-1">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 font-medium uppercase">全网触达</p>
                                        <p className="text-lg font-bold text-slate-700">1,204</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100" />
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 font-medium uppercase">高匹配度</p>
                                        <p className="text-lg font-bold text-brand-tech">156</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100" />
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 font-medium uppercase">转化意向</p>
                                        <p className="text-lg font-bold text-green-500">23</p>
                                    </div>
                                    <div className="ml-auto">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-tech hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">
                                            <Bell className="w-3.5 h-3.5" />
                                            一键短信触达
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 政策卡片 2 */}
                            <div className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow opacity-70">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded mb-2">
                                            解析中
                                        </span>
                                        <h4 className="font-bold text-lg text-slate-800">关于开展人工智能算法算力券兑现的通知</h4>
                                        <p className="text-xs text-slate-500 mt-1">发布时间：刚刚 &bull; AI 正在结构化条款与生成画像模型...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===================== TAB 3: 产业洞察 ===================== */}
                {activeTab === 'insights' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Chart 1 */}
                            <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-6 col-span-1 lg:col-span-2">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">AI 产业链入驻企业增长趋势</h3>
                                        <p className="text-xs text-slate-500">2026年上半年企业入驻与累计估值变化</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-brand-tech" /> 企业数量</span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-500" /> 累计估值(亿)</span>
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3182ce" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="aiCount" stroke="#3182ce" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                            <Area type="monotone" dataKey="value" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Chart 2 */}
                            <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-6">入驻企业生命阶段图谱</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[
                                                { name: 'OPC / 预孵化', value: 45 },
                                                { name: '天使轮', value: 32 },
                                                { name: 'A-B轮', value: 24 },
                                                { name: 'C轮以上', value: 8 }
                                            ]}
                                            layout="vertical"
                                            margin={{ top: 0, right: 20, left: 30, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A5568', fontWeight: 600 }} width={100} />
                                            <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="value" fill="#3182ce" radius={[0, 4, 4, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-rows-2 gap-4">
                                <div className="bg-gradient-to-br from-brand-tech to-brand-deep rounded-xl p-6 shadow-md text-white flex flex-col justify-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none" />
                                    <div className="flex items-center gap-2 text-blue-100 font-medium text-sm mb-2">
                                        <Zap className="w-4 h-4" /> 算力补贴撬动率
                                    </div>
                                    <div className="text-3xl font-bold font-heading">1 : 4.5</div>
                                    <div className="text-xs text-blue-100/80 mt-1">每1万算力券撬动4.5万社会投资</div>
                                </div>
                                <div className="bg-white border border-adaptive-border rounded-xl p-6 shadow-sm flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-2">
                                        <Briefcase className="w-4 h-4 text-orange-500" /> 政策全网曝光转化率
                                    </div>
                                    <div className="text-3xl font-bold font-heading text-slate-800">12.8%</div>
                                    <div className="text-xs text-slate-400 mt-1">高于平均产业园平台 8%</div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ViewDetailsModal
                isOpen={isViewDetailsOpen}
                onClose={() => setIsViewDetailsOpen(false)}
                targetId={selectedTargetId}
                onGenerateProposal={handleGenerateProposal}
            />

            <GenerateProposalModal
                isOpen={isProposalOpen}
                onClose={() => setIsProposalOpen(false)}
                targetId={selectedTargetId}
            />
        </div>
    );
}
