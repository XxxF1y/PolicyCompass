import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Upload,
    Clock,
    Eye,
    Edit3,
    Download,
    Trash2,
    Plus,
    FolderOpen,
    Award,
    Briefcase,
    Users,
    Building2,
    ShieldCheck,
    Sparkles,
    RotateCcw,
    Image as ImageIcon,
    ExternalLink,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Info,
    Globe,
    MessageSquare,
} from 'lucide-react';
import type {
    AppStatus,
    MaterialCategory,
    MaterialStatus,
    ApplicationRecord,
    MaterialItem,
    MaterialPackage,
    MaterialAlert,
    ChecklistItem,
} from '../../types/application';
import { ApplicationService } from '../../services/applicationService';
import FeedbackModal from './components/FeedbackModal';

// ==================== 配置映射 ====================

const statusConfig: Record<AppStatus, { label: string; color: string; bgColor: string }> = {
    generating: { label: '材料生成中', color: '#3182ce', bgColor: '#ebf8ff' },
    pre_reviewed: { label: '预审完成', color: '#805ad5', bgColor: '#faf5ff' },
    pending_redirect: { label: '待前往申报', color: '#d69e2e', bgColor: '#fffff0' },
    redirected: { label: '已前往申报', color: '#2b6cb0', bgColor: '#ebf8ff' },
    estimated_reviewing: { label: '预估审核中', color: '#2b6cb0', bgColor: '#bee3f8' },
    passed: { label: '已通过', color: '#38a169', bgColor: '#f0fff4' },
    rejected: { label: '未通过', color: '#e53e3e', bgColor: '#fff5f5' },
    returned: { label: '已退回', color: '#ed8936', bgColor: '#fffaf0' },
    granted: { label: '已拨付', color: '#2f855a', bgColor: '#f0fff4' },
};

const materialStatusConfig: Record<MaterialStatus, { label: string; color: string }> = {
    valid: { label: '有效', color: '#38a169' },
    expiring: { label: '即将过期', color: '#d69e2e' },
    expired: { label: '已过期', color: '#e53e3e' },
};

const categoryConfig: Record<MaterialCategory, { label: string; icon: typeof FileText; color: string }> = {
    license: { label: '证照', icon: Award, color: '#3182ce' },
    finance: { label: '财务', icon: Briefcase, color: '#38a169' },
    qualification: { label: '资质', icon: ShieldCheck, color: '#805ad5' },
    ip: { label: '知识产权', icon: FileText, color: '#d69e2e' },
    personnel: { label: '人员', icon: Users, color: '#e53e3e' },
    project: { label: '项目', icon: Building2, color: '#718096' },
};

const packageStatusConfig: Record<string, { label: string; color: string }> = {
    drafting: { label: '编辑中', color: '#3182ce' },
    ai_reviewing: { label: 'AI 预审中', color: '#805ad5' },
    expert_reviewing: { label: '专家预审中', color: '#d69e2e' },
    ready: { label: '可提交', color: '#38a169' },
    exported: { label: '已导出', color: '#718096' },
};

// ==================== 步骤条定义 ====================

const statusSteps: { key: string; label: string }[] = [
    { key: 'generating', label: '材料生成' },
    { key: 'pre_reviewed', label: '预审完成' },
    { key: 'pending_redirect', label: '待前往申报' },
    { key: 'redirected', label: '已前往申报' },
    { key: 'estimated_reviewing', label: '预估审核中' },
    { key: 'result', label: '结果' },
];

function getStepIndex(status: AppStatus): number {
    const map: Record<string, number> = {
        generating: 0, pre_reviewed: 1, pending_redirect: 2,
        redirected: 3, estimated_reviewing: 4,
        passed: 5, rejected: 5, returned: 5, granted: 5,
    };
    return map[status] ?? 0;
}

