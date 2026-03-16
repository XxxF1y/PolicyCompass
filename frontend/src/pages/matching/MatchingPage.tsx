import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    AlertCircle,
    Search,
    Lock,
    Building2,
    Users,
    MapPin,
    Tag,
    Eye,
    Star,
} from 'lucide-react';

import { PolicyService } from '../../services/policyService';
import type { MatchPolicy } from '../../types/policy';

type FilterValue = '全部' | string;

const filterConfig = {
    policyLevel: ['全部', '国家', '省', '市', '区', '园区'],
    supportType: ['全部', '资金补贴', '资质认定', '税收优惠', '人才补贴', '设备补贴', '场景开放'],
    supportDomain: ['全部', '算力', '技术', '场景', '人才', '生态'],
    applicableTarget: ['全部', '人才', '科技企业', '转型企业', '园区', 'OPC创业者'],
    departmentCategory: ['全部', '工信部', '网信办', '数据局', '人社部', '财政部', '发改委', '科技部', '市监局', '园区/OPC社区'],
    policyStatus: ['全部', '申报中', '即将开始', '已截止', '已失效'],
    policySource: ['全部', '政府发布', '园区发布'],
    opcRelated: ['全部', '仅OPC政策'],
    region: ['全部', '全国', '深圳', '苏州', '北京', '上海', '南京', '杭州', '其他'],
} as const;

