import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FileSignature,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    ChevronRight,
    Sparkles,
    Library
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

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
            {/* Greeting & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-white">晚上好，超级个体测试账户</h1>
                    <p className="text-slate-400 mt-1">您本周有 <span className="text-primary-400 font-medium">3个</span> 高匹配政策即将开放申报。</p>
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] flex items-center gap-2 border border-primary-400/50">
                    <Sparkles className="w-4 h-4" /> 开启智能诊断
                </button>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card-dark p-5 border-l-4 border-l-primary-500 hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-400 text-sm font-medium">预估可申报额度</p>
                        <TrendingUp className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white font-heading">15.5</h3>
                        <span className="text-slate-500 text-sm">万元</span>
                    </div>
                </div>

                <div className="glass-card-dark p-5 hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-400 text-sm font-medium">高度匹配政策</p>
                        <Target className="w-4 h-4 text-secondary-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white font-heading">8</h3>
                        <span className="text-slate-500 text-sm">项</span>
                    </div>
                </div>

                <div className="glass-card-dark p-5 hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-400 text-sm font-medium">材料预审中</p>
                        <FileSignature className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white font-heading">2</h3>
                        <span className="text-slate-500 text-sm">份</span>
                    </div>
                </div>

                <div className="glass-card-dark p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cta-500/10 rounded-bl-full pointer-events-none" />
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-400 text-sm font-medium">致命合规卡点</p>
                        <AlertCircle className="w-4 h-4 text-cta-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-cta-500 font-heading">1</h3>
                        <span className="text-slate-500 text-sm">待修复</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 truncate">需完成《算法备案》前置解锁</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 glass-card-dark p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" /> 年度补贴预测曲线
                        </h2>
                        <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-primary-500">
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
                <div className="glass-card-dark p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-secondary-400" /> 进行中任务
                        </h2>
                        <button className="text-xs text-primary-500 hover:text-primary-400 transition-colors">查看全部</button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        {/* Task 1 */}
                        <div className="group bg-slate-900/50 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-500/10 text-primary-400">材料工厂</span>
                                <span className="text-xs text-slate-500">2小时前更新</span>
                            </div>
                            <h4 className="text-sm text-slate-200 font-medium mb-1 group-hover:text-primary-400 transition-colors">
                                2026年市级人工智能场景应用补贴（医疗方向）
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-full bg-slate-800 rounded-full h-1.5 flex-1 overflow-hidden">
                                    <div className="bg-primary-500 h-1.5 rounded-full w-[80%]"></div>
                                </div>
                                <span>80%</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-cta-500" /> 需补充最近一期财务审计报告
                            </p>
                        </div>

                        {/* Task 2 */}
                        <div className="group bg-slate-900/50 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">AI 预审</span>
                                <span className="text-xs text-slate-500">昨天完成</span>
                            </div>
                            <h4 className="text-sm text-slate-200 font-medium mb-1 group-hover:text-primary-400 transition-colors">
                                科技型中小企业入库登记材料
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-emerald-400">预审通过：风险指数极低</span>
                            </div>
                        </div>

                        {/* Task 3 */}
                        <div className="group bg-slate-900/50 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">成长规划</span>
                                <span className="text-xs text-slate-500">待办</span>
                            </div>
                            <h4 className="text-sm text-slate-200 font-medium mb-1 group-hover:text-primary-400 transition-colors">
                                完成 OPC 算力标签补充
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2">
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
            {stats && (
                <div className="mt-8 pt-8 border-t border-slate-800">
                    <p className="text-slate-500 text-sm mb-4 font-medium flex items-center gap-2">
                        <Library className="w-4 h-4 text-slate-600" /> 平台实时动态
                    </p>
                    <div className="flex flex-wrap gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">收录有效政策</span>
                            <span className="text-white font-bold font-heading">{stats.total_policies.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">累计服务企业/人才</span>
                            <span className="text-white font-bold font-heading">{stats.matched_enterprises.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">已智能生成材料</span>
                            <span className="text-white font-bold font-heading">{stats.generated_materials.toLocaleString()} 份</span>
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
