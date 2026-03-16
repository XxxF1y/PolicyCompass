import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PolicyService } from '../../services/policyService';
import type { PolicyDetail } from '../../types/policy';

export default function PolicyBlockerPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [policy, setPolicy] = useState<PolicyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            setIsLoading(true);
            try {
                const data = await PolicyService.getPolicyDetail(id || 'p1');
                setPolicy(data);
            } catch (e) {
                console.error('Failed to load blocker page', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPolicy();
    }, [id]);

    const focusId = searchParams.get('focus');
    const blockerCards = useMemo(() => {
        if (!policy) return [];
        return policy.blockerDetails || [];
    }, [policy]);

    if (isLoading || !policy) {
        return (
            <div className="space-y-4 max-w-5xl mx-auto animate-pulse">
                <div className="h-6 w-40 bg-slate-100 rounded" />
                <div className="h-40 bg-slate-100 rounded-xl" />
                <div className="h-40 bg-slate-100 rounded-xl" />
            </div>
        );
    }

    const unmetCount = policy.conditions.required.filter((c) => !c.met).length;
    const fulfilled = policy.conditions.required.filter((c) => c.met).map((c) => c.text);
    const afterScore = Math.min(100, policy.matchScore + unmetCount * 10);
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate(`/policy/${policy.id}`);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div
                className="flex items-center gap-2 text-adaptive-text-muted hover:text-brand-tech cursor-pointer w-fit transition-colors"
                onClick={handleBack}
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">返回</span>
            </div>

            <div className="bg-white rounded-2xl border border-adaptive-border p-6">
                <h1 className="text-2xl font-bold text-brand-deep">{policy.title} - 卡点分析</h1>
                <p className="text-sm text-slate-500 mt-2">当前匹配度：{policy.matchScore}% → 补齐后：{afterScore}%</p>
            </div>

            <div className="space-y-4">
                {blockerCards.length === 0 && (
                    <div className="bg-white rounded-2xl border border-green-100 p-5 text-green-700">
                        当前政策暂无卡点，已满足主要申报条件。
                    </div>
                )}
                {blockerCards.map((b, idx) => (
                    <div
                        key={b.id}
                        className={`bg-white rounded-2xl border p-5 ${focusId && (focusId === b.id || focusId === String(idx)) ? 'border-brand-tech shadow-md' : 'border-adaptive-border'}`}
                    >
                        <h2 className="font-bold text-red-600 flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4" />
                            卡点{idx + 1}：{b.title}
                        </h2>
                        <div className="space-y-2 text-sm text-slate-700">
                            <p><span className="font-semibold">条件要求：</span>{b.requirement}</p>
                            <p><span className="font-semibold">当前情况：</span>{b.currentStatus}</p>
                            <p><span className="font-semibold">差距：</span>{b.gap}</p>
                            <div>
                                <p className="font-semibold mb-1">改进建议：</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {b.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <p><span className="font-semibold">预计成本：</span>{b.estimatedCost}</p>
                            <p><span className="font-semibold">预计周期：</span>{b.estimatedTimeline}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-adaptive-border p-5">
                <h3 className="font-bold text-brand-deep mb-3">已满足条件</h3>
                <div className="space-y-2">
                    {fulfilled.map((text, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {text}
                        </div>
                    ))}
                    {fulfilled.length === 0 && <p className="text-sm text-slate-500">暂无已满足条件</p>}
                </div>
            </div>
        </div>
    );
}