// ==================== 组件 ====================

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<'records' | 'materials' | 'factory'>('records');
    const [materialFilter, setMaterialFilter] = useState<MaterialCategory | 'all'>('all');

    const navigate = useNavigate();

    const [applicationsData, setApplicationsData] = useState<ApplicationRecord[]>([]);
    const [materialsData, setMaterialsData] = useState<MaterialItem[]>([]);
    const [packagesData, setPackagesData] = useState<MaterialPackage[]>([]);
    const [materialAlerts, setMaterialAlerts] = useState<MaterialAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackPolicyTitle, setFeedbackPolicyTitle] = useState('');

    // Expand states
    const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);
    const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [apps, mats, pkgs, alerts] = await Promise.all([
                    ApplicationService.getApplications(),
                    ApplicationService.getMaterials(),
                    ApplicationService.getPackages(),
                    ApplicationService.getMaterialAlerts(),
                ]);
                setApplicationsData(apps);
                setMaterialsData(mats);
                setPackagesData(pkgs);
                setMaterialAlerts(alerts);
            } catch (error) {
                console.error("Failed to fetch applications data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredMaterials = materialFilter === 'all'
        ? materialsData
        : materialsData.filter(m => m.category === materialFilter);

    const tabs = [
        { key: 'records' as const, label: '申报记录', count: applicationsData.length },
        { key: 'materials' as const, label: '素材管理', count: materialsData.length },
        { key: 'factory' as const, label: '材料工厂', count: packagesData.length },
    ];

    const openFeedbackModal = (title: string) => {
        setFeedbackPolicyTitle(title);
        setFeedbackModalOpen(true);
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                    申报中心
                    <FolderOpen className="w-6 h-6 text-slate-400" />
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    管理申报素材，AI 生成申报材料，追踪申报进度。
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-0">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${activeTab === tab.key
                            ? 'border-slate-800 text-slate-800'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
                <div className="space-y-4 animate-pulse pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-slate-100 rounded-xl w-full border border-slate-200"></div>
                        ))}
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-100 rounded-xl w-full border border-slate-200"></div>
                    ))}
                </div>
            ) : (
                <>
                    {/* ===== TAB 1: 申报记录 ===== */}
                    {activeTab === 'records' && (
                        <div className="space-y-4">
                            {/* Stats overview */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { label: '进行中', value: applicationsData.filter(a => !['passed', 'rejected', 'returned', 'granted'].includes(a.status)).length, color: '#3182ce' },
                                    { label: '已通过', value: applicationsData.filter(a => a.status === 'passed' || a.status === 'granted').length, color: '#38a169' },
                                    { label: '已退回', value: applicationsData.filter(a => a.status === 'returned').length, color: '#ed8936' },
                                    { label: '未通过', value: applicationsData.filter(a => a.status === 'rejected').length, color: '#e53e3e' },
                                    { label: '总申报', value: applicationsData.length, color: '#718096' },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                        <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                                        <div className="text-2xl font-black mt-1" style={{ color: stat.color }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Platform notice */}
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    本平台不与真实的政策申报系统对接打通。生成材料后，请通过跳转链接前往对应官方申报平台自主完成申报。申报进度为系统预估，非实时同步。
                                </p>
                            </div>

                            {/* Application Cards */}
                            {applicationsData.map(app => {
                                const sc = statusConfig[app.status];
                                const currentStep = getStepIndex(app.status);
                                return (
                                    <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        {/* Main content */}
                                        <div className="p-5 md:p-6">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: sc.color, backgroundColor: sc.bgColor }}>
                                                            {sc.label}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">{app.materialGenerateTime} 创建</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-800 leading-snug">{app.policyTitle}</h3>
                                                    <div className="flex items-center gap-5 mt-2 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <Building2 className="w-3.5 h-3.5 opacity-60" />
                                                            <span>{app.agency}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <div className="text-[11px] text-slate-400 font-medium">预估扶持额</div>
                                                    <div className="text-xl font-black text-slate-800">{app.amount}</div>
                                                </div>
                                            </div>

                                            {/* Step Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between relative">
                                                    {statusSteps.map((step, idx) => {
                                                        const isCompleted = idx < currentStep;
                                                        const isCurrent = idx === currentStep;
                                                        const isFinal = idx === statusSteps.length - 1;
                                                        let dotColor = '#cbd5e1';
                                                        if (isCompleted) dotColor = '#38a169';
                                                        if (isCurrent && !isFinal) dotColor = sc.color;
                                                        if (isCurrent && isFinal) dotColor = sc.color;

                                                        return (
                                                            <div key={step.key} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
                                                                <div
                                                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isCurrent ? 'ring-4 ring-opacity-20' : ''}`}
                                                                    style={{
                                                                        borderColor: dotColor,
                                                                        backgroundColor: isCompleted ? dotColor : (isCurrent ? dotColor : '#ffffff'),
                                                                        boxShadow: isCurrent ? `0 0 0 4px ${dotColor}30` : undefined,
                                                                    }}
                                                                >
                                                                    {isCompleted && (
                                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                                    )}
                                                                </div>
                                                                <span className={`text-[10px] mt-1.5 font-medium text-center leading-tight ${isCurrent ? 'text-slate-800 font-bold' : isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                    {isFinal && (app.status === 'passed' || app.status === 'granted') ? '已通过' :
                                                                        isFinal && app.status === 'rejected' ? '未通过' :
                                                                            isFinal && app.status === 'returned' ? '已退回' :
                                                                                step.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                    {/* Connecting line */}
                                                    <div className="absolute top-2 left-0 right-0 h-0.5 bg-slate-200 z-0" style={{ marginLeft: '8%', marginRight: '8%' }}>
                                                        <div
                                                            className="h-full bg-green-400 transition-all duration-500"
                                                            style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Estimated info */}
                                            {(app.estimatedReviewStage || app.estimatedResultDate) && (
                                                <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 rounded-lg px-4 py-2.5 mb-3">
                                                    {app.estimatedReviewStage && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 opacity-60" />
                                                            <span>预估阶段：<strong className="text-slate-700">{app.estimatedReviewStage}</strong></span>
                                                        </div>
                                                    )}
                                                    {app.estimatedResultDate && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Globe className="w-3.5 h-3.5 opacity-60" />
                                                            <span>预估结果公布：<strong className="text-slate-700">{app.estimatedResultDate}</strong></span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Grant info */}
                                            {app.status === 'granted' && app.grantAmount && (
                                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-3">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                                    <span className="text-xs text-green-700 font-medium">实际拨付金额：<strong>{app.grantAmount}</strong></span>
                                                </div>
                                            )}

                                            {/* Return reason */}
                                            {app.status === 'returned' && app.rejectReason && (
                                                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 mb-3">
                                                    <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                                                    <span className="text-xs text-orange-700 font-medium">退回原因：{app.rejectReason}</span>
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
                                                <button
                                                    onClick={() => navigate(`/applications/${app.id}/materials`)}
                                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white shadow-sm transition-colors bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    查看材料
                                                </button>

                                                {app.redirectUrl && ['pending_redirect', 'redirected', 'estimated_reviewing'].includes(app.status) && (
                                                    <button
                                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                                                        onClick={() => window.open(app.redirectUrl, '_blank')}
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        前往申报平台 ↗
                                                    </button>
                                                )}

                                                {['redirected', 'estimated_reviewing'].includes(app.status) && (
                                                    <button
                                                        onClick={() => openFeedbackModal(app.policyTitle)}
                                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        反馈审核结果
                                                    </button>
                                                )}

                                                {['generating', 'pre_reviewed', 'returned'].includes(app.status) && (
                                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        继续编辑
                                                    </button>
                                                )}

                                                {app.resultScreenshotUrl && (
                                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <ImageIcon className="w-3.5 h-3.5" />
                                                        查看凭证
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ===== TAB 2: 素材管理 ===== */}
                    {activeTab === 'materials' && (
                        <div className="space-y-4">
                            {/* Completeness Banner */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ebf8ff' }}>
                                        <ShieldCheck className="w-6 h-6" style={{ color: '#3182ce' }} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">素材完整度</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            已上传 {materialsData.length} 份素材，其中 {materialsData.filter(m => m.status === 'expired').length} 份已过期需更新
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-2xl font-black" style={{ color: '#3182ce' }}>75%</div>
                                        <div className="text-[11px] text-slate-400">良好</div>
                                    </div>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors bg-blue-600 text-white hover:bg-blue-700">
                                        <Upload className="w-4 h-4" />
                                        上传素材
                                    </button>
                                </div>
                            </div>

                            {/* Missing Material Alerts */}
                            {materialAlerts.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
                                        <AlertTriangle className="w-4 h-4" />
                                        素材缺失提醒
                                    </div>
                                    {materialAlerts.map((alert, i) => (
                                        <div key={i} className="flex items-center justify-between pl-6">
                                            <span className="text-xs text-amber-700">
                                                缺少：<strong>{alert.missingName}</strong>（{alert.requiredByCount} 项政策申报需要）
                                            </span>
                                            <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline transition-colors">
                                                立即上传
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Category Filter */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setMaterialFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${materialFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    全部 ({materialsData.length})
                                </button>
                                {(Object.entries(categoryConfig) as [MaterialCategory, typeof categoryConfig[MaterialCategory]][]).map(([key, cat]) => {
                                    const count = materialsData.filter(m => m.category === key).length;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setMaterialFilter(key)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${materialFilter === key ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                                }`}
                                            style={materialFilter === key ? { backgroundColor: cat.color } : {}}
                                        >
                                            {cat.label} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Material List */}
                            <div className="space-y-3">
                                {filteredMaterials.map(mat => {
                                    const cat = categoryConfig[mat.category];
                                    const ms = materialStatusConfig[mat.status];
                                    const CatIcon = cat.icon;
                                    const isExpanded = expandedMaterialId === mat.id;
                                    const hasExtracted = mat.extractedData && Object.keys(mat.extractedData).length > 0;

                                    return (
                                        <div key={mat.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            {/* Main row */}
                                            <div className="p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15` }}>
                                                    <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-slate-800 truncate">{mat.name}</div>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">{mat.fileType}</span>
                                                        <span>{mat.uploadDate}</span>
                                                        {mat.fileSize && <span>{(mat.fileSize / 1024 / 1024).toFixed(1)} MB</span>}
                                                        {mat.validTo && (
                                                            <span style={{ color: ms.color }} className="font-semibold">{ms.label}（至 {mat.validTo}）</span>
                                                        )}
                                                    </div>
                                                    {/* OCR summary inline */}
                                                    {hasExtracted && (
                                                        <div className="text-[11px] text-slate-400 mt-1.5 truncate">
                                                            已提取：{Object.keys(mat.extractedData!).join('、')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {hasExtracted && (
                                                        <button
                                                            onClick={() => setExpandedMaterialId(isExpanded ? null : mat.id)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                                                            title="查看提取数据"
                                                        >
                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded hover:bg-slate-100">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded hover:bg-slate-100">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded OCR data */}
                                            {isExpanded && hasExtracted && (
                                                <div className="border-t border-slate-100 bg-slate-50/50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                                                        OCR 智能提取数据
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {Object.entries(mat.extractedData!).map(([key, value]) => (
                                                            <div key={key} className="bg-white rounded-lg border border-slate-200 p-3">
                                                                <div className="text-[10px] text-slate-400 font-medium uppercase">{key}</div>
                                                                <div className="text-sm font-semibold text-slate-800 mt-0.5">{value}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: 材料工厂 ===== */}
                    {activeTab === 'factory' && (
                        <div className="space-y-4">
                            {/* Create new package */}
                            <button className="w-full bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 p-6 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition-all group">
                                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-sm">选择政策，生成新材料包</span>
                            </button>

                            {/* Package Cards */}
                            {packagesData.map(pkg => {
                                const ps = packageStatusConfig[pkg.status];
                                const progress = Math.round((pkg.completedItems / pkg.totalItems) * 100);
                                const isExpanded = expandedPackageId === pkg.id;
                                const hasChecklist = pkg.materialChecklist && pkg.materialChecklist.length > 0;
                                const hasReport = pkg.preReviewReport;

                                return (
                                    <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        {/* Header */}
                                        <div className="flex">
                                            <div className="w-2 shrink-0" style={{ backgroundColor: ps.color }}></div>
                                            <div className="flex-1 p-5 md:p-6">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: ps.color, backgroundColor: `${ps.color}15` }}>
                                                                {ps.label}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">最后更新：{pkg.lastUpdated}</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-slate-800 leading-snug">{pkg.policyTitle}</h3>
                                                    </div>
                                                    {pkg.preReviewScore !== undefined && (
                                                        <div className="shrink-0 text-right">
                                                            <div className="text-[11px] text-slate-400 font-medium">预审评分</div>
                                                            <div className="text-2xl font-black" style={{ color: pkg.preReviewScore >= 85 ? '#38a169' : pkg.preReviewScore >= 70 ? '#d69e2e' : '#e53e3e' }}>
                                                                {pkg.preReviewScore}<span className="text-sm">分</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Material progress */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                        <FileText className="w-3.5 h-3.5 opacity-60" />
                                                        <span>材料清单：{pkg.completedItems} / {pkg.totalItems} 项</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${progress}%`, backgroundColor: ps.color }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">{progress}%</span>
                                                </div>

                                                {/* Action buttons bar */}
                                                <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
                                                    {pkg.status === 'drafting' && (
                                                        <>
                                                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white shadow-sm transition-colors bg-blue-600 hover:bg-blue-700">
                                                                <Sparkles className="w-3.5 h-3.5" />
                                                                AI 生成
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                在线编辑
                                                            </button>
                                                        </>
                                                    )}
                                                    {pkg.status === 'ai_reviewing' && (
                                                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white shadow-sm transition-colors bg-blue-600 hover:bg-blue-700">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            查看预审报告
                                                        </button>
                                                    )}
                                                    {pkg.status === 'ready' && (
                                                        <>
                                                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs text-white shadow-sm transition-colors bg-blue-600 hover:bg-blue-700">
                                                                <Download className="w-3.5 h-3.5" />
                                                                导出材料包
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                继续修改
                                                            </button>
                                                        </>
                                                    )}
                                                    {pkg.status === 'exported' && (
                                                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                            重新导出
                                                        </button>
                                                    )}

                                                    {/* Toggle expand */}
                                                    {(hasChecklist || hasReport) && (
                                                        <button
                                                            onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors ml-auto"
                                                        >
                                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                            {isExpanded ? '收起详情' : '展开详情'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded: Checklist + PreReview Report */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-100 bg-slate-50/30 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                                                    {/* Checklist */}
                                                    {hasChecklist && (
                                                        <div className="p-5">
                                                            <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                                                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                                                材料清单明细
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {pkg.materialChecklist!.map((item: ChecklistItem, idx: number) => (
                                                                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                                                                        {item.status === 'ready' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                                                                        {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                                                                        {item.status === 'missing' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                                                                        <div className="flex-1">
                                                                            <div className={`font-semibold ${item.status === 'missing' ? 'text-red-700' : item.status === 'warning' ? 'text-amber-700' : 'text-slate-700'}`}>
                                                                                {item.name}
                                                                            </div>
                                                                            {item.source && <div className="text-slate-400 mt-0.5">└ {item.source}</div>}
                                                                            {item.note && <div className="text-slate-400 mt-0.5">└ {item.note}</div>}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* PreReview Report */}
                                                    {hasReport && (
                                                        <div className="p-5">
                                                            <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                                                                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                                                AI 预审报告
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {/* Errors */}
                                                                {pkg.preReviewReport!.errors.length > 0 && (
                                                                    <div>
                                                                        <div className="text-[10px] font-bold text-red-600 uppercase mb-1.5 flex items-center gap-1">
                                                                            <AlertCircle className="w-3 h-3" /> 错误（需修正）
                                                                        </div>
                                                                        {pkg.preReviewReport!.errors.map((err, i) => (
                                                                            <div key={i} className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2 mb-1.5">
                                                                                {i + 1}. {err}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {/* Warnings */}
                                                                {pkg.preReviewReport!.warnings.length > 0 && (
                                                                    <div>
                                                                        <div className="text-[10px] font-bold text-amber-600 uppercase mb-1.5 flex items-center gap-1">
                                                                            <AlertTriangle className="w-3 h-3" /> 警告（建议优化）
                                                                        </div>
                                                                        {pkg.preReviewReport!.warnings.map((warn, i) => (
                                                                            <div key={i} className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-1.5">
                                                                                {i + 1}. {warn}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {/* Suggestions */}
                                                                {pkg.preReviewReport!.suggestions.length > 0 && (
                                                                    <div>
                                                                        <div className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 flex items-center gap-1">
                                                                            <Lightbulb className="w-3 h-3" /> 建议（可提升通过率）
                                                                        </div>
                                                                        {pkg.preReviewReport!.suggestions.map((sug, i) => (
                                                                            <div key={i} className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2 mb-1.5">
                                                                                {i + 1}. {sug}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={feedbackModalOpen}
                policyTitle={feedbackPolicyTitle}
                onClose={() => setFeedbackModalOpen(false)}
            />
        </div>
    );
}
