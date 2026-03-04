import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Clock,
    ChevronRight,
    Library,
    Lock,
    ShieldAlert,
    CheckCircle2,
    Target,
    TrendingUp,
    AlertCircle,
    FileSignature
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import GrowthNavigator from './components/GrowthNavigator';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Fetch real data from our backend API
        axios.get('/api/v1/stats')
            .then(res => {
                // The API returns { status: "success", data: { total_policies: ... } }
                if (res.data && res.data.data) {
                    setStats(res.data.data);
                } else {
                    setStats(res.data);
                }
            })
            .catch(err => console.error("Failed to fetch dashboard stats", err));
    }, []);

    // Mock trend data for the area chart
    const trendData = [
        { month: 'Jan', subsidies: 0 },
        { month: 'Feb', subsidies: 12 },
        { month: 'Mar', subsidies: 45 },
        { month: 'Apr', subsidies: 30 },
        { month: 'May', subsidies: 80 },
        { month: 'Jun', subsidies: 120 }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Greeting & Profile Health */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-adaptive-panel/40 p-6 rounded-2xl border border-adaptive-border">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold font-heading text-adaptive-text">晚上好，超级个体测试账户</h1>
                    <p className="text-adaptive-text-muted mt-2">您本周有 <span className="text-primary-400 font-medium">3个</span> 高匹配政策即将开放申报。</p>
                </div>

                {/* Profile Completion Indicator */}
                <div className="flex items-center gap-4 bg-adaptive-panel p-4 rounded-xl border border-adaptive-border-light/50 shadow-inner">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset="105" className="text-cta-500" />
                        </svg>
                        <span className="absolute text-xs font-bold text-adaptive-text">30%</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-adaptive-text flex items-center gap-1">画像完整度偏低 <ShieldAlert className="w-4 h-4 text-cta-500" /></p>
                        <p className="text-xs text-adaptive-text-muted mt-1">存在高失真风险，匹配结果受限</p>
                    </div>
                    <button className="ml-2 bg-primary-500 hover:bg-primary-600 text-adaptive-text px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        去完善
                    </button>
                </div>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card-adaptive p-5 border-l-4 border-l-primary-500 hover:-translate-y-1 transition-transform relative group">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-adaptive-text-muted text-sm font-medium">预估可申报额度</p>
                        <TrendingUp className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <h3 className="text-3xl font-bold text-adaptive-text font-heading">15.5</h3>
                        <span className="text-adaptive-text-muted text-sm">万元</span>
                    </div>
                    {/* OPC Breakdown Tags */}
                    <div className="flex gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">含 算力券 5万</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-secondary-500/10 text-secondary-400 border border-secondary-500/20">含 模型券 2万</span>
                    </div>
                </div>

                <div className="glass-card-adaptive p-5 hover:-translate-y-1 transition-transform relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cta-500/10 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-adaptive-text-muted text-sm font-medium">高度匹配政策</p>
                        <Target className="w-4 h-4 text-cta-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-adaptive-text font-heading">8</h3>
                        <span className="text-adaptive-text-muted text-sm">项</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cta-400 bg-cta-500/10 rounded-md px-2 py-1 w-fit border border-cta-500/20">
                        <Lock className="w-3 h-3" /> 4 项因【算法备案】被阻断
                    </div>
                </div>

                <div className="glass-card-adaptive p-5 hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-adaptive-text-muted text-sm font-medium">材料预审中</p>
                        <FileSignature className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-adaptive-text font-heading">2</h3>
                        <span className="text-adaptive-text-muted text-sm">份</span>
                    </div>
                </div>

                <div className="glass-card-adaptive p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cta-500/10 rounded-bl-full pointer-events-none" />
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-adaptive-text-muted text-sm font-medium">致命合规卡点</p>
                        <AlertCircle className="w-4 h-4 text-cta-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-cta-500 font-heading">1</h3>
                        <span className="text-adaptive-text-muted text-sm">待修复</span>
                    </div>
                    <p className="text-xs text-adaptive-text-muted mt-2 truncate">需完成《算法备案》前置解锁</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 glass-card-adaptive p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-adaptive-text flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" /> 年度补贴预测曲线
                        </h2>
                        <select className="bg-adaptive-panel border border-adaptive-border-light text-adaptive-text text-sm rounded-md px-2 py-1 focus:outline-none focus:border-primary-500">
                            <option>此企业轨迹</option>
                            <option>行业平均对照</option>
                        </select>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSubsidies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }}
                                    itemStyle={{ color: '#0EA5E9' }}
                                />
                                <Area type="monotone" dataKey="subsidies" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorSubsidies)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ToDo / Tasks Flow */}
                <div className="glass-card-adaptive p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-adaptive-text flex items-center gap-2">
                            <Clock className="w-5 h-5 text-secondary-400" /> 进行中任务
                        </h2>
                        <button className="text-xs text-primary-500 hover:text-primary-400 transition-colors">查看全部</button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        {/* Task Priority 0: Profile */}
                        <div className="group bg-gradient-to-r from-warning to-transparent bg-opacity-10 dark:from-cta-500/10 dark:to-slate-900/50 rounded-lg p-3 border border-warning border-opacity-30 dark:border-cta-500/30 hover:border-opacity-50 transition-colors cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-warning opacity-20 dark:bg-cta-500/20 rounded-bl-full pointer-events-none" />
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-warning text-white flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 紧急待办</span>
                                <span className="text-xs text-warning font-medium">拦截中</span>
                            </div>
                            <h4 className="text-sm text-adaptive-text font-bold mb-1 group-hover:text-brand-tech transition-colors">
                                补充您的 OPC 技术资产与合规属性
                            </h4>
                            <p className="text-xs text-adaptive-text-muted mt-2">
                                有 4 项专精特新/算法政策因前置条件缺失被锁定，建议立即前往【画像中心】完善历史申报材料或手动补全。
                            </p>
                            <div className="mt-3 text-xs text-brand-deep dark:text-cta-400 flex items-center font-medium bg-warning bg-opacity-20 dark:bg-cta-500/20 w-fit px-2 py-1 rounded">
                                立即完善画像解锁额度 <ChevronRight className="w-3 h-3 ml-0.5" />
                            </div>
                        </div>

                        {/* Task 1 */}
                        <div className="group bg-adaptive-panel rounded-lg p-3 border border-adaptive-border hover:border-adaptive-border-light transition-colors cursor-pointer shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-500/10 text-primary-400">申报中心</span>
                                <span className="text-xs text-adaptive-text-muted">2小时前更新</span>
                            </div>
                            <h4 className="text-sm text-adaptive-text font-medium mb-1 group-hover:text-primary-400 transition-colors">
                                2026年市级人工智能场景应用补贴（医疗方向）
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-adaptive-text-muted">
                                <div className="w-full bg-adaptive-panel-hover rounded-full h-1.5 flex-1 overflow-hidden">
                                    <div className="bg-primary-500 h-1.5 rounded-full w-[80%]"></div>
                                </div>
                                <span>80%</span>
                            </div>
                            <p className="text-xs text-adaptive-text-muted mt-2 flex items-center gap-1">
                                <FileSignature className="w-3 h-3 text-adaptive-text-muted" /> AI 撰写中，待用户补充财务报表
                            </p>
                        </div>

                        {/* Task 2 */}
                        <div className="group bg-adaptive-panel rounded-lg p-3 border border-adaptive-border hover:border-adaptive-border-light transition-colors cursor-pointer shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">AI 预审</span>
                                <span className="text-xs text-adaptive-text-muted">昨天完成</span>
                            </div>
                            <h4 className="text-sm text-adaptive-text font-medium mb-1 group-hover:text-primary-400 transition-colors">
                                科技型中小企业入库登记材料
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-emerald-400">预审通过：风险指数极低</span>
                            </div>
                        </div>

                        {/* Task 3 */}
                        <div className="group bg-adaptive-panel rounded-lg p-3 border border-adaptive-border hover:border-adaptive-border-light transition-colors cursor-pointer shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-deep text-white">成长规划</span>
                                <span className="text-xs text-adaptive-text-muted">待办</span>
                            </div>
                            <h4 className="text-sm text-adaptive-text font-medium mb-1 group-hover:text-primary-400 transition-colors">
                                完成 OPC 算力标签补充
                            </h4>
                            <p className="text-xs text-adaptive-text-muted line-clamp-2">
                                您当前画像判定可能符合“超级个体创业券”申领条件，请前往画像中心更新算力日均开销数据以解锁匹配...
                            </p>
                            <div className="mt-2 text-xs text-primary-500 flex items-center font-medium">
                                去完善 <ChevronRight className="w-3 h-3 ml-0.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Stats Row (Powered by actual API) */}
            <GrowthNavigator />

            {stats && (
                <div className="mt-8 pt-8 border-t border-adaptive-border">
                    <p className="text-adaptive-text-muted text-sm mb-4 font-medium flex items-center gap-2">
                        <Library className="w-4 h-4 text-slate-600" /> 平台实时动态
                    </p>
                    <div className="flex flex-wrap gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-adaptive-text-muted">收录有效政策</span>
                            <span className="text-adaptive-text font-bold font-heading">{stats.total_policies.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-adaptive-text-muted">累计服务企业/人才</span>
                            <span className="text-adaptive-text font-bold font-heading">{stats.matched_enterprises.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-adaptive-text-muted">已智能生成材料</span>
                            <span className="text-adaptive-text font-bold font-heading">{stats.generated_materials.toLocaleString()} 份</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>推荐申报成功率 {stats.success_rate}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
