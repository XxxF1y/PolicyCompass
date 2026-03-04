import { useState } from 'react';
import {
    UserCircle2,
    Save,
    Building2,
    TrendingUp,
    Award,
    ShieldCheck,
    Coins,
    Users,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

const radarData = [
    { subject: '企业规模', A: 85, fullMark: 100 },
    { subject: '创新能力', A: 90, fullMark: 100 },
    { subject: '知识产权', A: 65, fullMark: 100 },
    { subject: '合规程度', A: 95, fullMark: 100 },
    { subject: '人才结构', A: 70, fullMark: 100 },
    { subject: '财务健康', A: 80, fullMark: 100 },
];

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in relative pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-adaptive-border">
                <div>
                    <h1 className="text-2xl font-bold text-brand-deep flex items-center gap-2">
                        <UserCircle2 className="w-6 h-6 text-brand-tech" />
                        超级个体画像中心
                    </h1>
                    <p className="text-adaptive-text-muted text-sm mt-1">完善画像数据，AI引擎将为您解锁更高成功率的政策匹配方案。</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-adaptive-text-muted mb-1">画像完整度</span>
                        <div className="w-32 h-2.5 bg-adaptive-border rounded-full overflow-hidden">
                            <div className="h-full bg-brand-tech w-[75%] rounded-full shadow-[0_0_10px_rgba(49,130,206,0.6)]"></div>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm ${showSuccess ? 'bg-success text-white' : 'bg-brand-tech hover:bg-brand-deep text-white hover:shadow-md'
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : showSuccess ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? '正在计算变动...' : showSuccess ? '已同步至引擎' : '保存并评估'}
                    </button>
                </div>
            </div>

            {/* Top Dashboard: Radar & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Radar Chart Panel */}
                <div className="lg:col-span-1 bg-adaptive-panel rounded-xl border border-adaptive-border shadow-sm p-6 flex flex-col items-center">
                    <h3 className="w-full font-bold text-brand-deep flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-brand-tech" />
                        综合战斗力模型
                    </h3>
                    <p className="w-full text-xs text-adaptive-text-muted mb-4 border-b border-adaptive-border-light pb-2">基于全网相似企业大数据的相对排名模型计算得出。</p>

                    <div className="w-full h-[240px] relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="战斗力"
                                    dataKey="A"
                                    stroke="#3182ce"
                                    strokeWidth={2}
                                    fill="#3182ce"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-brand-tech/10 blur-xl"></div>
                        </div>
                    </div>
                </div>

                {/* Important Alerts & Missing Data Tasks */}
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-deep to-[#2c5282] rounded-xl shadow-md p-6 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-tech/30 rounded-full blur-3xl"></div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-warning" />
                            画像待补全提示
                        </h3>
                        <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                            系统检测到您当前有 <strong className="text-warning text-base mx-1">2项</strong> 关键财务指标尚未填写，这直接导致【省专精特新】与【科技型中小企业】等 4 项政策的智能匹配精准度下降。
                        </p>
                    </div>

                    <div className="space-y-3 relative z-10 w-full md:w-3/4">
                        <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                            <span className="text-sm font-medium">更新 2025 年度累计营收预估</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/70">缺失关键指标</span>
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-brand-tech transition-colors">
                                    <span className="text-xs">+</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                            <span className="text-sm font-medium">补充近期新增的大模型备案号</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-brand-tech bg-white px-2 py-0.5 rounded-full font-bold">加分项</span>
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-brand-tech transition-colors">
                                    <span className="text-xs">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Forms Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">

                {/* Column 1: Basic Info */}
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Building2 className="w-4 h-4 text-brand-tech" /> 主体基础架构
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">主体形式</label>
                            <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>有限责任公司 (LLC)</option>
                                <option>个体工商户</option>
                                <option>股份有限公司</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">注册资本 (万元)</label>
                            <input type="number" defaultValue={500} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">注册时间</label>
                            <input type="date" defaultValue="2024-03-15" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">所属园区</label>
                            <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>苏州工业园区 AI 创新中心</option>
                                <option>张江高科</option>
                                <option>中关村软件园</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Column 2: Financial & Operational */}
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Coins className="w-4 h-4 text-brand-tech" /> 财务与运营表现
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-warning mb-1.5 pl-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> 最新年度营收 (万元) *
                            </label>
                            <input type="number" placeholder="必填，用于专精特新匹配" className="w-full bg-adaptive-bg border border-warning/50 rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-all placeholder:text-adaptive-text-muted" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">研发费用占比 (%)</label>
                            <input type="number" defaultValue={35} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">日均算力开销 (元/天)</label>
                            <input type="number" defaultValue={1200} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                                <Users className="w-3 h-3 text-brand-tech" /> 当前缴纳社保人数
                            </label>
                            <input type="number" defaultValue={8} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                    </div>
                </div>

                {/* Column 3: Qualifications & IP */}
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <ShieldCheck className="w-4 h-4 text-brand-tech" /> 无形资产与资质储备
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                                <Award className="w-3 h-3 text-success" /> 大模型/算法备案数
                            </label>
                            <div className="flex bg-adaptive-bg border border-adaptive-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-brand-tech focus-within:border-brand-tech">
                                <div className="px-3 py-2 bg-adaptive-panel-hover border-r border-adaptive-border text-xs text-adaptive-text-muted flex items-center">
                                    网信办
                                </div>
                                <input type="number" defaultValue={2} className="w-full bg-transparent px-3 py-2 text-sm text-adaptive-text focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">发明专利 (授权/实质审查)</label>
                            <input type="text" defaultValue="1 / 3" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">软件著作权数量</label>
                            <input type="number" defaultValue={12} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">已获取官方认证标签</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">OPC 入库企业</span>
                                <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">科技型中小企业 (25版)</span>
                                <button className="text-[11px] bg-adaptive-panel border border-adaptive-border border-dashed text-adaptive-text-muted px-2 py-1 rounded-md hover:bg-adaptive-panel-hover transition-colors">
                                    + 添加历史资质
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
