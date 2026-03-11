import { useEffect, useState } from 'react';
import type { TargetDetail, PolicyMatch } from '../../../types/dashboard';
import { X, Building2, Briefcase, TrendingUp, CheckCircle2, Award, ArrowRight, Activity, Zap } from 'lucide-react';

interface ViewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string | null;
    onGenerateProposal: (targetId: string) => void;
}

export default function ViewDetailsModal({ isOpen, onClose, targetId, onGenerateProposal }: ViewDetailsModalProps) {
    const [detail, setDetail] = useState<TargetDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simulated fetch
    useEffect(() => {
        if (!isOpen || !targetId) return;
        let isMounted = true;

        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                // TODO: Replace with real API call: const response = await apiClient.get(`/api/targets/${targetId}`);
                // Mocking network delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock Data based on ID
                if (isMounted) {
                    if (targetId === '1') {
                        setDetail({
                            id: 1,
                            name: '某AI芯片设计公司',
                            matchScore: "95",
                            industry: '集成电路设计 - AI芯片',
                            size: 'B轮融资、估值5亿、员工150人',
                            location: '北京中关村',
                            foundedDate: '2020-05-12',
                            legalPerson: '张三',
                            registeredCapital: '5000万人民币',
                            valuePoints: [
                                { text: '填补园区AI芯片设计空白', type: 'high' },
                                { text: '可与园区45家AI企业形成供需关系', type: 'high' },
                                { text: '正在寻找长三角研发中心选址', type: 'normal' }
                            ],
                            strategy: [
                                '重点推介园区AI产业集群优势和潜在客户资源',
                                '可提供政策：落户奖励500万 + 研发补贴 + 人才公寓'
                            ],
                            policyMatches: [
                                { name: '集成电路产业专项扶持', matchScore: 100, benefit: '最高落户奖励500万' },
                                { name: '高层次人才住房补贴', matchScore: 90, benefit: '核心团队免租公寓' }
                            ]
                        });
                    } else {
                        setDetail({
                            id: 2,
                            name: '某智能算法科技公司',
                            matchScore: "88",
                            industry: '人工智能 - 核心算法',
                            size: 'A轮融资、估值2亿、员工80人',
                            location: '深圳南山',
                            foundedDate: '2022-03-01',
                            legalPerson: '李四',
                            registeredCapital: '1000万人民币',
                            valuePoints: [
                                { text: '提升园区AI产业技术含量', type: 'high' },
                                { text: '拥有多项核心算法专利', type: 'high' },
                                { text: '近两年营收增长200%+', type: 'high' }
                            ],
                            strategy: [
                                '强调整体生态孵化能力',
                                '可提供政策：首年免租工位 + 50万算力券'
                            ],
                            policyMatches: [
                                { name: '人工智能创新应用示范区行动方案', matchScore: 95, benefit: '研发支持' },
                                { name: 'OPC平台专享算力券', matchScore: 100, benefit: '最高100万算力补贴' }
                            ]
                        });
                    }
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchDetail();

        return () => { isMounted = false; };
    }, [isOpen, targetId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            {/* Drawer Container */}
            <div className="w-full max-w-2xl h-full bg-slate-50 shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-white border-b border-adaptive-border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-tech/10 flex items-center justify-center text-brand-tech">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                {isLoading ? <div className="w-32 h-6 bg-slate-200 rounded animate-pulse" /> : detail?.name}
                            </h2>
                            {!isLoading && detail && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-brand-tech/10 text-brand-tech">
                                        <Zap className="w-3 h-3" />
                                        匹配度 {detail.matchScore}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-adaptive-border space-y-3">
                                    <div className="h-5 w-1/4 bg-slate-100 rounded animate-pulse" />
                                    <div className="h-16 w-full bg-slate-50 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : detail ? (
                        <>
                            {/* Basic Profile */}
                            <div className="bg-white p-5 rounded-xl border border-adaptive-border relative overflow-hidden">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-brand-tech" />
                                    企业基础画像
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">所属细分行业</p>
                                        <p className="text-sm font-medium text-slate-700">{detail.industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">企业规模</p>
                                        <p className="text-sm font-medium text-slate-700">{detail.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">当前位置</p>
                                        <p className="text-sm font-medium text-slate-700">{detail.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">成立时间</p>
                                        <p className="text-sm font-medium text-slate-700">{detail.foundedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">小微/专精特新</p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">科技型中小企业</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Value Points */}
                            <div className="bg-gradient-to-br from-brand-tech/5 to-white p-5 rounded-xl border border-brand-tech/10">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-amber-500" />
                                    深度招引价值解析
                                </h3>
                                <div className="space-y-3">
                                    {detail.valuePoints.map((point: { text: string, type?: 'high' | 'normal' }, index: number) => (
                                        <div key={index} className="flex gap-3 p-3 bg-white rounded-lg border border-adaptive-border-light shadow-sm">
                                            <div className="mt-0.5">
                                                <CheckCircle2 className={`w-4 h-4 ${point.type === 'high' ? 'text-green-500' : 'text-blue-500'}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{point.text}</p>
                                                {point.type === 'high' && (
                                                    <p className="text-xs text-slate-500 mt-1">此项为园区[强链/补链]核心需求目标点。</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Policy Matching */}
                            <div className="bg-white p-5 rounded-xl border border-adaptive-border">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-brand-deep" />
                                    可用政策资源组合 (落户即享)
                                </h3>
                                <div className="space-y-3">
                                    {detail.policyMatches?.map((policy: PolicyMatch, index: number) => (
                                        <div key={index} className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-tech/10 group-hover:text-brand-tech transition-colors">
                                                    <Briefcase className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-700">{policy.name}</h4>
                                                    <p className="text-xs text-brand-tech font-medium">{policy.benefit}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-slate-400">适配度</span>
                                                <span className="text-sm font-bold text-slate-700">{policy.matchScore}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="py-20 text-center text-slate-500">无法加载详情信息</div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t border-adaptive-border flex items-center justify-end gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    >
                        关闭
                    </button>
                    <button
                        onClick={() => {
                            if (targetId) {
                                onClose();
                                onGenerateProposal(targetId);
                            }
                        }}
                        disabled={isLoading || !detail}
                        className="px-6 py-2.5 rounded-lg bg-brand-tech hover:bg-brand-deep text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        AI 生成招商落地方案
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
