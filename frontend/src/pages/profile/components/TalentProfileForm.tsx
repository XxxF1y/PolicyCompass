import { User, BookOpen, Rocket, Award, Cpu } from 'lucide-react';

export default function TalentProfileForm() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {/* Column 1: Basic Info */}
            <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                    <User className="w-4 h-4 text-brand-tech" /> 基础与教育信息
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">姓名 *</label>
                        <input type="text" defaultValue="张三" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">身份证号 *</label>
                        <input type="text" defaultValue="11010519900101XXXX" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">最高学历 *</label>
                        <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                            <option>博士研究生</option>
                            <option>硕士研究生</option>
                            <option>本科</option>
                            <option>其他</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">毕业院校与专业 *</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" defaultValue="清华大学" placeholder="院校" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            <input type="text" defaultValue="计算机科学与技术" placeholder="专业" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2: Career & Outputs */}
            <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                    <BookOpen className="w-4 h-4 text-brand-tech" /> 职业经历与成果产出
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">当前职位 / 所属企业</label>
                        <input type="text" defaultValue="AI 算法研究员" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all mb-2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">工作年限</label>
                        <input type="number" defaultValue={5} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                                <Award className="w-3 h-3 text-success" /> 专利数
                            </label>
                            <input type="number" defaultValue={3} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                                <Award className="w-3 h-3 text-success" /> 论文数 (SCI/EI)
                            </label>
                            <input type="number" defaultValue={5} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">人才计划 / 职称等级</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">高级工程师</span>
                            <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">市级领军人才</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 3: OPC Startup Info */}
            <div className="bg-brand-tech/5 border border-brand-tech/20 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-tech/10 rounded-full blur-3xl"></div>
                <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-brand-tech/20 pb-3 mb-4">
                    <Rocket className="w-4 h-4 text-brand-tech" /> OPC创业与算力需求
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-deep mb-1.5 pl-1">是否 OPC 创业者</label>
                        <select className="w-full bg-white border border-brand-tech/30 rounded-lg px-3 py-2 text-sm text-brand-tech font-bold focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                            <option value="yes">是, 我是超级个体</option>
                            <option value="no">否</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">AI 核心技术方向</label>
                        <select className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                            <option>大模型与智能体 (LLM / Agent)</option>
                            <option>计算机视觉 (CV)</option>
                            <option>自然语言处理 (NLP)</option>
                            <option>AI+垂直行业</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">OPC 创业阶段</label>
                        <select className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                            <option>初创期 (寻找种子轮/孵化)</option>
                            <option>种子期 (概念验证中)</option>
                            <option>发展期 (已有MVP跑通)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-brand-tech" /> 算力需求预估
                        </label>
                        <select className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                            <option>中等规模训练 (依赖算力券)</option>
                            <option>轻量级推理</option>
                            <option>大规模训练</option>
                            <option>无特别需求</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
