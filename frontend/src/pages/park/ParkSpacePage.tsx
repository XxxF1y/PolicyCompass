import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    Bell,
    Briefcase,
    Building2,
    GripVertical,
    CheckCircle2,
    FileText,
    Filter,
    MapPin,
    PieChart,
    Search,
    Send,
    Target,
    TrendingUp,
    Users,
    Zap,
    UserCircle2,
    RotateCcw,
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ViewDetailsModal from './components/ViewDetailsModal';
import GenerateProposalModal from './components/GenerateProposalModal';
import { ParkService } from '../../services/parkService';
import { ProfileService } from '../../services/profileService';
import type { ParkInsightsData, ParkInvestmentResponse, ParkInvestmentTarget, ParkPolicyPushItem } from '../../types/park';
import type { ProfileData } from '../../types/profile';

type ParkTab = 'investment' | 'policies' | 'insights';
type InsightWidgetId = 'profile' | 'overview' | 'heatmap' | 'geo_chain' | 'trend';

const INSIGHT_WIDGETS: InsightWidgetId[] = ['profile', 'overview', 'heatmap', 'geo_chain', 'trend'];

const getUniqueValues = (items: ParkInvestmentTarget[], key: keyof ParkInvestmentTarget): string[] => {
    const values = new Set<string>();
    items.forEach((item) => {
        const val = item[key];
        if (typeof val === 'string' && val.trim() && val !== '未知') values.add(val.trim());
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b, 'zh-CN'));
};

