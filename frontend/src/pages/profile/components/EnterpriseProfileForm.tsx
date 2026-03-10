import { Building2, Coins, ShieldCheck, AlertCircle, Users, Award, Briefcase, Zap } from 'lucide-react';

export default function EnterpriseProfileForm() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {/* Column 1: Basic Info & Operational Data */}
            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Building2 className="w-4 h-4 text-brand-tech" /> 基础架构与行业
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">企业名称 *</label>
                            <input type="text" defaultValue="XX未来科技有限公司" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">统一社会信用代码 *</label>
                            <input type="text" defaultValue="91320500MA1XXXXX" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">成立日期 *</label>
                                <input type="date" defaultValue="2020-03-15" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">注册资本(万) *</label>
                                <input type="number" defaultValue={500} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">所属行业 *</label>
                            <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>软件和信息技术服务业</option>
                                <option>人工智能硬件制造</option>
                                <option>互联网平台服务</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">企业阶段 (系统自动计算)</label>
                            <input type="text" disabled defaultValue="成长期" className="w-full bg-adaptive-panel border border-adaptive-border border-dashed rounded-lg px-3 py-2 text-sm text-brand-tech font-bold cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Coins className="w-4 h-4 text-brand-tech" /> 经营与研发数据
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-warning mb-1.5 pl-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> 上年度营收 (万元) *
                            </label>
                            <input type="number" defaultValue={1500} placeholder="必填" className="w-full bg-adaptive-bg border border-warning/50 rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-all placeholder:text-adaptive-text-muted" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">员工人数 *</label>
                                <input type="number" defaultValue={45} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">研发人员数</label>
                                <input type="number" defaultValue={20} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">研发费用 (万元)</label>
                                <input type="number" defaultValue={300} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">研发投入占比 (%)</label>
                                <input type="number" defaultValue={20} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">工业软件国产率(%)</label>
                                <input type="number" defaultValue={85} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">CMMM评估等级</label>
                                <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option>无</option>
                                    <option>一级</option>
                                    <option>二级 (规范级)</option>
                                    <option>三级 (集成级)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2: Qualifications, IP & Compliance */}
            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Award className="w-4 h-4 text-brand-tech" /> 通用资质与知识产权
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">高新技术企业</label>
                                <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option>已认定</option>
                                    <option>未认定</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">专精特新</label>
                                <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option>省级专精特新</option>
                                    <option>国家小巨人</option>
                                    <option>无</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">科小入库</label>
                                <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option>已入库</option>
                                    <option>未入库</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">数据资产入表</label>
                                <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option>未完成</option>
                                    <option>已完成评测</option>
                                    <option>已入表</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">发明专利数</label>
                                <input type="number" defaultValue={5} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">软著数</label>
                                <input type="number" defaultValue={18} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <ShieldCheck className="w-4 h-4 text-brand-tech" /> AI专属合规状态
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-adaptive-bg border border-adaptive-border p-2.5 rounded-lg">
                            <span className="text-sm font-medium text-adaptive-text">算法备案</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <span className="text-xs text-adaptive-text-muted">已备案 (2项)</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-adaptive-bg border border-adaptive-border p-2.5 rounded-lg">
                            <span className="text-sm font-medium text-adaptive-text">大模型备案</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-warning"></span>
                                <span className="text-xs text-adaptive-text-muted">申请中</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-adaptive-bg border border-adaptive-border p-2.5 rounded-lg">
                            <span className="text-sm font-medium text-adaptive-text">生成式AI服务登记</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-adaptive-border-light"></span>
                                <span className="text-xs text-adaptive-text-muted">未办理</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-adaptive-bg border border-adaptive-border p-2.5 rounded-lg">
                            <span className="text-sm font-medium text-adaptive-text">数据安全评估</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <span className="text-xs text-adaptive-text-muted">已通过认证</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-adaptive-bg border border-adaptive-border p-2.5 rounded-lg">
                            <span className="text-sm font-medium text-adaptive-text">数字人直播合规备案</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-adaptive-border-light"></span>
                                <span className="text-xs text-adaptive-text-muted">不适用</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-adaptive-bg border border-adaptive-border p-2.5 rounded-lg">
                            <span className="text-sm font-medium text-adaptive-text">AI伦理审查</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-adaptive-border-light"></span>
                                <span className="text-xs text-adaptive-text-muted">未启动</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 3: OPC Information */}
            <div className="space-y-6">
                <div className="bg-brand-tech/5 border border-brand-tech/20 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-tech/10 rounded-full blur-3xl"></div>
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-brand-tech/20 pb-3 mb-4 relative z-10">
                        <Zap className="w-4 h-4 text-brand-tech" /> OPC企业与路线图
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-brand-deep mb-1.5 pl-1">是否 OPC 企业</label>
                            <select className="w-full bg-white border border-brand-tech/30 rounded-lg px-3 py-2 text-sm text-brand-tech font-bold focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option value="yes">是 (极微型科技组织)</option>
                                <option value="no">否</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1"><Users className="w-3 h-3" /> 团队规模 *</label>
                                <input type="number" defaultValue={3} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">OPC创业阶段 *</label>
                                <select className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option>种子期</option>
                                    <option>初创期</option>
                                    <option>发展期</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> 入驻OPC社区</label>
                            <select className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>上海徐汇智算OPC社区</option>
                                <option>深圳前海梦工场</option>
                                <option>未入驻</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">AI技术方向 *</label>
                            <div className="flex flex-col gap-2 bg-white border border-adaptive-border rounded-lg p-2 max-h-32 overflow-y-auto">
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" defaultChecked className="rounded text-brand-tech" /> 大模型/智能体</label>
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" defaultChecked className="rounded text-brand-tech" /> AI+工具/开发生态</label>
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" className="rounded text-brand-tech" /> AI内容创作 (AIGC)</label>
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" className="rounded text-brand-tech" /> AI+医疗/制造</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">AI产品/服务类型</label>
                            <input type="text" defaultValue="代码智能协作AI Agent平台" placeholder="一句话描述核心产品" className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">算力使用情况</label>
                            <select className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>租用云算力</option>
                                <option>自建轻量级服务器</option>
                                <option>使用政策算力券抵扣</option>
                                <option>无高频算力需求</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">已获 OPC 补贴 (折合万元)</label>
                            <div className="flex items-center gap-2 bg-white border border-adaptive-border rounded-lg p-2">
                                <span className="text-xs bg-brand-tech/10 text-brand-tech px-2 py-1 rounded">算力券: 15万</span>
                                <span className="text-xs bg-brand-tech/10 text-brand-tech px-2 py-1 rounded">模型券: 5万</span>
                                <button className="ml-auto text-xs text-brand-tech font-medium hover:underline">+ 补充</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
