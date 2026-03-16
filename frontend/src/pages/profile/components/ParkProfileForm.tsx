import { useState } from 'react';
import { MapPin, Server, Sparkles, Navigation, Link, Building, Briefcase, Users, X } from 'lucide-react';

type MultiTagFieldProps = {
    label: string;
    name: string;
    options: string[];
    defaultSelected?: string[];
    required?: boolean;
};

function MultiTagField({ label, name, options, defaultSelected = [], required = false }: MultiTagFieldProps) {
    const [selected, setSelected] = useState<string[]>(defaultSelected);

    const toggle = (value: string) => {
        setSelected((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    };

    return (
        <div>
            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">{label}{required ? ' *' : ''}</label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-adaptive-border bg-adaptive-bg p-2">
                {options.map((option) => {
                    const active = selected.includes(option);
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => toggle(option)}
                            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${active
                                ? 'bg-brand-tech/15 border-brand-tech/40 text-brand-deep font-semibold'
                                : 'bg-white border-adaptive-border text-adaptive-text-muted hover:bg-adaptive-panel-hover'
                                }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5 min-h-6">
                {selected.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-brand-tech/10 text-brand-deep border border-brand-tech/20">
                        {item}
                        <button type="button" onClick={() => toggle(item)} className="opacity-70 hover:opacity-100">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            <input name={name} type="hidden" data-format="json-array" value={JSON.stringify(selected)} readOnly />
        </div>
    );
}

type ParkProfileFormProps = {
    initial?: Record<string, unknown>;
};

const getText = (initial: Record<string, unknown> | undefined, key: string, fallback = ''): string => {
    const val = initial?.[key];
    if (val === null || val === undefined) return fallback;
    return String(val);
};

const getNum = (initial: Record<string, unknown> | undefined, key: string, fallback: number): number => {
    const val = initial?.[key];
    if (typeof val === 'number') return val;
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
};

const getArr = (initial: Record<string, unknown> | undefined, key: string, fallback: string[]): string[] => {
    const val = initial?.[key];
    if (Array.isArray(val)) return val.map(String);
    return fallback;
};

export default function ParkProfileForm({ initial }: ParkProfileFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <MapPin className="w-4 h-4 text-brand-tech" /> 基础信息
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">园区名称 *</label>
                            <input name="park_name" type="text" defaultValue={getText(initial, 'park_name', '苏州AI创新示范园')} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">园区地址 *</label>
                            <textarea name="park_address" rows={2} defaultValue={getText(initial, 'park_address', '江苏省苏州市工业园区星湖街328号')} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all resize-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">运营主体 *</label>
                            <input name="operator" type="text" defaultValue={getText(initial, 'operator', '苏州工业园区科技发展有限公司')} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">园区面积</label>
                            <input name="park_area" type="number" defaultValue={getNum(initial, 'park_area', 250000)} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Building className="w-4 h-4 text-brand-tech" /> 产业定位
                    </h3>
                    <div className="space-y-4">
                        <MultiTagField
                            label="主导产业（多选）"
                            name="leading_industries"
                            required
                            defaultSelected={getArr(initial, 'leading_industries', ['人工智能', '集成电路'])}
                            options={['人工智能', '集成电路', '智能制造', '生物医药', '新能源', '软件服务']}
                        />
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">细分方向</label>
                            <input name="sub_directions" type="text" defaultValue={getText(initial, 'sub_directions', '大模型底座、算力芯片设计')} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Users className="w-4 h-4 text-brand-tech" /> 入驻情况
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">企业总数 *</label>
                            <input name="tenant_total" type="number" defaultValue={getNum(initial, 'tenant_total', 348)} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">行业分布 *</label>
                            <textarea name="industry_distribution" rows={3} defaultValue={getText(initial, 'industry_distribution', 'AI软件(40%), 集成电路(35%), 物联网(25%)')} className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all resize-none"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white border border-adaptive-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-adaptive-border-light pb-3 mb-4">
                        <Navigation className="w-4 h-4 text-brand-tech" /> 招商需求
                    </h3>
                    <div className="space-y-4">
                        <MultiTagField
                            label="目标行业（多选）"
                            name="target_industries"
                            defaultSelected={getArr(initial, 'target_industries', ['AI原生应用', '具身智能'])}
                            options={['AI原生应用', '具身智能', 'AI芯片', 'AI+医疗', 'AI+制造', 'AI+金融']}
                        />
                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">目标规模</label>
                            <select name="target_scale" className="w-full bg-adaptive-bg border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option>不限规模</option>
                                <option>重点引进规上企业/专精特新</option>
                                <option>主要孵化初创团队（种子/天使）</option>
                                <option>偏成熟企业（B轮及以上）</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-warning mb-1.5 pl-1 flex items-center gap-1">
                                <Link className="w-3 h-3" /> 补链/强链需求
                            </label>
                            <textarea name="chain_needs" rows={3} defaultValue={getText(initial, 'chain_needs', '急需引进算力调度服务商、高质量数据清洗与标注团队，以满足园区现有大模型企业的产业链闭环需要。')} className="w-full bg-adaptive-bg border border-warning/50 rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-warning focus:ring-1 focus:ring-warning transition-all resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-brand-tech/10 to-transparent border border-brand-tech/20 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-tech/10 rounded-full blur-3xl"></div>
                    <h3 className="flex items-center gap-2 font-bold text-brand-deep border-b border-brand-tech/20 pb-3 mb-4 relative z-10">
                        <Sparkles className="w-4 h-4 text-brand-tech" /> OPC社区信息
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-brand-deep mb-1.5 pl-1">是否OPC社区</label>
                            <select name="is_opc_community" defaultValue={getText(initial, 'is_opc_community', 'yes')} className="w-full bg-white border border-brand-tech/30 rounded-lg px-3 py-2 text-sm text-brand-tech font-bold focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                <option value="yes">是</option>
                                <option value="no">否</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">OPC社区名称</label>
                                <input name="opc_community_name" type="text" defaultValue={getText(initial, 'opc_community_name', 'Agent启航加速器')} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">OPC社区所在城市</label>
                                <select name="opc_city" defaultValue={getText(initial, 'opc_city', '苏州市')} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all">
                                    <option value="">请选择城市</option>
                                    <option value="苏州市">苏州市</option>
                                    <option value="上海市">上海市</option>
                                    <option value="杭州市">杭州市</option>
                                    <option value="深圳市">深圳市</option>
                                    <option value="北京市">北京市</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> 工位数量</label>
                                <input name="desk_count" type="number" defaultValue={getNum(initial, 'desk_count', 120)} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">入驻OPC数量</label>
                                <input name="opc_tenants" type="number" defaultValue={getNum(initial, 'opc_tenants', 25)} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1">工位价格政策</label>
                            <input name="desk_pricing_policy" type="text" defaultValue={getText(initial, 'desk_pricing_policy', '入库OPC首年免租，次年减半')} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>

                        <MultiTagField
                            label="可提供的OPC服务"
                            name="opc_services"
                            defaultSelected={getArr(initial, 'opc_services', ['算力券', '创业培训', '投融资对接'])}
                            options={['算力券', '模型券', '语料券', '创业培训', '路演活动', '投融资对接', '合规服务', '国际化支持']}
                        />

                        <div>
                            <label className="block text-xs font-bold text-adaptive-text-muted mb-1.5 pl-1 flex items-center gap-1">
                                <Server className="w-3 h-3 text-brand-tech" /> 算力基础设施
                            </label>
                            <input name="compute_infra" type="text" defaultValue={getText(initial, 'compute_infra', '已接入苏州市算力大网，提供A800节点低价租赁并直接抵扣算力券')} className="w-full bg-white border border-adaptive-border rounded-lg px-3 py-2 text-sm text-adaptive-text focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all" />
                        </div>

                        <MultiTagField
                            label="重点聚焦AI方向"
                            name="ai_focus_directions"
                            defaultSelected={getArr(initial, 'ai_focus_directions', ['大模型', '智能体'])}
                            options={['大模型', '智能体', '数字人', 'AI+医疗', 'AI+制造', 'AI+金融', '通用']}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
