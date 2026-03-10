import { useState } from 'react';
import {
    UserCircle2,
    Save,
    TrendingUp,
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

// Import our new role-specific form components
import EnterpriseProfileForm from './components/EnterpriseProfileForm';
import TalentProfileForm from './components/TalentProfileForm';
import ParkProfileForm from './components/ParkProfileForm';

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [previewRole, setPreviewRole] = useState<'talent' | 'enterprise' | 'park'>('enterprise');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    // Dynamically adjust radar data based on previewRole
    const radarData = previewRole === 'park' ? [
        { subject: '园区规模', A: 90, fullMark: 100 },
        { subject: '入驻密度', A: 85, fullMark: 100 },
        { subject: 'OPC服务', A: 65, fullMark: 100 },
        { subject: '政策优势', A: 95, fullMark: 100 },
        { subject: '产业聚集', A: 80, fullMark: 100 },
        { subject: '算力基建', A: 75, fullMark: 100 },
    ] : previewRole === 'talent' ? [
        { subject: '学历背景', A: 95, fullMark: 100 },
        { subject: '项目经验', A: 85, fullMark: 100 },
        { subject: '科研产出', A: 90, fullMark: 100 },
        { subject: '资质荣誉', A: 75, fullMark: 100 },
        { subject: 'OPC潜力', A: 88, fullMark: 100 },
        { subject: '技术稀缺度', A: 80, fullMark: 100 },
    ] : [
        { subject: '企业规模', A: 85, fullMark: 100 },
        { subject: '创新能力', A: 90, fullMark: 100 },
        { subject: '知识产权', A: 65, fullMark: 100 },
        { subject: '合规程度', A: 95, fullMark: 100 },
        { subject: '人才结构', A: 70, fullMark: 100 },
        { subject: '财务健康', A: 80, fullMark: 100 },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in relative pb-10">

            {/* Header with Role Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-adaptive-border">
                <div>
                    <h1 className="text-2xl font-bold text-brand-deep flex items-center gap-2">
                        <UserCircle2 className="w-6 h-6 text-brand-tech" />
                        画像中心 ({previewRole === 'talent' ? '人才引擎' : previewRole === 'enterprise' ? '企业引擎' : '园区引擎'})
                    </h1>
                    <p className="text-adaptive-text-muted text-sm mt-1 mb-3">完善专属画像数据，AI引擎将为您解锁更高成功率的匹配方案。</p>

                    {/* Role Preview Toggle */}
                    <div className="inline-flex bg-adaptive-border rounded-lg p-1.5 shadow-sm">
                        <button
                            onClick={() => setPreviewRole('talent')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${previewRole === 'talent' ? 'bg-white text-brand-tech shadow-sm' : 'text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            👨‍💻 人才视角
                        </button>
                        <button
                            onClick={() => setPreviewRole('enterprise')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${previewRole === 'enterprise' ? 'bg-white text-brand-tech shadow-sm' : 'text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            🏢 企业视角
                        </button>
                        <button
                            onClick={() => setPreviewRole('park')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${previewRole === 'park' ? 'bg-white text-brand-tech shadow-sm' : 'text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            🏭 园区视角
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-adaptive-text-muted mb-1">画像完整度</span>
                        <div className="w-32 h-2.5 bg-adaptive-border rounded-full overflow-hidden">
                            <div className={`h-full bg-brand-tech rounded-full shadow-[0_0_10px_rgba(49,130,206,0.6)] ${previewRole === 'talent' ? 'w-[65%]' : previewRole === 'park' ? 'w-[90%]' : 'w-[75%]'}`}></div>
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
                <div className="lg:col-span-1 bg-adaptive-panel rounded-xl border border-adaptive-border shadow-sm p-6 flex flex-col items-center transition-all duration-300">
                    <h3 className="w-full font-bold text-brand-deep flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-brand-tech" />
                        {previewRole === 'talent' ? '人才竞争力雷达' : previewRole === 'park' ? '园区吸引力雷达' : '企业综合战斗力'}
                    </h3>
                    <p className="w-full text-xs text-adaptive-text-muted mb-4 border-b border-adaptive-border-light pb-2">基于全网相似大数据排名计算得出。</p>

                    <div className="w-full h-[240px] relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="指标"
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
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-deep to-[#2c5282] rounded-xl shadow-md p-6 text-white relative overflow-hidden flex flex-col justify-between transition-all duration-300">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-tech/30 rounded-full blur-3xl"></div>

                    {previewRole === 'enterprise' && (
                        <>
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-warning" />
                                    画像待补全提示
                                </h3>
                                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                                    系统检测到您当前有 <strong className="text-warning text-base mx-1">2项</strong> 关键财务指标尚未填写，这直接导致【省专精特新】等 4 项政策的智能匹配精准度下降。
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
                        </>
                    )}

                    {previewRole === 'talent' && (
                        <>
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-brand-orange" />
                                    OPC 创业者专属推荐
                                </h3>
                                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                                    您已标记为 <strong className="text-white bg-white/20 px-1 rounded mx-1">OPC 超级个体</strong>。请补充算力需求，系统将为您精准匹配【算力券补贴】及【免租工位】。
                                </p>
                            </div>

                            <div className="space-y-3 relative z-10 w-full md:w-3/4">
                                <div className="bg-white/10 border border-brand-orange/40 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                                    <span className="text-sm font-medium">完善所需模型参数及算力级别</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-brand-orange bg-white px-2 py-0.5 rounded-full font-bold">解锁算力补贴</span>
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-brand-tech transition-colors">
                                            <span className="text-xs">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {previewRole === 'park' && (
                        <>
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                    园区画像健康度良好
                                </h3>
                                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                                    当前园区信息已基本完善。建议进一步细化<strong className="text-white bg-white/20 px-1 rounded mx-1">补链/强链需求</strong>，以提升智能招商推荐的转化率。
                                </p>
                            </div>

                            <div className="space-y-3 relative z-10 w-full md:w-3/4">
                                <div className="bg-white/10 border border-success/40 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                                    <span className="text-sm font-medium">明确目标招商企业的年营收集群</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-success bg-white px-2 py-0.5 rounded-full font-bold">提升招商精度</span>
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-brand-tech transition-colors">
                                            <span className="text-xs">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Matrix Forms Container - DYNAMIC RENDERING */}
            <div className={`transition-opacity duration-300 ${previewRole === 'talent' ? 'opacity-100 block' : 'hidden'}`}>
                <TalentProfileForm />
            </div>

            <div className={`transition-opacity duration-300 ${previewRole === 'enterprise' ? 'opacity-100 block' : 'hidden'}`}>
                <EnterpriseProfileForm />
            </div>

            <div className={`transition-opacity duration-300 ${previewRole === 'park' ? 'opacity-100 block' : 'hidden'}`}>
                <ParkProfileForm />
            </div>

        </div>
    );
}