export default function ParkSpacePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const pathMap: Record<string, ParkTab> = {
        '/park/investment': 'investment',
        '/park/policies': 'policies',
        '/park/insights': 'insights',
        '/park/dashboard': 'insights',
    };
    const activeTab = pathMap[location.pathname] || 'insights';

    const [insights, setInsights] = useState<ParkInsightsData | null>(null);
    const [investment, setInvestment] = useState<ParkInvestmentResponse | null>(null);
    const [policyPushes, setPolicyPushes] = useState<ParkPolicyPushItem[]>([]);
    const [isInsightsLoading, setIsInsightsLoading] = useState(false);
    const [isInvestmentLoading, setIsInvestmentLoading] = useState(false);
    const [isPoliciesLoading, setIsPoliciesLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [parkProfileData, setParkProfileData] = useState<ProfileData | null>(null);
    const [isParkProfileLoading, setIsParkProfileLoading] = useState(false);
    const [isParkProfileCollapsed, setIsParkProfileCollapsed] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [opcStage, setOpcStage] = useState('');
    const [aiDirection, setAiDirection] = useState('');
    const [productType, setProductType] = useState('');
    const [onlyOutOfPark, setOnlyOutOfPark] = useState(true);

    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [isProposalOpen, setIsProposalOpen] = useState(false);
    const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const [isSubmittingPush, setIsSubmittingPush] = useState(false);
    const insightStorageKey = 'park_insights_layout_v1';
    const [insightOrder, setInsightOrder] = useState<InsightWidgetId[]>(() => {
        try {
            const cached = localStorage.getItem('park_insights_layout_v1');
            if (!cached) return INSIGHT_WIDGETS;
            const parsed = JSON.parse(cached) as string[];
            if (Array.isArray(parsed) && parsed.length === INSIGHT_WIDGETS.length && parsed.every((id) => INSIGHT_WIDGETS.includes(id as InsightWidgetId))) {
                return parsed as InsightWidgetId[];
            }
        } catch {
            // ignore malformed cache
        }
        return INSIGHT_WIDGETS;
    });
    const [draggingInsight, setDraggingInsight] = useState<InsightWidgetId | null>(null);
    const [pushForm, setPushForm] = useState({
        policyTitle: '',
        policyLevel: '园区',
        issuingDepartment: '',
        deadline: '',
        applicableTargets: '',
        channels: '站内消息,短信',
        targetTags: '',
        keywords: '',
        pushScope: '园内企业+园外潜在企业',
    });

    const fetchInsights = async () => {
        setIsInsightsLoading(true);
        setLoadError('');
        try {
            const data = await ParkService.getInsights();
            setInsights(data);
        } catch (err) {
            console.error('Failed to load park insights', err);
            setLoadError('产业洞察数据加载失败，请稍后重试');
        } finally {
            setIsInsightsLoading(false);
        }
    };

    const fetchInvestmentTargets = async () => {
        setIsInvestmentLoading(true);
        setLoadError('');
        try {
            const data = await ParkService.getInvestmentTargets({
                keyword: keyword.trim() || undefined,
                opcStage: opcStage || undefined,
                aiDirection: aiDirection || undefined,
                productType: productType || undefined,
                inPark: onlyOutOfPark ? false : undefined,
            });
            setInvestment(data);
        } catch (err) {
            console.error('Failed to load investment targets', err);
            setLoadError('智能招商数据加载失败，请稍后重试');
        } finally {
            setIsInvestmentLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem(insightStorageKey, JSON.stringify(insightOrder));
    }, [insightOrder]);

    useEffect(() => {
        if (activeTab === 'insights' && !insights) {
            void fetchInsights();
        }
    }, [activeTab, insights]);

    useEffect(() => {
        if (activeTab !== 'insights') return;
        const loadParkProfile = async () => {
            setIsParkProfileLoading(true);
            try {
                const profile = await ProfileService.getProfile('park');
                setParkProfileData(profile);
            } catch (err) {
                console.error('Failed to load park profile card', err);
            } finally {
                setIsParkProfileLoading(false);
            }
        };
        void loadParkProfile();
    }, [activeTab]);

    useEffect(() => {
        if (activeTab !== 'investment') return;
        void fetchInvestmentTargets();
    }, [activeTab, keyword, opcStage, aiDirection, productType, onlyOutOfPark]);

    useEffect(() => {
        if (activeTab !== 'policies') return;
        const fetchPolicyPushes = async () => {
            setIsPoliciesLoading(true);
            setLoadError('');
            try {
                const data = await ParkService.getPolicyPushes();
                setPolicyPushes(data);
            } catch (err) {
                console.error('Failed to load policy pushes', err);
                setLoadError('政策推送数据加载失败，请稍后重试');
            } finally {
                setIsPoliciesLoading(false);
            }
        };
        void fetchPolicyPushes();
    }, [activeTab]);

    const opcStageOptions = useMemo(
        () => getUniqueValues(investment?.items || [], 'opcStage'),
        [investment?.items],
    );
    const aiDirectionOptions = useMemo(
        () => getUniqueValues(investment?.items || [], 'aiDirection'),
        [investment?.items],
    );
    const productTypeOptions = useMemo(
        () => getUniqueValues(investment?.items || [], 'productType'),
        [investment?.items],
    );

    const trendData = useMemo(
        () => (insights?.time_trends || []).map((it) => ({ month: it.month.slice(5), total: it.total })),
        [insights?.time_trends],
    );

    const geoChartData = useMemo(() => {
        const office = (insights?.geo_distribution || []).filter((x) => x.kind === 'office');
        return office.sort((a, b) => b.count - a.count).slice(0, 8);
    }, [insights?.geo_distribution]);
    const heatmapData = useMemo(() => {
        const items = insights?.industry_heatmap || [];
        const total = items.reduce((sum, x) => sum + x.count, 0);
        const maxCount = Math.max(1, ...items.map((x) => x.count));
        return items.map((item) => {
            const ratio = item.count / maxCount;
            const percent = total ? (item.count / total) * 100 : 0;
            let level: '低' | '中' | '高' = '低';
            if (ratio >= 0.67) level = '高';
            else if (ratio >= 0.34) level = '中';
            const bgColor = `rgba(37,99,235,${0.1 + ratio * 0.5})`;
            const borderColor = `rgba(30,64,175,${0.15 + ratio * 0.45})`;
            return { ...item, ratio, percent, level, bgColor, borderColor };
        });
    }, [insights?.industry_heatmap]);

    const handleViewDetails = (targetId: string) => {
        setSelectedTargetId(targetId);
        setIsViewDetailsOpen(true);
    };

    const handleGenerateProposal = (targetId: string) => {
        setSelectedTargetId(targetId);
        setIsViewDetailsOpen(false);
        setIsProposalOpen(true);
    };

    const splitCsv = (text: string): string[] => {
        return text
            .split(/[,，、]/)
            .map((x) => x.trim())
            .filter(Boolean);
    };

    const handleCreatePolicyPush = async () => {
        if (!pushForm.policyTitle.trim()) {
            setLoadError('请先填写政策标题');
            return;
        }
        setIsSubmittingPush(true);
        setLoadError('');
        try {
            await ParkService.createPolicyPush({
                policy_title: pushForm.policyTitle.trim(),
                policy_level: pushForm.policyLevel || undefined,
                issuing_department: pushForm.issuingDepartment.trim() || undefined,
                publish_date: new Date().toISOString().slice(0, 10),
                deadline: pushForm.deadline || undefined,
                applicable_targets: splitCsv(pushForm.applicableTargets),
                regions: ['苏州'],
                channels: splitCsv(pushForm.channels),
                target_tags: splitCsv(pushForm.targetTags),
                keywords: splitCsv(pushForm.keywords),
                push_scope: pushForm.pushScope || undefined,
                status: 'active',
            });
            const data = await ParkService.getPolicyPushes();
            setPolicyPushes(data);
            setPushForm((prev) => ({
                ...prev,
                policyTitle: '',
                applicableTargets: '',
                targetTags: '',
                keywords: '',
                deadline: '',
            }));
        } catch (err) {
            console.error('Failed to create policy push', err);
            setLoadError('创建政策推送失败，请稍后重试');
        } finally {
            setIsSubmittingPush(false);
        }
    };

    const topTargets = (investment?.recommended?.length ? investment.recommended : investment?.items || []).slice(0, 12);

    const onDropInsight = (targetId: InsightWidgetId) => {
        if (!draggingInsight || draggingInsight === targetId) {
            setDraggingInsight(null);
            return;
        }
        const next = [...insightOrder];
        const from = next.indexOf(draggingInsight);
        const to = next.indexOf(targetId);
        if (from < 0 || to < 0) {
            setDraggingInsight(null);
            return;
        }
        next.splice(from, 1);
        next.splice(to, 0, draggingInsight);
        setInsightOrder(next);
        setDraggingInsight(null);
    };

    const moveInsight = (id: InsightWidgetId, direction: 'up' | 'down') => {
        const idx = insightOrder.indexOf(id);
        if (idx < 0) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= insightOrder.length) return;
        const next = [...insightOrder];
        const [item] = next.splice(idx, 1);
        next.splice(swapIdx, 0, item);
        setInsightOrder(next);
    };

    const renderInsightWidget = (id: InsightWidgetId, body: React.ReactNode, title: string) => (
        <section
            key={id}
            draggable
            onDragStart={() => setDraggingInsight(id)}
            onDragEnd={() => setDraggingInsight(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropInsight(id)}
            className={`space-y-3 ${draggingInsight === id ? 'opacity-70' : ''}`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm text-adaptive-text-muted">{title}</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => moveInsight(id, 'up')} className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text">上移</button>
                    <button onClick={() => moveInsight(id, 'down')} className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text">下移</button>
                    <span className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted flex items-center gap-1">
                        <GripVertical className="w-3.5 h-3.5" /> 拖拽
                    </span>
                </div>
            </div>
            {body}
        </section>
    );

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-brand-deep tracking-tight">园区管理控制台</h1>
                    <p className="text-sm font-medium text-adaptive-text-muted mt-1">
                        为园区运营方提供产业洞察、智能招商、政策推送和消息协同能力
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-adaptive-border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        <FileText className="w-4 h-4 text-brand-tech" />
                        批量导入企业库
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-tech hover:bg-brand-deep border border-transparent rounded-lg text-sm font-bold text-white transition-all shadow-md">
                        <Send className="w-4 h-4" />
                        新建园区政策
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-adaptive-bg/50 border border-adaptive-border rounded-xl w-fit backdrop-blur-sm shadow-sm font-medium">
                <button
                    onClick={() => navigate('/park/insights')}
                    className={`px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${activeTab === 'insights'
                        ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                        : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        }`}
                >
                    <PieChart className="w-4 h-4" />
                    产业洞察
                </button>
                <button
                    onClick={() => navigate('/park/investment')}
                    className={`px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${activeTab === 'investment'
                        ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                        : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        }`}
                >
                    <Target className="w-4 h-4" />
                    智能招商
                </button>
                <button
                    onClick={() => navigate('/park/policies')}
                    className={`px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${activeTab === 'policies'
                        ? 'bg-white text-brand-deep shadow-sm border border-adaptive-border-light font-bold'
                        : 'text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent'
                        }`}
                >
                    <Send className="w-4 h-4" />
                    政策推送
                </button>
                <button
                    onClick={() => navigate('/park/messages')}
                    className="px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm text-adaptive-text-muted hover:text-adaptive-text hover:bg-white/50 border border-transparent"
                >
                    <Bell className="w-4 h-4" />
                    消息中心
                </button>
            </div>

            {loadError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {loadError}
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="space-y-6">
                    {isInsightsLoading || !insights ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-40 bg-slate-100 rounded-xl" />
                            <div className="h-80 bg-slate-100 rounded-xl" />
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setInsightOrder(INSIGHT_WIDGETS)}
                                className="text-xs px-3 py-2 rounded-lg border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text inline-flex items-center gap-1"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> 恢复默认布局
                            </button>

                            {insightOrder.map((id) => {
                                if (id === 'profile') {
                                    return renderInsightWidget(
                                        'profile',
                                        <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-adaptive-text-muted">画像状态</p>
                                                    <p className="text-lg font-semibold text-adaptive-text mt-1">{parkProfileData?.alert.title || '加载中'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setIsParkProfileCollapsed((v) => !v)}
                                                        className="text-xs px-3 py-2 rounded-lg border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text"
                                                    >
                                                        {isParkProfileCollapsed ? '展开' : '折叠'}
                                                    </button>
                                                    <button
                                                        onClick={() => navigate('/park/profile-edit')}
                                                        className="text-xs px-3 py-2 rounded-lg border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text"
                                                    >
                                                        进入完整编辑
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                                                    <p className="text-xs text-adaptive-text-muted">画像完整度</p>
                                                    <p className="text-2xl font-bold text-adaptive-text mt-1">{parkProfileData?.completionRate ?? 0}%</p>
                                                </div>
                                                <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                                                    <p className="text-xs text-adaptive-text-muted">待补项</p>
                                                    <p className="text-2xl font-bold text-amber-500 mt-1">{parkProfileData?.alert.missingCount ?? parkProfileData?.alert.tips.length ?? 0}</p>
                                                </div>
                                                <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                                                    <p className="text-xs text-adaptive-text-muted">画像风险</p>
                                                    <p className="text-2xl font-bold mt-1 text-adaptive-text">
                                                        {(parkProfileData?.completionRate ?? 0) >= 85 ? '低' : (parkProfileData?.completionRate ?? 0) >= 65 ? '中' : '高'}
                                                    </p>
                                                </div>
                                            </div>

                                            {!isParkProfileCollapsed && (
                                                <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                                                    <p className="text-sm font-medium text-adaptive-text flex items-center gap-2">
                                                        <UserCircle2 className="w-4 h-4 text-primary-500" />
                                                        园区吸引力雷达
                                                    </p>
                                                    {isParkProfileLoading || !parkProfileData ? (
                                                        <div className="h-[240px] mt-2 rounded bg-slate-100 animate-pulse" />
                                                    ) : (
                                                        <div className="h-[240px] mt-2">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={parkProfileData.radarData}>
                                                                    <PolarGrid stroke="#334155" />
                                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} />
                                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                                    <Radar name="指标" dataKey="A" stroke="#0EA5E9" strokeWidth={2} fill="#0EA5E9" fillOpacity={0.2} />
                                                                </RadarChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!isParkProfileCollapsed && (
                                                <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                                                    <p className="text-sm font-medium text-adaptive-text flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 text-cta-500" /> 关键提示
                                                    </p>
                                                    <p className="text-xs text-adaptive-text-muted mt-1">{parkProfileData?.alert.description || '加载中...'}</p>
                                                    <div className="mt-3 space-y-2">
                                                        {(parkProfileData?.alert.tips || []).slice(0, 4).map((tip) => (
                                                            <div key={tip.id} className="p-3 rounded-lg border border-adaptive-border bg-adaptive-panel-hover flex items-center justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <p className="text-sm text-adaptive-text line-clamp-2">{tip.content}</p>
                                                                    <span className="text-[11px] text-adaptive-text-muted">{tip.actionLabel}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => navigate('/park/profile-edit')}
                                                                    className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text whitespace-nowrap"
                                                                >
                                                                    去补充
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>,
                                        '园区画像',
                                    );
                                }
                                if (id === 'overview') {
                                    return renderInsightWidget(
                                        'overview',
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm">
                                                <p className="text-xs text-adaptive-text-muted mb-2">园区企业总数</p>
                                                <p className="text-2xl font-bold text-slate-800">{insights.overview.total_enterprises}</p>
                                            </div>
                                            <div className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm">
                                                <p className="text-xs text-adaptive-text-muted mb-2">已入驻园区</p>
                                                <p className="text-2xl font-bold text-green-600">{insights.overview.in_park_enterprises}</p>
                                            </div>
                                            <div className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm">
                                                <p className="text-xs text-adaptive-text-muted mb-2">待招商目标池</p>
                                                <p className="text-2xl font-bold text-brand-tech">{insights.overview.outside_enterprises}</p>
                                            </div>
                                            <div className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm">
                                                <p className="text-xs text-adaptive-text-muted mb-2">行业类型数</p>
                                                <p className="text-2xl font-bold text-slate-800">{insights.overview.industry_types}</p>
                                            </div>
                                        </div>,
                                        '园区概览',
                                    );
                                }
                                if (id === 'heatmap') {
                                    return renderInsightWidget(
                                        'heatmap',
                                        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border border-adaptive-border rounded-xl p-6 shadow-sm">
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <h3 className="font-bold text-lg text-slate-800">行业分布热力图</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>低</span>
                                                    <div className="w-20 h-2 rounded-full bg-gradient-to-r from-blue-100 via-blue-300 to-blue-700" />
                                                    <span>高</span>
                                                </div>
                                            </div>
                                            {selectedIndustry && (
                                                <div className="mb-3 text-xs text-brand-deep bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                                                    已高亮行业：{selectedIndustry}
                                                    <button onClick={() => setSelectedIndustry(null)} className="underline hover:text-brand-tech">清除</button>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {heatmapData.slice(0, 12).map((item) => {
                                                    const isActive = selectedIndustry === item.industry;
                                                    return (
                                                        <button
                                                            key={item.industry}
                                                            type="button"
                                                            onClick={() => setSelectedIndustry(item.industry === selectedIndustry ? null : item.industry)}
                                                            title={`${item.industry}｜${item.count}家｜占比${item.percent.toFixed(1)}%｜热度${item.level}`}
                                                            className={`rounded-lg p-4 border text-left transition-all ${isActive ? 'ring-2 ring-blue-500 shadow-md scale-[1.01]' : 'hover:shadow-sm hover:-translate-y-0.5'}`}
                                                            style={{ background: item.bgColor, borderColor: item.borderColor }}
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-sm font-bold text-slate-800">{item.industry}</p>
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 text-slate-700">{item.level}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-700 mt-1">{item.count} 家企业 · {item.percent.toFixed(1)}%</p>
                                                            <div className="mt-3 h-1.5 rounded-full bg-white/50 overflow-hidden">
                                                                <div className="h-full bg-blue-700/80 rounded-full" style={{ width: `${Math.max(10, item.ratio * 100)}%` }} />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>,
                                        '行业热力图',
                                    );
                                }
                                if (id === 'geo_chain') {
                                    return renderInsightWidget(
                                        'geo_chain',
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="bg-white border border-adaptive-border rounded-xl p-6 shadow-sm">
                                                <h3 className="font-bold text-lg text-slate-800 mb-4">地理分布（办公地）</h3>
                                                <div className="h-[280px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={geoChartData} margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                            <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                                                            <RechartsTooltip />
                                                            <Bar dataKey="count" fill="#3182ce" radius={[6, 6, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-adaptive-border rounded-xl p-6 shadow-sm">
                                                <h3 className="font-bold text-lg text-slate-800 mb-4">产业链图谱（上下游）</h3>
                                                <div className="space-y-3">
                                                    {insights.industry_chain.links.length === 0 && (
                                                        <p className="text-sm text-adaptive-text-muted">暂无可展示的上下游关系。</p>
                                                    )}
                                                    {insights.industry_chain.links.map((link) => {
                                                        const sourceName = insights.industry_chain.nodes.find((n) => n.id === link.source)?.name || link.source;
                                                        const targetName = insights.industry_chain.nodes.find((n) => n.id === link.target)?.name || link.target;
                                                        const isHighlight = !selectedIndustry || sourceName === selectedIndustry || targetName === selectedIndustry;
                                                        return (
                                                            <div
                                                                key={`${link.source}-${link.target}`}
                                                                className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 border transition-all ${isHighlight ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100 opacity-55'}`}
                                                            >
                                                                <span className={`font-semibold ${isHighlight ? 'text-blue-700' : 'text-slate-700'}`}>{sourceName}</span>
                                                                <span className="text-slate-400">→</span>
                                                                <span className={`font-semibold ${isHighlight ? 'text-blue-700' : 'text-slate-700'}`}>{targetName}</span>
                                                                <span className={`ml-auto text-xs ${isHighlight ? 'text-brand-tech' : 'text-slate-400'}`}>关联强度 {link.weight}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>,
                                        '地理与图谱',
                                    );
                                }
                                return renderInsightWidget(
                                    'trend',
                                    <div className="bg-white border border-adaptive-border rounded-xl p-6 shadow-sm">
                                        <h3 className="font-bold text-lg text-slate-800 mb-4">时间趋势（企业数量变化）</h3>
                                        <div className="h-[280px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3182ce" stopOpacity={0.35} />
                                                            <stop offset="95%" stopColor="#3182ce" stopOpacity={0.05} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
                                                    <RechartsTooltip />
                                                    <Area type="monotone" dataKey="total" stroke="#3182ce" strokeWidth={2.5} fill="url(#colorTotal)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>,
                                    '时间趋势',
                                );
                            })}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'investment' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-adaptive-border p-5 shadow-sm">
                            <p className="text-sm text-adaptive-text-muted">可筛选目标总量</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{investment?.summary.total || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-adaptive-border p-5 shadow-sm">
                            <p className="text-sm text-adaptive-text-muted">未入驻目标</p>
                            <p className="text-2xl font-bold text-brand-tech mt-1">{investment?.summary.out_of_park || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-adaptive-border p-5 shadow-sm">
                            <p className="text-sm text-adaptive-text-muted">推荐目标</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{investment?.summary.recommended || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-adaptive-border p-5 shadow-sm">
                            <p className="text-sm text-adaptive-text-muted">重点方向</p>
                            <p className="text-base font-bold text-slate-700 mt-2">OPC / AI方向 / 产品类型</p>
                        </div>
                    </div>

                    <div className="bg-white border border-adaptive-border rounded-xl p-4 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="搜索企业名称、标签、地区"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                                />
                            </div>
                            <select value={opcStage} onChange={(e) => setOpcStage(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech">
                                <option value="">全部 OPC 阶段</option>
                                {opcStageOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                            <select value={aiDirection} onChange={(e) => setAiDirection(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech">
                                <option value="">全部 AI 技术方向</option>
                                {aiDirectionOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                            <select value={productType} onChange={(e) => setProductType(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech">
                                <option value="">全部产品/服务类型</option>
                                {productTypeOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" checked={onlyOutOfPark} onChange={(e) => setOnlyOutOfPark(e.target.checked)} />
                                仅看未入驻园区企业/OPC
                            </label>
                            <button
                                onClick={() => {
                                    setKeyword('');
                                    setOpcStage('');
                                    setAiDirection('');
                                    setProductType('');
                                    setOnlyOutOfPark(true);
                                }}
                                className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50"
                            >
                                <Filter className="w-4 h-4 inline mr-1" />
                                清空筛选
                            </button>
                        </div>
                    </div>

                    {isInvestmentLoading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-32 bg-slate-100 rounded-xl" />
                            <div className="h-32 bg-slate-100 rounded-xl" />
                        </div>
                    ) : topTargets.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
                            暂无符合筛选条件的招商目标
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topTargets.map((target) => (
                                <div key={target.id} className="bg-white rounded-xl border border-adaptive-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-5 border-b border-adaptive-border bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-bold text-slate-800">{target.name}</h4>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${target.in_park ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                                {target.in_park ? '已入驻' : '未入驻'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-brand-tech/10 text-brand-deep px-3 py-1.5 rounded-full font-bold text-sm">
                                            <Zap className="w-4 h-4" />
                                            匹配度：{target.matchScore}
                                        </div>
                                    </div>

                                    <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-4 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Briefcase className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium mb-1">行业</p>
                                                    <p className="text-sm font-semibold text-slate-700">{target.industry}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
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

                                        <div className="md:col-span-8 flex flex-col sm:flex-row gap-6 bg-slate-50/50 rounded-lg p-5 border border-slate-100">
                                            <div className="flex-1 space-y-3">
                                                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                                                    <Target className="w-4 h-4 text-brand-tech" />
                                                    招引价值
                                                </h5>
                                                <ul className="space-y-2.5">
                                                    {target.valuePoints.map((vp, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${vp.type === 'high' ? 'text-green-500' : 'text-blue-400'}`} />
                                                            <span className="text-sm text-slate-600 leading-relaxed font-medium">{vp.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex-1 space-y-3 pt-4 sm:pt-0 sm:border-l border-slate-200 sm:pl-6">
                                                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                                                    <TrendingUp className="w-4 h-4 text-brand-tech" />
                                                    策略建议
                                                </h5>
                                                <ul className="space-y-2 text-sm text-slate-600">
                                                    {target.strategy.map((s, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 relative pl-3">
                                                            <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-brand-tech/60"></div>
                                                            <span className="leading-relaxed font-medium">{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 py-4 bg-slate-50/80 border-t border-adaptive-border flex justify-end gap-3 flex-wrap">
                                        <button
                                            onClick={() => handleViewDetails(String(target.id))}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50"
                                        >
                                            查看详情
                                        </button>
                                        <button
                                            onClick={() => handleGenerateProposal(String(target.id))}
                                            className="px-4 py-2 bg-brand-tech text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-deep transition-colors"
                                        >
                                            生成招商方案
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'policies' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 border border-adaptive-border bg-white rounded-xl shadow-sm p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                <Send className="w-5 h-5 text-brand-tech" />
                                发布新政策推送
                            </h3>
                            <p className="text-xs text-adaptive-text-muted">上传政策后，可向园内企业和园外潜在企业定向推送。</p>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={pushForm.policyTitle}
                                onChange={(e) => setPushForm((p) => ({ ...p, policyTitle: e.target.value }))}
                                placeholder="政策标题 *"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={pushForm.policyLevel}
                                    onChange={(e) => setPushForm((p) => ({ ...p, policyLevel: e.target.value }))}
                                    placeholder="政策级别"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                                />
                                <input
                                    type="text"
                                    value={pushForm.issuingDepartment}
                                    onChange={(e) => setPushForm((p) => ({ ...p, issuingDepartment: e.target.value }))}
                                    placeholder="发布部门"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                                />
                            </div>
                            <input
                                type="date"
                                value={pushForm.deadline}
                                onChange={(e) => setPushForm((p) => ({ ...p, deadline: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                            />
                            <input
                                type="text"
                                value={pushForm.applicableTargets}
                                onChange={(e) => setPushForm((p) => ({ ...p, applicableTargets: e.target.value }))}
                                placeholder="适用对象（逗号分隔）"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                            />
                            <input
                                type="text"
                                value={pushForm.channels}
                                onChange={(e) => setPushForm((p) => ({ ...p, channels: e.target.value }))}
                                placeholder="推送渠道（逗号分隔）"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                            />
                            <input
                                type="text"
                                value={pushForm.targetTags}
                                onChange={(e) => setPushForm((p) => ({ ...p, targetTags: e.target.value }))}
                                placeholder="定向标签（逗号分隔）"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                            />
                            <input
                                type="text"
                                value={pushForm.keywords}
                                onChange={(e) => setPushForm((p) => ({ ...p, keywords: e.target.value }))}
                                placeholder="关键词（逗号分隔）"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-tech"
                            />
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50">
                                <FileText className="w-6 h-6 text-brand-tech mx-auto mb-2" />
                                <h4 className="text-xs font-bold text-slate-700">文件上传能力后续可接</h4>
                            </div>
                        </div>
                        <button
                            onClick={() => { void handleCreatePolicyPush(); }}
                            disabled={isSubmittingPush}
                            className="w-full py-3 bg-brand-tech hover:bg-brand-deep disabled:opacity-60 text-white font-bold text-sm rounded-lg shadow-md transition-all"
                        >
                            {isSubmittingPush ? '提交中...' : '上传并解析'}
                        </button>
                    </div>
                    <div className="col-span-1 lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-brand-tech" />
                            已生效推送记录
                        </h3>
                        {isPoliciesLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-36 bg-slate-100 rounded-xl" />
                                <div className="h-36 bg-slate-100 rounded-xl" />
                            </div>
                        ) : policyPushes.length === 0 ? (
                            <div className="bg-white border border-adaptive-border rounded-xl p-8 shadow-sm text-center text-sm text-slate-500">
                                暂无政策推送记录
                            </div>
                        ) : (
                            policyPushes.map((item) => (
                                <div key={item.id} className="bg-white border border-adaptive-border rounded-xl p-5 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">{item.policy_title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                发布部门：{item.issuing_department || '未填写'} · 级别：{item.policy_level || '未填写'} · 状态：{item.status}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                发布时间：{item.publish_date || '未填写'} · 截止：{item.deadline || '未填写'} · 最近推送：{item.last_pushed_at ? item.last_pushed_at.slice(0, 10) : '未推送'}
                                            </p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                            {item.push_scope || '全量推送'}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                                            <p className="text-slate-500 mb-1">适用对象</p>
                                            <p className="text-slate-700 font-medium">{(item.applicable_targets || []).join('、') || '未填写'}</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                                            <p className="text-slate-500 mb-1">覆盖地区</p>
                                            <p className="text-slate-700 font-medium">{(item.regions || []).join('、') || '未填写'}</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                                            <p className="text-slate-500 mb-1">推送渠道</p>
                                            <p className="text-slate-700 font-medium">{(item.channels || []).join('、') || '未填写'}</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                                            <p className="text-slate-500 mb-1">定向标签 / 关键词</p>
                                            <p className="text-slate-700 font-medium">
                                                {[...(item.target_tags || []), ...(item.keywords || [])].join('、') || '未填写'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">触达</p>
                                            <p className="text-lg font-bold text-slate-700">{item.reach_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">打开</p>
                                            <p className="text-lg font-bold text-brand-tech">{item.open_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">点击</p>
                                            <p className="text-lg font-bold text-indigo-600">{item.click_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">转化意向</p>
                                            <p className="text-lg font-bold text-green-600">
                                                {item.intent_count}
                                                <span className="text-xs text-slate-500 ml-1">({item.conversion_rate.toFixed(1)}%)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

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
