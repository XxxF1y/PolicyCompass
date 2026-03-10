import { MapPin, Server, Sparkles, Navigation, Link, Activity, Building, Briefcase } from 'lucide-react';

export default function ParkProfileForm() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {/* Column 1: Park Infrastructure */}
            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <MapPin className="w-4 h-4 text-brand-tech" /> 园区基础信息
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">园区名称 *</label>
                            <input type="text" defaultValue="苏州工业园区 AI 创新中心" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">运营主体 *</label>
                            <input type="text" defaultValue="苏州工业园区科技发展有限公司" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">园区面积(㎡)</label>
                                <input type="number" defaultValue={250000} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">企业总数</label>
                                <input type="number" defaultValue={348} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">园区地址 *</label>
                            <textarea rows={2} defaultValue="江苏省苏州市工业园区星湖街328号" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Building className="w-4 h-4 text-brand-tech" /> 现有产业生态
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">主导产业 (多选) *</label>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">人工智能</span>
                                <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">集成电路</span>
                                <button className="text-[11px] bg-adaptive-panel border border-adaptive-border border-dashed text-adaptive-text-muted px-2 py-1 rounded-md hover:bg-adaptive-panel-hover transition-colors">
                                    + 添加产业
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">细分方向</label>
                            <input type="text" defaultValue="大模型底座、算力芯片设计" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">行业分布</label>
                            <textarea rows={2} defaultValue="AI软件(40%), 集成电路(35%), 物联网(25%)" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all resize-none"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2: Industry & Tenants */}
            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Navigation className="w-4 h-4 text-brand-tech" /> 靶向招商计划
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">目标行业</label>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">AI原生应用</span>
                                <span className="text-[11px] bg-brand-tech/10 text-brand-tech border border-brand-tech/20 px-2 py-1 rounded-md font-bold">具身智能</span>
                                <button className="text-[11px] bg-adaptive-panel border border-adaptive-border border-dashed text-adaptive-text-muted px-2 py-1 rounded-md hover:bg-adaptive-panel-hover transition-colors">
                                    + 添加行业
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">目标规模</label>
                            <select className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>不限规模 (全产业链均需)</option>
                                <option>重点引进规上企业/专精特新</option>
                                <option>主要孵化初创团队 (种子/天使)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-warning mb-1.5 pl-1 flex items-center gap-1">
                                <Link className="w-3 h-3" /> 补链/强链需求
                            </label>
                            <textarea rows={3} defaultValue="急需引进算力调度服务商、高质量数据清洗与标注团队，以满足园区现有大模型企业的产业链闭环需要。" className="w-full bg-adaptive-bg border border-warning/50 rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-all resize-none"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 3: OPC Community */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-brand-tech/10 to-transparent border border-brand-tech/20 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-tech/10 rounded-full blur-3xl"></div>
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-brand-tech/20 pb-3 mb-4 relative z-10">
                        <Sparkles className="w-4 h-4 text-brand-tech" /> OPC超级社区配置
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-brand-deep mb-1.5 pl-1">是否认证 OPC 社区</label>
                            <select className="w-full bg-white border border-brand-tech/30 rounded-lg px-3 py-2 text-sm text-brand-tech font-bold focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option value="yes">是, 我们提供OPC专项孵化</option>
                                <option value="no">否</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">OPC社区名称</label>
                                <input type="text" defaultValue="Agent启航加速器" className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">所在城市</label>
                                <input type="text" defaultValue="苏州市" className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> 工位数量</label>
                                <input type="number" defaultValue={120} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">入驻OPC数量</label>
                                <input type="number" defaultValue={25} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">工位价格政策</label>
                            <input type="text" defaultValue="入库OPC首年免租，次年减半" className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">可提供的 OPC 服务</label>
                            <textarea rows={2} defaultValue="- 免费注册地址挂靠\n- 法律财务代理记账\n- 定期投资人对接沙龙" className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all resize-none"></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                                <Server className="w-3 h-3 text-brand-tech" /> 算力基础设施
                            </label>
                            <input type="text" defaultValue="已接入苏州市算力大网，提供A800节点低价租赁并直接抵扣算力券" className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 text-brand-tech">重点聚焦 AI 方向</label>
                            <div className="flex flex-col gap-2 bg-white border border-adaptive-border rounded-lg p-2 max-h-32 overflow-y-auto">
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" defaultChecked className="rounded text-brand-tech" /> 大模型与多模态</label>
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" defaultChecked className="rounded text-brand-tech" /> AI Agent 生产工具</label>
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" className="rounded text-brand-tech" /> 端侧AI部署 (TinyML)</label>
                                <label className="flex items-center gap-2 text-sm text-adaptive-text"><input type="checkbox" className="rounded text-brand-tech" /> 科学计算AI (AI4S)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
