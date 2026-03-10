import { useState } from 'react';
import {
    Users, FileText, PieChart, Upload, Search, Filter,
    ArrowRight, Building2, Bell, CheckCircle2,
    Target, Send, Briefcase, Zap
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

type ParkTab = 'investment' | 'policies' | 'insights';

// 模拟数据：招商目标
const investmentTargets = [
    {
        id: 1,
        name: '星瞳算力架构科技有限公司',
        direction: 'AI 基础设施 / 算力编排',
        value: '高 (强链)',
        stage: 'A轮',
        probability: '75%',
        reason: '该公司算力中心租约即将到期，我园区算力券政策对其吸引力极高。',
    },
    {
        id: 2,
        name: '某自动驾驶算法有限公司',
        direction: '具身智能 / 自动驾驶',
        value: '极高 (补链)',
        stage: 'B轮',
        probability: '60%',
        reason: '园区恰好缺乏头部自动驾驶算法企业，入驻可带动上下游10家企业聚集。',
    },
    {
        id: 3,
        name: '未名大语言模型团队 (张博士)',
        direction: '基础大模型',
        value: '中 (孵化)',
        stage: '天使轮 (OPC)',
        probability: '85%',
        reason: '该OPC团队急需免费工位与早期算力支持，匹配我园区的"雏鹰计划"。',
    }
];

// 模拟数据：产业趋势趋势图
const trendData = [
    { name: '1月', aiCount: 45, value: 120 },
    { name: '2月', aiCount: 52, value: 180 },
    { name: '3月', aiCount: 61, value: 250 },
    { name: '4月', aiCount: 75, value: 390 },
    { name: '5月', aiCount: 88, value: 480 },
    { name: '6月', aiCount: 105, value: 650 },
];

export default function ParkSpacePage() {
    const [activeTab, setActiveTab] = useState<ParkTab>('investment');

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
                    onClick={() => setActiveTab('investment')}
                    className={`px - 5 py - 2.5 rounded - lg transition - all duration - 300 flex items - center gap - 2 text - sm ${activeTab === 'investment'
                            ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                            : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        } `}
                >
                    <Target className="w-4 h-4" />
                    智能招商
                </button>
                <button
                    onClick={() => setActiveTab('policies')}
                    className={`px - 5 py - 2.5 rounded - lg transition - all duration - 300 flex items - center gap - 2 text - sm ${activeTab === 'policies'
                            ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                            : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        } `}
                >
                    <Send className="w-4 h-4" />
                    政策发布与推送
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
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
                                    <p className="text-2xl font-bold text-slate-800">124 <span className="text-xs text-green-500 font-medium">+15%</span></p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-adaptive-border p-6 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-adaptive-text-muted">OPC 创业者跟踪池</p>
                                    <p className="text-2xl font-bold text-slate-800">45 <span className="text-xs text-brand-tech font-medium">高优</span></p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-adaptive-border p-6 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-adaptive-text-muted">已转化入驻企业</p>
                                    <p className="text-2xl font-bold text-slate-800">8 <span className="text-xs text-green-500 font-medium">+2</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Targets Table */}
                        <div className="bg-white rounded-xl border border-adaptive-border shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-adaptive-border flex items-center justify-between">
                                <h3 className="font-bold text-lg text-slate-800 tracking-tight">AI 智能推荐目标</h3>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" placeholder="搜索企业名称或标签..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech w-64" />
                                    </div>
                                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">企业 / 团队名称</th>
                                        <th className="px-6 py-4">产业标签</th>
                                        <th className="px-6 py-4">招引价值</th>
                                        <th className="px-6 py-4">搬迁概率</th>
                                        <th className="px-6 py-4">AI 匹配建议</th>
                                        <th className="px-6 py-4 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {investmentTargets.map((target) => (
                                        <tr key={target.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 mb-0.5">{target.name}</div>
                                                <div className="text-xs text-slate-400">{target.stage}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold whitespace-nowrap">
                                                    {target.direction}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                <span className={target.value.includes('极高') ? 'text-red-500' : 'text-slate-700'}>{target.value}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h - full ${parseInt(target.probability) > 70 ? 'bg-green-500' : 'bg-blue-500'} `}
                                                            style={{ width: target.probability }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold">{target.probability}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs leading-relaxed max-w-[200px] text-slate-500 line-clamp-2" title={target.reason}>
                                                    {target.reason}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="px-3 py-1.5 bg-white border border-slate-200 text-brand-tech text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors mr-2">
                                                    查看策略
                                                </button>
                                                <button className="px-3 py-1.5 bg-brand-tech text-white text-xs font-bold rounded shadow-sm hover:bg-brand-deep transition-colors">
                                                    发送邀请
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        </div>
    );
}
