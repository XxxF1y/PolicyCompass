import { useEffect, useState, useRef } from 'react';
import { X, Download, CheckCircle2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GenerateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string | null;
}

type GenerationState = 'idle' | 'analyzing' | 'matching' | 'generating' | 'success' | 'error';

export default function GenerateProposalModal({ isOpen, onClose, targetId }: GenerateProposalModalProps) {
    const [genState, setGenState] = useState<GenerationState>('idle');
    const [proposalMarkdown, setProposalMarkdown] = useState<string>('');
    const contentRef = useRef<HTMLDivElement>(null);

    // Mock Backend Generation Process
    useEffect(() => {
        if (!isOpen || !targetId) {
            setGenState('idle');
            setProposalMarkdown('');
            return;
        }

        let isMounted = true;

        const startGeneration = async () => {
            setGenState('analyzing');
            await new Promise(r => setTimeout(r, 1500));
            if (!isMounted) return;

            setGenState('matching');
            await new Promise(r => setTimeout(r, 1500));
            if (!isMounted) return;

            setGenState('generating');

            // Text streaming simulation
            const fullMockMarkdown = `
# 智能招商落地执行方案: ${targetId === '1' ? '某AI芯片设计公司' : '某智能算法科技公司'}

## 1. 战略招引逻辑 (Why?)
- **补链强链分析**：本项目高度契合园区“软硬协同”产业布局，能有效填补现有生态链空白区域。
- **生态协同价值**：预计落户后，可直接赋能园区内 ${targetId === '1' ? '45' : '20+'} 家下游应用型企业。
- **财务与成长性**：目标企业现金流健康，处于高速成长期，有望在 3 年内成为区域独角兽。

## 2. 定制化政策包 (What we offer?)
根据系统测算，建议向其提供以下组合支持方案作为谈判筹码：

| 政策资源类型 | 额度预测 | 发放形式 | 条件要求 |
| :--- | :--- | :--- | :--- |
| **落户奖励资金** | **500万元** | 现金一次付清 | [承诺实缴资本到达标准] |
| **专项算力补贴** | **100万元** | OPC社区算力券 | 限定在公共算力中心使用 |
| **研发中心免租** | **首年100%** | 科创板租金减免 | 研发人员占比 > 30% |

> **AI 补充建议**：考虑到该公司目前正在积极寻优南方研发中心选址，"高端人才落户通道" 及 "核心管理层配偶就业解决机制" 可能成为一锤定音的非资金要素。

## 3. 行动路径规划 (How?)
- **Step 1 (本周)**: 发送正式意向邀请函，附带园区产业白皮书，建议由园区副主任带队拜访交流。
- **Step 2 (第 2-3 周)**: 邀请目标企业创始团队来园区实地考察，安排与园区现有 3 家关联企业的闭门沙龙。
- **Step 3 (月末)**: 正式上会审议《一企一策》定制协议，启动法务合规流程。
            `;

            let currentText = '';
            setProposalMarkdown('');

            // Simulating chunks
            const chunkSize = 15;
            for (let i = 0; i < fullMockMarkdown.length; i += chunkSize) {
                if (!isMounted) return;
                currentText += fullMockMarkdown.slice(i, i + chunkSize);
                setProposalMarkdown(currentText);

                // Auto scroll to bottom smoothly
                if (contentRef.current) {
                    contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }

                await new Promise(r => setTimeout(r, 80)); // typing speed
            }

            if (isMounted) {
                setGenState('success');
            }
        };

        startGeneration();

        return () => { isMounted = false; };
    }, [isOpen, targetId]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-adaptive-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <img src="/logo-circle.svg" alt="政策罗盘" className="w-10 h-10" />
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">AI 智能方案生成器</h2>
                            <p className="text-xs text-slate-500 font-medium">PolicyCompass Brain v2.0</p>
                        </div>
                    </div>
                    {genState === 'success' && (
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* Left Panel: Status Steps */}
                    <div className="w-full md:w-64 bg-slate-50/50 border-r border-adaptive-border p-6 shrink-0 flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">执行流程追踪</h3>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                            <StepIndicator
                                title="分析企业画像"
                                active={genState === 'analyzing'}
                                completed={['matching', 'generating', 'success'].includes(genState)}
                            />
                            <StepIndicator
                                title="匹配可用政策"
                                active={genState === 'matching'}
                                completed={['generating', 'success'].includes(genState)}
                            />
                            <StepIndicator
                                title="生成结构化方案"
                                active={genState === 'generating'}
                                completed={genState === 'success'}
                            />
                            <StepIndicator
                                title="报告已就绪"
                                active={false}
                                completed={genState === 'success'}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Markdown Result */}
                    <div
                        ref={contentRef}
                        className={`flex-1 overflow-y-auto p-8 relative ${genState === 'success' ? 'bg-white' : 'bg-slate-50/30'}`}
                    >
                        {['analyzing', 'matching'].includes(genState) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-brand-tech" />
                                <p className="font-medium animate-pulse">
                                    {genState === 'analyzing' ? '正在深度解析目标企业图谱数据...' : '正在平台库中关联最优匹配政策集...'}
                                </p>
                            </div>
                        )}

                        {['generating', 'success'].includes(genState) && (
                            <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-brand-tech hover:prose-a:text-brand-deep prose-table:border-collapse prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-td:border-b">
                                <ReactMarkdown>
                                    {proposalMarkdown}
                                </ReactMarkdown>

                                {genState === 'generating' && (
                                    <span className="inline-block w-2 h-4 bg-brand-tech animate-pulse ml-1 align-middle rounded-sm"></span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                {genState === 'success' && (
                    <div className="p-4 bg-white border-t border-adaptive-border flex items-center justify-between shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            方案已通过逻辑校验，可直接用于内外部会议展示
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                完成返回
                            </button>
                            <button
                                className="px-6 py-2.5 rounded-lg bg-brand-tech hover:bg-brand-deep font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                            >
                                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                导出为 PDF 格式
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StepIndicator({ title, active, completed }: { title: string, active: boolean, completed: boolean }) {
    return (
        <div className="relative flex items-center gap-4 group">
            <div className={`
                relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm
                transition-colors duration-300
                ${completed ? 'bg-green-500 text-white' : active ? 'bg-brand-tech text-white ring-4 ring-brand-tech/20' : 'bg-slate-200 text-slate-400'}
            `}>
                {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-transparent'}`} />}
            </div>
            <div>
                <p className={`text-sm font-bold transition-colors ${active ? 'text-brand-tech' : completed ? 'text-slate-700' : 'text-slate-400'}`}>
                    {title}
                </p>
            </div>
        </div>
    );
}
