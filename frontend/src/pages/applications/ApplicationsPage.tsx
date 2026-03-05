import { useState } from 'react';
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
    ArrowRight,
    ImageIcon,
    RotateCcw
} from 'lucide-react';

// ==================== 申报记录 Mock 数据 ====================
type AppStatus = 'generating' | 'pre_reviewed' | 'pending_submit' | 'reviewing' | 'passed' | 'rejected' | 'returned';

interface ApplicationRecord {
    id: string;
    policyTitle: string;
    agency: string;
    amount: string;
    status: AppStatus;
    submitDate: string;
    estimatedResult?: string;
    progress: number; // 0-100
}

const statusConfig: Record<AppStatus, { label: string; color: string; bgColor: string }> = {
    generating: { label: '材料生成中', color: '#3182ce', bgColor: '#ebf8ff' },
    pre_reviewed: { label: '预审完成', color: '#38a169', bgColor: '#f0fff4' },
    pending_submit: { label: '待前往申报', color: '#d69e2e', bgColor: '#fffff0' },
    reviewing: { label: '预估审核中', color: '#805ad5', bgColor: '#faf5ff' },
    passed: { label: '已通过', color: '#38a169', bgColor: '#f0fff4' },
    rejected: { label: '未通过', color: '#e53e3e', bgColor: '#fff5f5' },
    returned: { label: '已退回', color: '#ed8936', bgColor: '#fffaf0' },
};

const applicationsData: ApplicationRecord[] = [
    {
        id: 'app1',
        policyTitle: '人工智能算力平台专项补贴',
        agency: '苏州市工信局',
        amount: '最高 50 万',
        status: 'pre_reviewed',
        submitDate: '2026-02-28',
        estimatedResult: '2026-04-15',
        progress: 60,
    },
    {
        id: 'app2',
        policyTitle: '企业研发机构与创新平台奖励',
        agency: '江苏省科技厅',
        amount: '30 - 100 万',
        status: 'generating',
        submitDate: '2026-03-02',
        progress: 25,
    },
    {
        id: 'app3',
        policyTitle: '苏州市智改数转专项资金',
        agency: '苏州市工信局',
        amount: '最高 200 万',
        status: 'pending_submit',
        submitDate: '2026-02-15',
        estimatedResult: '2026-05-01',
        progress: 80,
    },
    {
        id: 'app4',
        policyTitle: '高新技术企业培育资金',
        agency: '苏州市科技局',
        amount: '20 万',
        status: 'passed',
        submitDate: '2025-12-10',
        progress: 100,
    },
    {
        id: 'app5',
        policyTitle: '大模型专项扶持计划',
        agency: '深圳市科技创新委',
        amount: '最高 500 万',
        status: 'rejected',
        submitDate: '2025-11-20',
        progress: 100,
    },
];

// ==================== 素材管理 Mock 数据 ====================
type MaterialCategory = 'license' | 'finance' | 'qualification' | 'ip' | 'personnel' | 'project';
type MaterialStatus = 'valid' | 'expiring' | 'expired';

interface MaterialItem {
    id: string;
    name: string;
    category: MaterialCategory;
    uploadDate: string;
    validTo?: string;
    status: MaterialStatus;
    fileType: string;
}

const categoryConfig: Record<MaterialCategory, { label: string; icon: typeof FileText; color: string }> = {
    license: { label: '证照', icon: Award, color: '#3182ce' },
    finance: { label: '财务', icon: Briefcase, color: '#38a169' },
    qualification: { label: '资质', icon: ShieldCheck, color: '#805ad5' },
    ip: { label: '知识产权', icon: FileText, color: '#d69e2e' },
    personnel: { label: '人员', icon: Users, color: '#e53e3e' },
    project: { label: '项目', icon: FolderOpen, color: '#ed8936' },
};

const materialStatusConfig: Record<MaterialStatus, { label: string; color: string }> = {
    valid: { label: '有效', color: '#38a169' },
    expiring: { label: '即将过期', color: '#d69e2e' },
    expired: { label: '已过期', color: '#e53e3e' },
};

