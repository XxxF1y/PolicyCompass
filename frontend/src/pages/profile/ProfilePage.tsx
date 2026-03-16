import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserCircle2,
    Save,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    ArrowLeft
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

import EnterpriseProfileForm from './components/EnterpriseProfileForm';
import TalentProfileForm from './components/TalentProfileForm';
import ParkProfileForm from './components/ParkProfileForm';
import { ProfileService } from '../../services/profileService';
import type { ProfileData } from '../../types/profile';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { role, userRole } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const initialPreviewRole: 'talent' | 'enterprise' | 'park' =
        userRole === 'park' ? 'park' : userRole === 'talent' ? 'talent' : 'enterprise';
    const [previewRole, setPreviewRole] = useState<'talent' | 'enterprise' | 'park'>(initialPreviewRole);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const normLabel = (raw: string): string => raw.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

    const findCardTitle = (el: HTMLElement, form: HTMLElement): string => {
        let node: HTMLElement | null = el;
        while (node && node !== form) {
            const directH3 = Array.from(node.children).find((c) => c.tagName.toLowerCase() === 'h3') as HTMLElement | undefined;
            if (directH3) {
                return normLabel(directH3.innerText || directH3.textContent || '');
            }
            node = node.parentElement;
        }
        return '';
    };

    const findFieldLabel = (el: HTMLElement, form: HTMLElement): string => {
        if (el.tagName.toLowerCase() === 'input' && (el as HTMLInputElement).type === 'checkbox') {
            const wrap = el.closest('label');
            if (wrap) return normLabel(wrap.innerText || wrap.textContent || '');
        }
        let node: HTMLElement | null = el;
        while (node && node !== form) {
            const lbl = Array.from(node.children).find((c) => c.tagName.toLowerCase() === 'label') as HTMLElement | undefined;
            if (lbl) return normLabel(lbl.innerText || lbl.textContent || '');
            node = node.parentElement;
        }
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            return normLabel(el.placeholder || '');
        }
        return '';
    };

    const validateParkForm = (form: HTMLElement) => {
        const query = <T extends HTMLElement>(name: string) => form.querySelector(`[name="${name}"]`) as T | null;
        const getText = (name: string) => {
            const el = query<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(name);
            return (el?.value || '').trim();
        };
        const getSelectedCount = (name: string) => {
            const el = query<HTMLSelectElement>(name);
            if (!el) return 0;
            if (!el.multiple) return el.value ? 1 : 0;
            return Array.from(el.selectedOptions).map((o) => o.value).filter(Boolean).length;
        };

        if (!getText('park_name')) throw new Error('园区名称为必填项');
        if (!getText('park_address')) throw new Error('园区地址为必填项');
        if (!getText('operator')) throw new Error('运营主体为必填项');
        if (getSelectedCount('leading_industries') <= 0) throw new Error('主导产业为必填项');
        if (!getText('tenant_total')) throw new Error('企业总数为必填项');
        if (!getText('industry_distribution')) throw new Error('行业分布为必填项');

        const isOpc = getText('is_opc_community') === 'yes';
        if (isOpc) {
            if (!getText('opc_community_name')) throw new Error('OPC社区名称为必填项（当为OPC社区时）');
            if (!getText('opc_city')) throw new Error('OPC社区所在城市为必填项（当为OPC社区时）');
        }
    };

    const buildPayloadFromForm = (role: 'talent' | 'enterprise' | 'park', form: HTMLElement) => {
        const data = {
            name: '',
            secondary: '',
            sections: {} as Record<string, Record<string, unknown>>,
        };

        const ensureSection = (key: string) => {
            if (!data.sections[key]) data.sections[key] = {};
            return data.sections[key];
        };

        const controls = form.querySelectorAll('input, select, textarea');
        controls.forEach((node) => {
            const el = node as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            if ((el as HTMLInputElement).type === 'button' || (el as HTMLInputElement).type === 'submit') return;
            const label = findFieldLabel(el, form);
            if (!label) return;
            const cardTitle = findCardTitle(el, form);

            const getValue = () => {
                if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.checked;
                if (el instanceof HTMLInputElement && el.dataset.format === 'json-array') {
                    try {
                        const parsed = JSON.parse(el.value);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return [];
                    }
                }
                if (el instanceof HTMLInputElement && el.type === 'number') {
                    const v = el.value.trim();
                    return v === '' ? null : Number(v);
                }
                if (el instanceof HTMLSelectElement && el.multiple) {
                    return Array.from(el.selectedOptions).map((o) => o.value).filter(Boolean);
                }
                return el.value;
            };

            if (role === 'enterprise' && label === '企业名称') data.name = String(getValue() ?? '');
            if (role === 'enterprise' && label === '统一社会信用代码') data.secondary = String(getValue() ?? '');
            if (role === 'talent' && label === '姓名') data.name = String(getValue() ?? '');
            if (role === 'park' && label === '园区名称') data.name = String(getValue() ?? '');
            if (role === 'park' && label === '园区地址') data.secondary = String(getValue() ?? '');

            let sectionKey = '';
            if (role === 'enterprise') {
                if (cardTitle.includes('基础架构与行业')) sectionKey = 'basic_info';
                else if (cardTitle.includes('经营与研发数据')) sectionKey = 'operation_data';
                else if (cardTitle.includes('通用资质与知识产权')) sectionKey = label.includes('专利') || label.includes('软著') ? 'intellectual_property' : 'certifications';
                else if (cardTitle.includes('AI专属合规状态')) sectionKey = 'ai_compliance';
                else if (cardTitle.includes('OPC企业与路线图')) sectionKey = 'opc_info';
            }
            if (role === 'talent') {
                if (cardTitle.includes('基础与教育信息')) sectionKey = label === '姓名' || label === '身份证号' ? 'basic_info' : 'education';
                else if (cardTitle.includes('职业经历与成果产出')) {
                    if (label.includes('专利') || label.includes('论文')) sectionKey = 'achievements';
                    else if (label.includes('人才计划') || label.includes('职称')) sectionKey = 'talent_titles';
                    else sectionKey = 'work_experience';
                } else if (cardTitle.includes('OPC创业与算力需求')) sectionKey = 'opc_info';
            }
            if (role === 'park') {
                if (cardTitle.includes('基础信息')) sectionKey = 'basic_info';
                else if (cardTitle.includes('产业定位')) sectionKey = 'industry_focus';
                else if (cardTitle.includes('入驻情况')) sectionKey = 'tenant_info';
                else if (cardTitle.includes('招商需求')) sectionKey = 'investment_needs';
                else if (cardTitle.includes('OPC社区信息')) sectionKey = 'opc_community_info';
            }
            if (!sectionKey) return;

            const section = ensureSection(sectionKey);
            const key = label;
            if (el instanceof HTMLInputElement && el.type === 'checkbox') {
                const arr = (section[key] as string[] | undefined) || [];
                const text = label;
                if (el.checked) {
                    if (!arr.includes(text)) arr.push(text);
                } else {
                    const idx = arr.indexOf(text);
                    if (idx >= 0) arr.splice(idx, 1);
                }
                section[key] = arr;
            } else {
                section[key] = getValue();
            }
        });
        return data;
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMsg('');
        try {
            const formId = previewRole === 'enterprise' ? 'profile-form-enterprise' : previewRole === 'talent' ? 'profile-form-talent' : 'profile-form-park';
            const form = document.getElementById(formId);
            if (!form) throw new Error('未找到画像表单');
            if (previewRole === 'park') validateParkForm(form);

            const parsed = buildPayloadFromForm(previewRole, form);
            const draft = await ProfileService.getProfileEditor(previewRole);
            const mergedSections = draft.sections.map((s) => {
                let existing: Record<string, unknown> = {};
                try {
                    existing = JSON.parse(s.value || '{}');
                } catch {
                    existing = {};
                }
                const patch = parsed.sections[s.key] || {};
                return { ...s, value: JSON.stringify({ ...existing, ...patch }, null, 2) };
            });

            await ProfileService.saveProfileEditor({
                ...draft,
                name: parsed.name || draft.name,
                secondaryValue: parsed.secondary || draft.secondaryValue,
                sections: mergedSections,
            });

            const latest = await ProfileService.getProfile(previewRole);
            setProfileData(latest);
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setIsSaving(false);
            const detail = err?.response?.data?.detail || err?.message;
            setErrorMsg(detail || '保存失败，请稍后重试');
        }
    };

    useEffect(() => {
        const nextRole: 'talent' | 'enterprise' | 'park' =
            userRole === 'park' ? 'park' : userRole === 'talent' ? 'talent' : 'enterprise';
        setPreviewRole(nextRole);
    }, [userRole]);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await ProfileService.getProfile(previewRole);
                setProfileData(data);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [previewRole]);

    if (isLoading || !profileData) {
        return (
            <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse relative pb-10 p-8">
                <div className="h-16 bg-slate-100 rounded-lg mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 h-80 bg-slate-100 rounded-xl"></div>
                    <div className="lg:col-span-2 h-80 bg-slate-100 rounded-xl"></div>
                </div>
                <div className="h-[600px] bg-slate-100 rounded-xl mt-6"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in relative pb-10">
            <div
                className="flex items-center gap-2 text-adaptive-text-muted hover:text-brand-tech cursor-pointer w-fit transition-colors"
                onClick={() => navigate(role === 'park' ? '/park/insights' : '/dashboard')}
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">返回</span>
            </div>

            {/* Header with Role Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-adaptive-border">
                <div>
                    <h1 className="text-2xl font-bold text-brand-deep flex items-center gap-2">
                        <UserCircle2 className="w-6 h-6 text-brand-tech" />
                        画像中心 ({previewRole === 'talent' ? '人才引擎' : previewRole === 'enterprise' ? '企业引擎' : '园区引擎'})
                    </h1>
                    <p className="text-adaptive-text-muted text-sm mt-1 mb-3">完善专属画像数据，AI引擎将为您解锁更高成功率的匹配方案。</p>

                    {/* Role Preview Toggle */}
                    <div className="inline-flex bg-adaptive-border rounded-lg p-1.5 shadow-sm">
                        <button
                            onClick={() => setPreviewRole('talent')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${previewRole === 'talent' ? 'bg-white text-brand-tech shadow-sm' : 'text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            👨‍💻 人才视角
                        </button>
                        <button
                            onClick={() => setPreviewRole('enterprise')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${previewRole === 'enterprise' ? 'bg-white text-brand-tech shadow-sm' : 'text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            🏢 企业视角
                        </button>
                        <button
                            onClick={() => setPreviewRole('park')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${previewRole === 'park' ? 'bg-white text-brand-tech shadow-sm' : 'text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            🏭 园区视角
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-adaptive-text-muted mb-1">画像完整度</span>
                        <div className="w-32 h-2.5 bg-adaptive-border rounded-full overflow-hidden">
                            <div className={`h-full bg-brand-tech rounded-full shadow-[0_0_10px_rgba(49,130,206,0.6)]`} style={{ width: `${profileData.completionRate}%` }}></div>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm ${showSuccess ? 'bg-success text-white' : 'bg-brand-tech hover:bg-brand-deep text-white hover:shadow-md'
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : showSuccess ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? '正在计算变动...' : showSuccess ? '已同步至引擎' : '保存并评估'}
                    </button>
                </div>
            </div>

            {/* Top Dashboard: Radar & Quick Stats */}
            {errorMsg && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {errorMsg}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Radar Chart Panel */}
                <div className="lg:col-span-1 bg-adaptive-panel rounded-xl border border-adaptive-border shadow-sm p-6 flex flex-col items-center transition-all duration-300">
                    <h3 className="w-full font-bold text-brand-deep flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-brand-tech" />
                        {previewRole === 'talent' ? '人才竞争力雷达' : previewRole === 'park' ? '园区吸引力雷达' : '企业综合战斗力'}
                    </h3>
                    <p className="w-full text-xs text-adaptive-text-muted mb-4 border-b border-adaptive-border-light pb-2">基于全网相似大数据排名计算得出。</p>

                    <div className="w-full h-[240px] relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={profileData.radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="指标"
                                    dataKey="A"
                                    stroke="#3182ce"
                                    strokeWidth={2}
                                    fill="#3182ce"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-brand-tech/10 blur-xl"></div>
                        </div>
                    </div>
                </div>

                {/* Important Alerts & Missing Data Tasks */}
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-deep to-[#2c5282] rounded-xl shadow-md p-6 text-white relative overflow-hidden flex flex-col justify-between transition-all duration-300">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-tech/30 rounded-full blur-3xl"></div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            {profileData.role === 'enterprise' ? <AlertCircle className="w-5 h-5 text-warning" /> :
                                profileData.role === 'talent' ? <AlertCircle className="w-5 h-5 text-brand-orange" /> :
                                    <CheckCircle2 className="w-5 h-5 text-success" />}
                            {profileData.alert.title}
                        </h3>
                        {profileData.role === 'enterprise' && profileData.alert.missingCount ? (
                            <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                                系统检测到您当前有 <strong className="text-warning text-base mx-1">{profileData.alert.missingCount}项</strong> 关键财务指标尚未填写，这直接导致【省专精特新】等 4 项政策的智能匹配精准度下降。
                            </p>
                        ) : (
                            <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                                {profileData.alert.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 relative z-10 w-full md:w-3/4">
                        {profileData.alert.tips.map(tip => (
                            <div key={tip.id} className={`bg-white/10 border ${tip.type === 'warning' ? 'border-warning/50' :
                                tip.type === 'bonus' ? 'border-white/20' :
                                    tip.type === 'success' ? 'border-success/40' :
                                        'border-brand-orange/40'
                                } rounded-lg p-3 flex justify-between items-center backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group`}>
                                <span className="text-sm font-medium">{tip.content}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tip.type === 'bonus' ? 'text-brand-tech bg-white' :
                                        tip.type === 'success' ? 'text-success bg-white' :
                                            tip.type === 'warning' ? 'text-white/70 bg-transparent px-0' :
                                                'text-brand-orange bg-white'
                                        }`}>{tip.actionLabel}</span>
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-brand-tech transition-colors">
                                        <span className="text-xs">+</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Forms Container - DYNAMIC RENDERING */}
            <div className={`transition-opacity duration-300 ${previewRole === 'talent' ? 'opacity-100 block' : 'hidden'}`}>
                <div id="profile-form-talent">
                    <TalentProfileForm />
                </div>
            </div>

            <div className={`transition-opacity duration-300 ${previewRole === 'enterprise' ? 'opacity-100 block' : 'hidden'}`}>
                <div id="profile-form-enterprise">
                    <EnterpriseProfileForm />
                </div>
            </div>

            <div className={`transition-opacity duration-300 ${previewRole === 'park' ? 'opacity-100 block' : 'hidden'}`}>
                <div id="profile-form-park">
                    <ParkProfileForm />
                </div>
            </div>

        </div>
    );
}
