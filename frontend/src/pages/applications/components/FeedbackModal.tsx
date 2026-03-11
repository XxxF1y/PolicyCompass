import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, RotateCcw, Star } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    policyTitle: string;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, policyTitle, onClose }: FeedbackModalProps) {
    const [result, setResult] = useState<'passed' | 'rejected' | 'returned' | ''>('');
    const [rejectReason, setRejectReason] = useState('');
    const [grantAmount, setGrantAmount] = useState('');

    if (!isOpen) return null;

    const resultOptions = [
        { value: 'passed' as const, label: '已通过', icon: CheckCircle2, color: '#38a169', bg: '#f0fff4' },
        { value: 'rejected' as const, label: '未通过', icon: AlertTriangle, color: '#e53e3e', bg: '#fff5f5' },
        { value: 'returned' as const, label: '已退回', icon: RotateCcw, color: '#ed8936', bg: '#fffaf0' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">反馈审核结果</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Policy name */}
                    <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">政策名称</div>
                        <div className="text-sm font-bold text-slate-800">{policyTitle}</div>
                    </div>

                    {/* Result selection */}
                    <div>
                        <div className="text-xs font-medium text-slate-500 mb-3">审核结果</div>
                        <div className="grid grid-cols-3 gap-3">
                            {resultOptions.map(opt => {
                                const Icon = opt.icon;
                                const isSelected = result === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setResult(opt.value)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                            ? 'shadow-md scale-[1.02]'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                        style={isSelected ? { borderColor: opt.color, backgroundColor: opt.bg } : {}}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: isSelected ? opt.color : '#94a3b8' }} />
                                        <span className="text-sm font-semibold" style={{ color: isSelected ? opt.color : '#64748b' }}>{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Conditional fields */}
                    {result === 'returned' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-xs font-medium text-slate-500 block mb-2">退回原因</label>
                            <textarea
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="请填写退回原因..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                                rows={3}
                            />
                        </div>
                    )}

                    {result === 'passed' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-xs font-medium text-slate-500 block mb-2">拨付金额（如已拨付请填写）</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={grantAmount}
                                    onChange={e => setGrantAmount(e.target.value)}
                                    placeholder="如 20"
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                />
                                <span className="text-sm text-slate-500 font-medium">万元</span>
                            </div>
                        </div>
                    )}

                    {/* Screenshot upload */}
                    {result && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-xs font-medium text-slate-500 block mb-2">上传凭证（必填）</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-slate-400 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-slate-300" />
                                <span className="text-sm text-slate-500">请上传官方申报平台的审核结果截图</span>
                                <span className="text-xs text-slate-400">支持 JPG/PNG/PDF，单文件不超过 10MB</span>
                                <button className="mt-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
                                    点击上传
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Incentive */}
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="text-xs text-amber-700 font-medium">反馈真实审核结果可获得 <strong>50 积分</strong> 奖励</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        disabled={!result}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${result
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                            : 'bg-slate-300 cursor-not-allowed'
                            }`}
                    >
                        提交反馈
                    </button>
                </div>
            </div>
        </div>
    );
}