const materialsData: MaterialItem[] = [
    { id: 'm1', name: '营业执照（统一社会信用代码）', category: 'license', uploadDate: '2026-01-15', validTo: '2046-01-15', status: 'valid', fileType: 'PDF' },
    { id: 'm2', name: '2025年度审计报告', category: 'finance', uploadDate: '2026-02-20', status: 'valid', fileType: 'PDF' },
    { id: 'm3', name: '高新技术企业证书', category: 'qualification', uploadDate: '2025-06-10', validTo: '2026-06-10', status: 'expiring', fileType: 'JPG' },
    { id: 'm4', name: '软件著作权登记证书（3项）', category: 'ip', uploadDate: '2025-09-05', status: 'valid', fileType: 'PDF' },
    { id: 'm5', name: '核心技术团队名单', category: 'personnel', uploadDate: '2026-01-20', status: 'valid', fileType: 'XLSX' },
    { id: 'm6', name: '算法备案证明', category: 'qualification', uploadDate: '2024-11-01', validTo: '2025-11-01', status: 'expired', fileType: 'PDF' },
    { id: 'm7', name: '数据安全评估报告', category: 'qualification', uploadDate: '2025-03-15', validTo: '2026-03-15', status: 'expiring', fileType: 'PDF' },
    { id: 'm8', name: '科技项目验收报告', category: 'project', uploadDate: '2025-12-01', status: 'valid', fileType: 'PDF' },
];

// ==================== 材料工厂 Mock 数据 ====================
type PackageStatus = 'drafting' | 'ai_reviewing' | 'expert_reviewing' | 'ready' | 'exported';

interface MaterialPackage {
    id: string;
    policyTitle: string;
    totalItems: number;
    completedItems: number;
    status: PackageStatus;
    lastUpdated: string;
    preReviewScore?: number;
}

const packageStatusConfig: Record<PackageStatus, { label: string; color: string }> = {
    drafting: { label: '编辑中', color: '#3182ce' },
    ai_reviewing: { label: 'AI 预审中', color: '#805ad5' },
    expert_reviewing: { label: '专家预审中', color: '#d69e2e' },
    ready: { label: '可提交', color: '#38a169' },
    exported: { label: '已导出', color: '#718096' },
};

const packagesData: MaterialPackage[] = [
    { id: 'pkg1', policyTitle: '人工智能算力平台专项补贴', totalItems: 8, completedItems: 8, status: 'ready', lastUpdated: '2026-03-01', preReviewScore: 92 },
    { id: 'pkg2', policyTitle: '企业研发机构与创新平台奖励', totalItems: 12, completedItems: 7, status: 'drafting', lastUpdated: '2026-03-03' },
    { id: 'pkg3', policyTitle: '苏州市智改数转专项资金', totalItems: 10, completedItems: 10, status: 'ai_reviewing', lastUpdated: '2026-02-28', preReviewScore: 78 },
    { id: 'pkg4', policyTitle: '大模型专项扶持计划', totalItems: 15, completedItems: 15, status: 'exported', lastUpdated: '2025-11-15', preReviewScore: 88 },
];

