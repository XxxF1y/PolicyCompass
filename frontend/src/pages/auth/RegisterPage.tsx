import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Lock, User, Briefcase, Building2, TrendingUp, Cpu, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type RoleType = 'talent' | 'enterprise' | 'transform' | 'park' | null;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState<number>(1);

    // Form State
    const [phone, setPhone] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [selectedRole, setSelectedRole] = useState<RoleType>(null);
    const [name, setName] = useState('');
    const [isOpc, setIsOpc] = useState<boolean>(false);

    const handleNext = () => {
        if (step === 1) {
            if (!phone || !verifyCode) return;
        }
        if (step === 2) {
            if (!selectedRole) return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleComplete = () => {
        // Mock register complete, set auth state and navigate
        if (!name) return;

        const systemRole = selectedRole === 'park' ? 'park' : 'enterprise';
        login(systemRole);

        if (systemRole === 'park') {
            navigate('/park/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-adaptive-bg relative overflow-hidden flex flex-col justify-center items-center p-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-tech/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-deep/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => step === 1 ? navigate('/login') : handleBack()}
                className="absolute top-8 left-8 text-adaptive-text-muted hover:text-brand-tech transition-colors flex items-center gap-2 font-medium z-20"
            >
                <ArrowRight className="w-4 h-4 rotate-180" /> {step === 1 ? '返回登录' : '上一步'}
            </button>

            <div className="w-full max-w-2xl relative z-10 transition-all duration-300">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-white border border-adaptive-border rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <BrainCircuit className="w-8 h-8 text-brand-tech" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-brand-deep tracking-tight mb-2">Policy<span className="text-brand-tech">Compass</span></h1>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative max-w-md mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-adaptive-border -z-10 -translate-y-1/2" />
                    <div
                        className="absolute top-1/2 left-0 h-[2px] bg-brand-tech -z-10 -translate-y-1/2 transition-all duration-500 ease-out"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />

                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 bg-adaptive-bg px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s ? 'bg-brand-tech text-white shadow-md' : 'bg-white border-2 border-adaptive-border text-adaptive-text-muted'
                                }`}>
                                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                            </div>
                            <span className={`text-xs font-bold ${step >= s ? 'text-brand-deep' : 'text-adaptive-text-muted'}`}>
                                {s === 1 ? '验证身份' : s === 2 ? '选择角色' : '完善信息'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Glass Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-adaptive-border relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-tech/30 to-transparent" />

                    {/* STEP 1: Phone Verification */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">欢迎加入 PolicyCompass</h2>
                                <p className="text-sm text-slate-500 mt-1">请验证手机号以开启智能向导</p>
                            </div>

                            <div className="space-y-4 max-w-md mx-auto">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-adaptive-text-muted uppercase tracking-wider">手机号</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adaptive-text-muted" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-adaptive-bg/50 border border-adaptive-border text-adaptive-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all placeholder:text-adaptive-text-muted/50"
                                            placeholder="输入 11 位手机号"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-adaptive-text-muted uppercase tracking-wider">验证码</label>
                                    <div className="relative flex gap-3">
                                        <div className="relative flex-1">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adaptive-text-muted" />
                                            <input
                                                type="text"
                                                value={verifyCode}
                                                onChange={(e) => setVerifyCode(e.target.value)}
                                                className="w-full bg-adaptive-bg/50 border border-adaptive-border text-adaptive-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all placeholder:text-adaptive-text-muted/50"
                                                placeholder="6位数字"
                                            />
                                        </div>
                                        <button type="button" className="px-4 bg-adaptive-bg hover:bg-adaptive-panel-hover text-brand-deep font-medium text-sm rounded-lg border border-adaptive-border transition-colors whitespace-nowrap">
                                            获取验证码
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Role Selection */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in text-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">您希望以什么身份使用引擎？</h2>
                                <p className="text-sm text-slate-500 mt-1">不同的角色将解锁专属的业务工作流</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {/* Roles */}
                                <button
                                    onClick={() => setSelectedRole('talent')}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${selectedRole === 'talent' ? 'border-brand-tech bg-blue-50/50 shadow-md' : 'border-adaptive-border hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedRole === 'talent' ? 'bg-brand-tech text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">科技人才</h3>
                                        <p className="text-xs text-slate-500 mt-1">独立开发者、科研人员或高校团队代表，寻找人才资助与工位。</p>
                                    </div>
                                    {selectedRole === 'talent' && <CheckCircle2 className="absolute top-4 right-4 text-brand-tech w-5 h-5" />}
                                </button>

                                <button
                                    onClick={() => setSelectedRole('enterprise')}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${selectedRole === 'enterprise' ? 'border-brand-tech bg-blue-50/50 shadow-md' : 'border-adaptive-border hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedRole === 'enterprise' ? 'bg-brand-tech text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">科技中小微企业</h3>
                                        <p className="text-xs text-slate-500 mt-1">已成立实体的 AI / 算力初创公司，寻求政策资金补贴与产业协同。</p>
                                    </div>
                                    {selectedRole === 'enterprise' && <CheckCircle2 className="absolute top-4 right-4 text-brand-tech w-5 h-5" />}
                                </button>

                                <button
                                    onClick={() => setSelectedRole('transform')}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${selectedRole === 'transform' ? 'border-brand-tech bg-blue-50/50 shadow-md' : 'border-adaptive-border hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedRole === 'transform' ? 'bg-brand-tech text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">传统转型企业</h3>
                                        <p className="text-xs text-slate-500 mt-1">传统行业企业，寻找数字化、智能化转型政策支持及寻找技术方案商。</p>
                                    </div>
                                    {selectedRole === 'transform' && <CheckCircle2 className="absolute top-4 right-4 text-brand-tech w-5 h-5" />}
                                </button>

                                <button
                                    onClick={() => setSelectedRole('park')}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${selectedRole === 'park' ? 'border-brand-tech bg-blue-50/50 shadow-md' : 'border-adaptive-border hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedRole === 'park' ? 'bg-brand-tech text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">园区运营方</h3>
                                        <p className="text-xs text-slate-500 mt-1">孵化器、产业园管理方，需要智能招商、政策全网发布及产业图谱洞察。</p>
                                    </div>
                                    {selectedRole === 'park' && <CheckCircle2 className="absolute top-4 right-4 text-brand-tech w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Basic Info & OPC */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">最后一步，完善基本资料</h2>
                                <p className="text-sm text-slate-500 mt-1">这将帮助 AI 更精准地为您匹配资源</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-adaptive-text-muted uppercase tracking-wider">
                                        {selectedRole === 'talent' ? '真实姓名 / 团队名称' :
                                            selectedRole === 'park' ? '园区 / 孵化器全称' : '企业主体全称'}
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adaptive-text-muted" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-adaptive-bg/50 border border-adaptive-border text-adaptive-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all placeholder:text-adaptive-text-muted/50"
                                            placeholder="请输入完整名称以开启档案"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic OPC Conditional Fields */}
                                {selectedRole !== 'transform' && (
                                    <div className="p-4 bg-blue-50/50 border border-brand-tech/20 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-slate-800">
                                                {selectedRole === 'talent' && "是否为 OPC (开源先锋) 创业团队？"}
                                                {selectedRole === 'enterprise' && "是否已加入 OPC 创新生态圈？"}
                                                {selectedRole === 'park' && "是否为官方认证的 OPC 社区？"}
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setIsOpc(!isOpc)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-tech focus:ring-offset-1 ${isOpc ? 'bg-brand-tech' : 'bg-slate-300'}`}
                                            >
                                                <span className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${isOpc ? 'translate-x-5' : 'translate-x-0'}`}>
                                                    {isOpc && (
                                                        <svg
                                                            className="h-3 w-3 text-brand-tech animate-in zoom-in duration-200"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={3}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {selectedRole === 'talent' && "选择是，系统将为您解锁 OPC 专属雏鹰资助与免费算力支持推荐。"}
                                            {selectedRole === 'enterprise' && "选择是，系统将为您优先匹配 OPC 相关的联合资助与上下游生态。"}
                                            {selectedRole === 'park' && "选择是，您的社区将在 OPC 创业者招商库中获得更高曝光权重。"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="mt-8 pt-6 border-t border-adaptive-border-light flex gap-4">
                        {step === 3 ? (
                            <button
                                onClick={handleComplete}
                                disabled={!name}
                                className="w-full py-3.5 bg-brand-tech hover:bg-brand-deep disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <span>注册完成，启动引擎</span>
                                <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={step === 1 && (!phone || !verifyCode) || step === 2 && !selectedRole}
                                className="w-full py-3.5 bg-brand-tech hover:bg-brand-deep disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <span>下一步</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
