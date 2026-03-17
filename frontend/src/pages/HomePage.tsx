import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    ShieldCheck, BrainCircuit, Rocket, CheckCircle2,
    ArrowRight, Users, Briefcase, Zap
} from 'lucide-react';
import axios from 'axios';
export default function HomePage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        axios.get('/api/v1/stats')
            .then(res => {
                if (res.data && res.data.data) {
                    setStats(res.data.data);
                } else {
                    setStats(res.data);
                }
            })
            .catch(err => console.error("Failed to fetch mock stats", err));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-secondary-400/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Navigation */}
            <nav className="fixed w-full top-0 left-0 z-50 p-4 transition-all">
                <div className="max-w-7xl mx-auto glass-card px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="政策罗盘 PolicyCompass" className="h-9" />
                    </div>
                    <div className="hidden md:flex gap-8 text-text-muted font-medium">
                        <a href="#features" className="hover:text-primary-500 transition-colors">功能亮点</a>
                        <a href="#data" className="hover:text-primary-500 transition-colors">实时态势</a>
                        <a href="#pricing" className="hover:text-primary-500 transition-colors">版本定价</a>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/login')} className="px-5 py-2 text-text-muted hover:text-primary-600 transition-colors font-medium">登录</button>
                        <button className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-primary-500/30 flex items-center gap-2">
                            免费评估 <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-primary-600 font-medium text-sm">
                    <SparklesIcon className="w-4 h-4" />
                    <span>全新 AI 政策引擎上线，测算准确率达 98.5%</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold font-heading text-text-main tracking-tight mb-6 leading-tight">
                    企业政策申报的 <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">
                        『智能芯片』
                    </span>
                </h1>
                <p className="text-xl text-text-muted max-w-3xl mb-10 leading-relaxed">
                    不是普通的搜集引擎，是懂代码懂财务的 AI 产业幕僚。基于画像自动完成“政策匹配、卡点诊断、材料生成”的一站式全推演服务，告别盲目申报。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mb-12">
                    <button className="flex-1 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium text-lg transition-all shadow-xl hover:shadow-primary-500/40 relative overflow-hidden group">
                        <span className="relative z-10">立即开启智能测算</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300" />
                    </button>
                    <button className="flex-1 py-4 glass-card text-text-main font-medium text-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                        <Rocket className="w-5 h-5 text-cta-500" />
                        园区入驻通道
                    </button>
                </div>

                {/* Dashboard Preview — Live Mini Dashboard */}
                <div className="w-full max-w-5xl glass-card border border-white/40 p-2 shadow-2xl relative mt-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl pointer-events-none z-10" />
                    {/* Scale down the whole dashboard to fit the preview box */}
                    <div className="bg-slate-50 rounded-xl border border-slate-100 flex overflow-hidden" style={{ height: 400 }}>
                        {/* Sidebar */}
                        <div className="w-52 bg-white border-r border-slate-100 p-4 hidden md:flex flex-col gap-1 shrink-0">
                            <div className="flex items-center justify-center mb-5">
                                <img src="/logo-stacked.png" alt="政策罗盘" className="h-12 w-auto" />
                            </div>
                            {[
                                { label: '政策匹配', icon: '🎯', active: true },
                                { label: '申报进度', icon: '📋', active: false },
                                { label: '材料中心', icon: '📁', active: false },
                                { label: '成长路径', icon: '🚀', active: false },
                                { label: '消息中心', icon: '🔔', active: false },
                            ].map(item => (
                                <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-default transition-colors ${item.active ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
                                </div>
                            ))}
                        </div>

                        {/* Main content */}
                        <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
                            {/* Header row */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] text-slate-400">欢迎回来</p>
                                    <h3 className="text-sm font-bold text-slate-800">某科技公司</h3>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded-full font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    AI 引擎运行中
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: '可申报政策', value: '23', unit: '项', color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100', trend: '+5 本月新增' },
                                    { label: '最高可申报金额', value: '156', unit: '万', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', trend: 'AI 精算结果' },
                                    { label: '进行中申报', value: '4', unit: '项', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: '2项待补材料' },
                                ].map(card => (
                                    <div key={card.label} className={`${card.bg} border ${card.border} rounded-lg p-3`}>
                                        <p className="text-[10px] text-slate-500 mb-1">{card.label}</p>
                                        <p className={`text-xl font-bold font-heading ${card.color}`}>
                                            {card.value}<span className="text-xs font-normal ml-0.5">{card.unit}</span>
                                        </p>
                                        <p className="text-[9px] text-slate-400 mt-1">{card.trend}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Chart */}
                            <div className="flex-1 bg-white rounded-lg border border-slate-100 p-3 min-h-0">
                                <p className="text-[10px] font-semibold text-slate-600 mb-2">近6月政策补贴匹配趋势（万元）</p>
                                <div className="h-[120px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { month: '10月', value: 42 },
                                            { month: '11月', value: 65 },
                                            { month: '12月', value: 58 },
                                            { month: '1月', value: 88 },
                                            { month: '2月', value: 72 },
                                            { month: '3月', value: 120 },
                                        ]} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Trust Badges */}
            <section className="py-12 border-y border-white/30 bg-white/30 backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-text-muted mb-6">已被超过 <span className="text-primary-600 font-bold">1,000+</span> 科技企业和顶级园区信赖选择</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock logos */}
                        <div className="flex items-center gap-2 font-bold text-xl"><Zap /> <span>TechVision AI</span></div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Briefcase /> <span>苏州智谷园区</span></div>
                        <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck /> <span>未来制造实验室</span></div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Users /> <span>OPC 创客联盟</span></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-text-main">打破黑盒，三大核心重塑申报链路</h2>
                    <p className="text-text-muted max-w-2xl mx-auto font-medium">不只告诉你“能报什么”，更告诉你“为什么能报、差什么、材料怎么写”</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="glass-card hover:-translate-y-2 transition-transform duration-300 p-8 flex flex-col h-full cursor-pointer">
                        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                            <BrainCircuit className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-text-main">精准匹配与防坑排雷</h3>
                        <p className="text-text-muted leading-relaxed flex-1">基于大模型深度解析红头文件，结合企业真实画像，自动穿透隐藏的前置条件（如算法备案等逻辑锁），阻断“无效瞎报”。</p>
                        <div className="mt-6 pt-6 border-t border-slate-200/50 text-sm font-medium text-primary-600 flex items-center gap-2 hover:gap-3 transition-all">
                            查看匹配逻辑 <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="glass-card hover:-translate-y-2 transition-transform duration-300 p-8 flex flex-col h-full cursor-pointer border-t-4 border-t-primary-500">
                        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-primary-500/30">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-text-main">成长路径导航仪</h3>
                        <p className="text-text-muted leading-relaxed flex-1">不只看当下，平台为你从科小、高新到专精特新智能推演“进阶之路”，明确各项指标缺口及提升成本，抢占补贴窗口。</p>
                        <div className="mt-6 pt-6 border-t border-slate-200/50 text-sm font-medium text-primary-600 flex items-center gap-2 hover:gap-3 transition-all">
                            获取导航示例 <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="glass-card hover:-translate-y-2 transition-transform duration-300 p-8 flex flex-col h-full cursor-pointer">
                        <div className="w-14 h-14 bg-cta-500/10 rounded-2xl flex items-center justify-center mb-6 text-cta-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-text-main">AI 自动化材料工厂</h3>
                        <p className="text-text-muted leading-relaxed flex-1">一次上传证照终身复用。根据申报指南要求，RAG 技术自动抽取企业历史素材，秒级组装、撰写贴合政策导向的申报文本，支持在线预审。</p>
                        <div className="mt-6 pt-6 border-t border-slate-200/50 text-sm font-medium text-primary-600 flex items-center gap-2 hover:gap-3 transition-all">
                            体验自动撰写 <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Real-time Data Visualization */}
            <section id="data" className="py-24 relative z-10 bg-slate-900 text-white clip-diagonal">
                {/* Dark style needs specific bounds to override light layout */}
                <div className="max-w-7xl mx-auto px-4 relative z-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-dark mb-6 text-secondary-400 font-medium text-sm border-secondary-400/30">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>平台实时数据大脑计算中</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight">产业洞察，<br />让数据开口说话</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
                                我们的全链路监控与大数据网络，正在为数以万计的科技企业和 OPC 人才分配最高效的补贴渠道。图表展现的是近三十天核心转化态势。
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="glass-card-dark p-6">
                                    <div className="text-4xl font-bold text-white mb-2 font-heading">{stats?.matched_enterprises ? stats.matched_enterprises.toLocaleString() : '---'} <span className="text-base text-slate-400 font-normal">家</span></div>
                                    <div className="text-slate-400 font-medium">已获得最优匹配企业</div>
                                </div>
                                <div className="glass-card-dark p-6">
                                    <div className="text-4xl font-bold text-secondary-400 mb-2 font-heading">{stats?.ai_processing_time_saved_hours ? stats.ai_processing_time_saved_hours.toLocaleString() : '---'} <span className="text-base text-slate-400 font-normal">小时</span></div>
                                    <div className="text-slate-400 font-medium">AI累计节省材料审批时间</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card-dark p-6 md:p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                                <span>热门支持类别分析</span>
                                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">实时更新</span>
                            </h3>
                            <div className="h-80 w-full">
                                {stats?.top_categories ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.top_categories} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                            <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                            <Tooltip
                                                cursor={{ fill: '#1E293B' }}
                                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500">
                                        <div className="animate-pulse flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-500 rounded-full" />
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animation-delay-200" />
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animation-delay-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Table */}
            <section id="pricing" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-text-main">面向未来的增值服务模式</h2>
                    <p className="text-text-muted max-w-2xl mx-auto font-medium">摒弃传统高额代理首付，以技术能力创造长期价值</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Base Plan */}
                    <div className="glass-card p-8 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-text-main mb-2">基础探索版</h3>
                            <p className="text-sm text-text-muted">适合小型初创团队及个体开发者</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold font-heading">¥0</span>
                            <span className="text-text-muted"> / 面向 OPC 免费</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-text-muted text-sm items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" /> <span>建立基础人才/企业画像</span></li>
                            <li className="flex gap-3 text-text-muted text-sm items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" /> <span>5 次全库政策匹配测算/月</span></li>
                            <li className="flex gap-3 text-text-muted text-sm items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" /> <span>基础卡点报告</span></li>
                        </ul>
                        <button onClick={() => navigate('/login')} className="w-full py-3 rounded-lg border-2 border-primary-500 text-primary-600 font-medium hover:bg-primary-50 transition-colors">登录使用</button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-primary-500 text-white p-8 flex flex-col rounded-2xl shadow-2xl relative shadow-primary-500/30 cursor-pointer border border-primary-400">
                        <div className="absolute top-0 right-0 bg-cta-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">极具性价比</div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-2">专业导航版</h3>
                            <p className="text-primary-100 text-sm">提供给有规律申报诉求的成长型企业</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold font-heading">待定</span>
                            <span className="text-primary-100"> / 年起</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-primary-50 text-sm items-start"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <span>无限次深度匹配与依赖图谱</span></li>
                            <li className="flex gap-3 text-primary-50 text-sm items-start"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <span>AI 材料工厂 (含 OCR/自动抓取)</span></li>
                            <li className="flex gap-3 text-primary-50 text-sm items-start"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <span>产业协同引擎引荐 (联合申报)</span></li>
                            <li className="flex gap-3 text-primary-50 text-sm items-start"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /> <span>专属申报进度看板</span></li>
                        </ul>
                        <button className="w-full py-3 rounded-lg bg-white text-primary-600 font-bold hover:bg-primary-50 transition-colors shadow-lg">免费试用 14 天</button>
                    </div>

                    {/* Park Plan */}
                    <div className="glass-card p-8 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-text-main mb-2">园区招商版</h3>
                            <p className="text-sm text-text-muted">赋能园区运营方，打造一站式闭环</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold font-heading">定向报价</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-text-muted text-sm items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" /> <span>独立园区政策直通发布后台</span></li>
                            <li className="flex gap-3 text-text-muted text-sm items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" /> <span>AI 智能招商触达引擎</span></li>
                            <li className="flex gap-3 text-text-muted text-sm items-start"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" /> <span>区域产业洞察专属数据大屏</span></li>
                        </ul>
                        <button className="w-full py-3 rounded-lg border md:border-slate-200 border-primary-500 text-text-main font-medium hover:bg-slate-50 transition-colors">联系商务获取方案</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/40 bg-white/40 backdrop-blur-md py-12 px-4 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="政策罗盘 PolicyCompass" className="h-7" />
                    </div>
                    <div className="text-sm text-text-muted">
                        &copy; 2026 AI Policy Engine. 赋能科技转型与个体创作者.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2l1.6 4.3A5.4 5.4 0 0015.3 10L20 11.5l-4.7 1.5a5.4 5.4 0 00-3.7 3.7L10 21l-1.6-4.3a5.4 5.4 0 00-3.7-3.7L0 11.5l4.7-1.5a5.4 5.4 0 003.7-3.7z" />
        </svg>
    );
}