// ==================== 组件 ====================

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<'records' | 'materials' | 'factory'>('records');
    const [materialFilter, setMaterialFilter] = useState<MaterialCategory | 'all'>('all');

    const filteredMaterials = materialFilter === 'all'
        ? materialsData
        : materialsData.filter(m => m.category === materialFilter);

    const tabs = [
        { key: 'records' as const, label: '申报记录', count: applicationsData.length },
        { key: 'materials' as const, label: '素材管理', count: materialsData.length },
        { key: 'factory' as const, label: '材料工厂', count: packagesData.length },
    ];

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

            {/* Tab Content */}
            {activeTab === 'records' && (
                <div className="space-y-4">
                    {/* Stats overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: '进行中', value: applicationsData.filter(a => !['passed', 'rejected'].includes(a.status)).length, color: '#3182ce' },
                            { label: '已通过', value: applicationsData.filter(a => a.status === 'passed').length, color: '#38a169' },
                            { label: '未通过', value: applicationsData.filter(a => a.status === 'rejected').length, color: '#e53e3e' },
                            { label: '总申报', value: applicationsData.length, color: '#718096' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                                <div className="text-2xl font-black mt-1" style={{ color: stat.color }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Application Cards */}
                    {applicationsData.map(app => {
                        const sc = statusConfig[app.status];
                        return (
                            <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex">
                                    {/* Left stripe */}
                                    <div className="w-2 shrink-0" style={{ backgroundColor: sc.color }}></div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 md:p-6">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: sc.color, backgroundColor: sc.bgColor }}>
                                                        {sc.label}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">{app.submitDate} 提交</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 leading-snug">{app.policyTitle}</h3>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <div className="text-[11px] text-slate-400 font-medium">预估扶持额</div>
                                                <div className="text-xl font-black text-slate-800">{app.amount}</div>
                                            </div>
                                        </div>

                                        {/* Metadata */}
                                        <div className="flex items-center gap-5 mb-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 opacity-60" />
                                                <span>{app.agency}</span>
                                            </div>
                                            {app.estimatedResult && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 opacity-60" />
                                                    <span>预估结果：{app.estimatedResult}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${app.progress}%`, backgroundColor: sc.color }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{app.progress}%</span>
                                        </div>
                                    </div>

                                    {/* Right buttons */}
                                    <div className="shrink-0 w-40 border-l border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-4 gap-2.5">
                                        <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors duration-200" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                            <Eye className="w-4 h-4" />
                                            查看详情
                                        </button>
                                        {['generating', 'pre_reviewed', 'returned'].includes(app.status) && (
                                            <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
                                                <Edit3 className="w-3.5 h-3.5" />
                                                继续编辑
                                            </button>
                                        )}
                                        {app.status === 'pending_submit' && (
                                            <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
                                                <ArrowRight className="w-3.5 h-3.5" />
                                                前往申报
                                            </button>
                                        )}
                                        {['reviewing', 'passed', 'rejected'].includes(app.status) && (
                                            <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
                                                <ImageIcon className="w-3.5 h-3.5" />
                                                上传凭证
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                <Upload className="w-4 h-4" />
                                上传素材
                            </button>
                        </div>
                    </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredMaterials.map(mat => {
                            const cat = categoryConfig[mat.category];
                            const ms = materialStatusConfig[mat.status];
                            const CatIcon = cat.icon;
                            return (
                                <div key={mat.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15` }}>
                                        <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-800 truncate">{mat.name}</div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span>{mat.fileType}</span>
                                            <span>{mat.uploadDate}</span>
                                            {mat.validTo && (
                                                <span style={{ color: ms.color }} className="font-semibold">{ms.label}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
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
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'factory' && (
                <div className="space-y-4">
                    {/* Create new package */}
                    <button className="w-full bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 p-6 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 transition-all group">
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">选择政策，生成新材料包</span>
                    </button>

                    {/* Package Cards */}
                    {packagesData.map(pkg => {
                        const ps = packageStatusConfig[pkg.status];
                        const progress = Math.round((pkg.completedItems / pkg.totalItems) * 100);
                        return (
                            <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex">
                                    {/* Left stripe */}
                                    <div className="w-2 shrink-0" style={{ backgroundColor: ps.color }}></div>

                                    {/* Content */}
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
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%`, backgroundColor: ps.color }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{progress}%</span>
                                        </div>
                                    </div>

                                    {/* Right buttons */}
                                    <div className="shrink-0 w-40 border-l border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-4 gap-2.5">
                                        {pkg.status === 'drafting' && (
                                            <>
                                                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                                    <Sparkles className="w-4 h-4" />
                                                    AI 生成
                                                </button>
                                                <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    在线编辑
                                                </button>
                                            </>
                                        )}
                                        {pkg.status === 'ai_reviewing' && (
                                            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                                <Eye className="w-4 h-4" />
                                                查看预审
                                            </button>
                                        )}
                                        {pkg.status === 'ready' && (
                                            <>
                                                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                                    <Download className="w-4 h-4" />
                                                    导出材料
                                                </button>
                                                <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    继续修改
                                                </button>
                                            </>
                                        )}
                                        {pkg.status === 'exported' && (
                                            <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                重新导出
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