export default function MatchingPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | '100' | 'opc'>('all');
    const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>('keyword');
    const [searchText, setSearchText] = useState('');
    const [policiesData, setPoliciesData] = useState<MatchPolicy[]>([]);
    const [filters, setFilters] = useState<{
        policyLevel: FilterValue;
        supportType: FilterValue;
        supportDomain: FilterValue;
        applicableTarget: FilterValue;
        departmentCategory: FilterValue;
        policyStatus: FilterValue;
        policySource: FilterValue;
        opcRelated: FilterValue;
        region: FilterValue;
    }>({
        policyLevel: '全部',
        supportType: '全部',
        supportDomain: '全部',
        applicableTarget: '全部',
        departmentCategory: '全部',
        policyStatus: '全部',
        policySource: '全部',
        opcRelated: '全部',
        region: '全部',
    });

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await PolicyService.getMatchedPolicies();
                setPoliciesData(data);
            } catch (error) {
                console.error('Failed to fetch policies:', error);
            }
        };
        fetchPolicies();
    }, []);

    const handleToggleFavorite = async (policyId: string) => {
        const before = policiesData;
        const current = policiesData.find((p) => p.id === policyId)?.isFavorited ?? false;
        setPoliciesData((prev) => prev.map((p) => (p.id === policyId ? { ...p, isFavorited: !current } : p)));
        try {
            await PolicyService.toggleFavorite(policyId, current);
        } catch (e) {
            console.error('Failed to toggle favorite:', e);
            setPoliciesData(before);
        }
    };

    const filteredPolicies = useMemo(() => {
        return policiesData.filter((p) => {
            if (searchText.trim()) {
                const q = searchText.trim().toLowerCase();
                const keywordHaystack = `${p.title} ${p.agency} ${p.matchReason || ''}`.toLowerCase();
                const semanticHaystack = `${p.title} ${p.matchReason || ''} ${p.tags.join(' ')} ${p.supportType || ''} ${p.supportDomain || ''}`.toLowerCase();
                if (searchMode === 'keyword' && !keywordHaystack.includes(q)) return false;
                if (searchMode === 'semantic' && !semanticHaystack.includes(q)) return false;
            }
            if (activeTab === '100' && p.matchScore !== 100) return false;
            if (activeTab === 'opc' && !p.isOpcExclusive) return false;

            if (filters.policyLevel !== '全部' && p.policyLevel !== filters.policyLevel) return false;
            if (filters.supportType !== '全部' && p.supportType !== filters.supportType) return false;
            if (filters.supportDomain !== '全部' && p.supportDomain !== filters.supportDomain) return false;
            if (filters.applicableTarget !== '全部' && p.applicableTarget !== filters.applicableTarget) return false;
            if (filters.departmentCategory !== '全部' && p.departmentCategory !== filters.departmentCategory) return false;
            if (filters.policyStatus !== '全部' && p.policyStatus !== filters.policyStatus) return false;
            if (filters.policySource !== '全部' && p.policySource !== filters.policySource) return false;
            if (filters.region !== '全部' && p.region !== filters.region) return false;
            if (filters.opcRelated === '仅OPC政策' && !p.isOpcPolicy) return false;
            return true;
        });
    }, [policiesData, searchText, searchMode, activeTab, filters]);

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#38a169';
        if (score >= 70) return '#3182ce';
        if (score >= 50) return '#ed8936';
        return '#718096';
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                            政策广场
                            <Target className="w-6 h-6 text-blue-500" />
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            支持关键词搜索、语义搜索，以及按 PRD 2.4.1 维度进行分类筛选。
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-8">
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">当前结果</span>
                    <span className="text-3xl font-black text-slate-800 ml-2">{filteredPolicies.length}</span>
                    <span className="text-sm text-slate-500">项</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">收藏政策</span>
                    <span className="text-3xl font-black text-emerald-600 ml-2">{policiesData.filter((p) => p.isFavorited).length}</span>
                    <span className="text-sm text-emerald-600">项</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder={searchMode === 'semantic' ? '语义搜索：描述你的政策需求' : '关键词搜索：输入政策名称、部门、标签'}
                        className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                </div>
                <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                    <button
                        onClick={() => setSearchMode('keyword')}
                        className={`px-3 py-2 text-xs font-semibold transition-colors ${searchMode === 'keyword' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        关键词搜索
                    </button>
                    <button
                        onClick={() => setSearchMode('semantic')}
                        className={`px-3 py-2 text-xs font-semibold transition-colors ${searchMode === 'semantic' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        语义搜索
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'all' ? 'shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                    style={activeTab === 'all' ? { backgroundColor: '#2563eb', color: '#ffffff' } : {}}
                >
                    全部
                </button>
                <button
                    onClick={() => setActiveTab('100')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === '100' ? 'text-white bg-emerald-600 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >
                    100% 极度吻合
                </button>
                <button
                    onClick={() => setActiveTab('opc')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'opc' ? 'text-white bg-slate-700 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >
                    <Building2 className="w-4 h-4" />
                    OPC 专属
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FilterRow label="政策层级" options={filterConfig.policyLevel} value={filters.policyLevel} onChange={(v) => setFilters((f) => ({ ...f, policyLevel: v }))} />
                    <FilterRow label="支持类型" options={filterConfig.supportType} value={filters.supportType} onChange={(v) => setFilters((f) => ({ ...f, supportType: v }))} />
                    <FilterRow label="支持领域" options={filterConfig.supportDomain} value={filters.supportDomain} onChange={(v) => setFilters((f) => ({ ...f, supportDomain: v }))} />
                    <FilterRow label="适用对象" options={filterConfig.applicableTarget} value={filters.applicableTarget} onChange={(v) => setFilters((f) => ({ ...f, applicableTarget: v }))} />
                    <FilterRow label="部门归口" options={filterConfig.departmentCategory} value={filters.departmentCategory} onChange={(v) => setFilters((f) => ({ ...f, departmentCategory: v }))} />
                    <FilterRow label="政策状态" options={filterConfig.policyStatus} value={filters.policyStatus} onChange={(v) => setFilters((f) => ({ ...f, policyStatus: v }))} />
                    <FilterRow label="政策来源" options={filterConfig.policySource} value={filters.policySource} onChange={(v) => setFilters((f) => ({ ...f, policySource: v }))} />
                    <FilterRow label="OPC相关" options={filterConfig.opcRelated} value={filters.opcRelated} onChange={(v) => setFilters((f) => ({ ...f, opcRelated: v }))} />
                    <FilterRow label="地区" options={filterConfig.region} value={filters.region} onChange={(v) => setFilters((f) => ({ ...f, region: v }))} />
                </div>
            </div>

            <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                    <div
                        key={policy.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200 overflow-hidden"
                    >
                        <div className="flex">
                            <div className="w-2 shrink-0 rounded-l-xl" style={{ backgroundColor: policy.blockers && policy.blockers.length > 0 ? '#ed8936' : '#38a169' }} />
                            <div className="flex-1 p-5 md:p-6">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            {policy.tags.map((tag) => (
                                                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                            {policy.policyStatus && (
                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                                    {policy.policyStatus}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-snug">{policy.title}</h3>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <div className="text-[11px] text-slate-400 font-medium mb-0.5">智能匹配度</div>
                                        <div className="text-3xl font-black tracking-tight" style={{ color: getScoreColor(policy.matchScore) }}>
                                            {policy.matchScore}<span className="text-lg">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 mb-4 text-sm text-slate-500 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 opacity-60" />
                                        <span>{policy.agency}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 opacity-60" />
                                        <span>{policy.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 opacity-60" />
                                        <span>{policy.applicableTarget || '科技企业'}</span>
                                    </div>
                                </div>

                                {policy.matchReason && (
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-2.5">
                                            <div className="mt-0.5 shrink-0">
                                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-600 mb-1">匹配理由</div>
                                                <p className="text-sm text-slate-600 leading-relaxed">{policy.matchReason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {policy.blockers && policy.blockers.length > 0 && (
                                    <div className="space-y-2">
                                        {policy.blockers.map((blocker, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-lg flex items-start gap-2.5 border text-sm ${blocker.isLogicLock ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-100'}`}
                                            >
                                                <div className={`mt-0.5 shrink-0 ${blocker.isLogicLock ? 'text-orange-500' : 'text-blue-500'}`}>
                                                    {blocker.isLogicLock ? <Lock className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold ${blocker.isLogicLock ? 'text-orange-700' : 'text-slate-700'}`}>
                                                        {blocker.isLogicLock && (
                                                            <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded text-[10px] bg-orange-500 text-white uppercase tracking-wider align-middle">致命项</span>
                                                        )}
                                                        {blocker.message}
                                                    </span>
                                                    {blocker.gap && <p className="text-xs text-slate-500 mt-1">{blocker.gap}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="shrink-0 w-44 border-l border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-4 gap-3">
                                <button
                                    onClick={() => navigate(`/policy/${policy.id}`)}
                                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors duration-200"
                                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                                >
                                    <Eye className="w-4 h-4" />
                                    查看政策详情
                                </button>
                                <button
                                    onClick={() => { void handleToggleFavorite(policy.id); }}
                                    className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm border transition-colors duration-200 ${
                                        policy.isFavorited
                                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <Star className={`w-4 h-4 ${policy.isFavorited ? 'fill-amber-500 text-amber-500' : ''}`} />
                                    {policy.isFavorited ? '已收藏' : '收藏政策'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredPolicies.length === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
                        暂无符合筛选条件的政策
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterRow({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: readonly string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            value === opt
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
