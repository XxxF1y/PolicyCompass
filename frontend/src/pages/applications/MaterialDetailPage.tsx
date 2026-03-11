import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Lightbulb,
    Eye,
    Edit3,
    Upload,
    Download,
    Sparkles,
    ExternalLink,
    Star,
    RefreshCw,
    Users as UsersIcon,
    Building2,
    Bookmark,
} from 'lucide-react';
import type { MaterialDetailData, ChecklistItem } from '../../types/application';
import { ApplicationService } from '../../services/applicationService';

export default function MaterialDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<MaterialDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const detail = await ApplicationService.getMaterialDetail(id || '');
                setData(detail);
            } catch (error) {
                console.error("Failed to fetch material detail", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-16 animate-pulse space-y-6 pt-4">
                <div className="h-8 bg-slate-100 rounded-lg w-40"></div>
                <div className="h-12 bg-slate-100 rounded-xl w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-48"></div>
                <div className="h-64 bg-slate-100 rounded-xl w-full"></div>
                <div className="h-48 bg-slate-100 rounded-xl w-full"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-16 pt-4">
                <p className="text-slate-500">未找到该申报记录。</p>
            </div>
        );
    }

    const readyCount = data.checklist.filter(i => i.status === 'ready').length;
    const warningCount = data.checklist.filter(i => i.status === 'warning').length;
    const missingCount = data.checklist.filter(i => i.status === 'missing').length;

    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-16 animate-fade-in space-y-6">

            {/* Back button */}
            <button
                onClick={() => navigate('/applications')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium -mb-2"
            >
                <ArrowLeft className="w-4 h-4" />
                返回申报中心
            </button>

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">生成申报材料</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">{data.policyTitle}</span>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 opacity-60" />
                        <span>{data.agency}</span>
                    </div>
                </div>
            </div>

            {/* Completeness Progress */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-slate-700">材料完整度</div>
                    <div className="text-sm font-bold" style={{ color: data.completeness >= 80 ? '#38a169' : data.completeness >= 50 ? '#d69e2e' : '#e53e3e' }}>
                        {data.completeness}%
                    </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${data.completeness}%`,
                            backgroundColor: data.completeness >= 80 ? '#38a169' : data.completeness >= 50 ? '#d69e2e' : '#e53e3e',
                        }}
                    ></div>
                </div>
                <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        已就绪 {readyCount} 项
                    </span>
                    <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        待补充 {warningCount} 项
                    </span>
                    <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        缺失 {missingCount} 项
                    </span>
                </div>
            </div>

            {/* ===== 材料清单 ===== */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        所需材料清单
                    </h2>
                </div>

                <div className="divide-y divide-slate-100">
                    {data.checklist.map((item: ChecklistItem, idx: number) => (
                        <div key={idx} className="px-5 py-3.5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                            {/* Index */}
                            <span className="text-xs font-bold text-slate-400 mt-0.5 w-6 text-center shrink-0">{idx + 1}</span>

                            {/* Status Icon */}
                            <div className="shrink-0 mt-0.5">
                                {item.status === 'ready' && <CheckCircle2 className="w-4.5 h-4.5 text-green-500" />}
                                {item.status === 'warning' && <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />}
                                {item.status === 'missing' && <AlertCircle className="w-4.5 h-4.5 text-red-500" />}
                            </div>

                            {/* Name & Source */}
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-semibold ${item.status === 'missing' ? 'text-red-700' : item.status === 'warning' ? 'text-amber-700' : 'text-slate-800'
                                    }`}>
                                    {item.name}
                                </div>
                                {item.source && (
                                    <div className="text-xs text-slate-400 mt-1">└─ {item.source}</div>
                                )}
                                {item.note && (
                                    <div className="text-xs mt-1" style={{ color: item.status === 'missing' ? '#c53030' : '#b7791f' }}>
                                        └─ {item.note}
                                    </div>
                                )}
                            </div>

                            {/* Status Label */}
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${item.status === 'ready' ? 'text-green-700 bg-green-50' :
                                item.status === 'warning' ? 'text-amber-700 bg-amber-50' :
                                    'text-red-700 bg-red-50'
                                }`}>
                                {item.status === 'ready' ? '已就绪' : item.status === 'warning' ? '待补充' : '缺失'}
                            </span>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                                {item.status === 'ready' && (
                                    <>
                                        <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors" title="预览">
                                            <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors" title="编辑">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                )}
                                {(item.status === 'warning' || item.status === 'missing') && (
                                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                        <Upload className="w-3 h-3" />
                                        上传
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== 智能建议 ===== */}
            {data.smartSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-blue-500" />
                        智能建议
                    </h3>
                    <ul className="space-y-2">
                        {data.smartSuggestions.map((sug, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                                <span className="text-blue-400 mt-0.5">•</span>
                                <span>{sug}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ===== 操作按钮 (未定稿时) ===== */}
            {!data.isFinalized && (
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                        <Sparkles className="w-4 h-4" />
                        生成申报材料包
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        提交 AI 预审
                    </button>
                </div>
            )}

            {/* ===== AI 预审报告 ===== */}
            {data.preReviewReport && data.preReviewScore !== undefined && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            AI 预审报告
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">预审评分</span>
                            <span className="text-2xl font-black" style={{
                                color: data.preReviewScore >= 85 ? '#38a169' : data.preReviewScore >= 70 ? '#d69e2e' : '#e53e3e',
                            }}>
                                {data.preReviewScore}<span className="text-sm font-bold">分</span>
                            </span>
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        {/* Errors */}
                        {data.preReviewReport.errors.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    🔴 错误（需修正）
                                </div>
                                <div className="space-y-2">
                                    {data.preReviewReport.errors.map((err, i) => (
                                        <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3.5 flex items-start justify-between gap-4">
                                            <span className="text-sm text-red-700">{i + 1}. {err}</span>
                                            <button className="shrink-0 text-xs font-semibold text-red-600 bg-white border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                                                一键修正
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Warnings */}
                        {data.preReviewReport.warnings.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    🟡 警告（建议优化）
                                </div>
                                <div className="space-y-2">
                                    {data.preReviewReport.warnings.map((warn, i) => (
                                        <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-3.5">
                                            <span className="text-sm text-amber-700">{i + 1}. {warn}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {data.preReviewReport.suggestions.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    💡 建议（可提升通过率）
                                </div>
                                <div className="space-y-2">
                                    {data.preReviewReport.suggestions.map((sug, i) => (
                                        <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-3.5">
                                            <span className="text-sm text-blue-700">{i + 1}. {sug}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {!data.isFinalized && (
                            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    在线编辑修改
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    重新 AI 预审
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors">
                                    <UsersIcon className="w-3.5 h-3.5" />
                                    提交人工专家预审
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== 材料已定稿 ===== */}
            {data.isFinalized && (
                <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-green-800 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                ✅ 材料已定稿
                            </h2>
                            {data.finalScore !== undefined && (
                                <div className="text-right">
                                    <div className="text-xs text-green-600">最终预审评分</div>
                                    <div className="text-2xl font-black text-green-700">
                                        {data.finalScore}<span className="text-sm">分</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-green-700 mb-4">所有错误已修正，材料质量良好。</p>

                        {data.redirectUrl && (
                            <div className="bg-white rounded-lg border border-green-200 p-4 mb-4">
                                <p className="text-sm text-green-800 mb-1">请前往官方申报平台完成申报：</p>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <ExternalLink className="w-4 h-4" />
                                    <a href={data.redirectUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold underline hover:text-blue-800 transition-colors">
                                        🔗 {data.redirectLabel || data.redirectUrl}
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                                <Download className="w-4 h-4" />
                                下载材料包（ZIP）
                            </button>
                            {data.redirectUrl && (
                                <button
                                    onClick={() => window.open(data.redirectUrl, '_blank')}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-green-700 bg-white border border-green-300 hover:bg-green-50 shadow-sm transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    前往申报平台 ↗
                                </button>
                            )}
                        </div>

                        {/* Incentive */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                            <span className="text-xs text-amber-700 font-medium">
                                前往申报平台后，请及时反馈审核结果，可获得 <strong>50 积分</strong> 奖励
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Bookmark */}
            <div className="flex justify-center pt-4">
                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-600 transition-colors">
                    <Bookmark className="w-4 h-4" />
                    收藏政策
                </button>
            </div>
        </div>
    );
}
