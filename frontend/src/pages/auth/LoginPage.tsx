import { useState } from 'react';
import { BrainCircuit, ArrowRight, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginType, setLoginType] = useState<'password' | 'code'>('password');

    const handleLogin = (role: 'enterprise' | 'park') => {
        login(role);
        if (role === 'park') {
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
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 text-adaptive-text-muted hover:text-brand-tech transition-colors flex items-center gap-2 font-medium"
            >
                <ArrowRight className="w-4 h-4 rotate-180" /> 返回首页
            </button>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-white border border-adaptive-border rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <BrainCircuit className="w-8 h-8 text-brand-tech" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-brand-deep tracking-tight mb-2">Policy<span className="text-brand-tech">Compass</span></h1>
                    <p className="text-adaptive-text-muted text-sm font-medium">企业政策申报的『智能芯片』</p>
                </div>

                {/* Login Glass Card */}
                <div className="bg-white rounded-2xl p-8 w-full shadow-xl border border-adaptive-border relative">
                    {/* Glowing pulse on top border */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-tech/30 to-transparent" />

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setLoginType('password')}
                            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${loginType === 'password' ? 'border-brand-tech text-brand-tech' : 'border-transparent text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            密码登录
                        </button>
                        <button
                            onClick={() => setLoginType('code')}
                            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${loginType === 'code' ? 'border-brand-tech text-brand-tech' : 'border-transparent text-adaptive-text-muted hover:text-adaptive-text'}`}
                        >
                            验证码登录
                        </button>
                    </div>

                    <form className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-adaptive-text-muted uppercase tracking-wider">账号 / 手机号</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adaptive-text-muted" />
                                <input
                                    type="text"
                                    className="w-full bg-adaptive-bg/50 border border-adaptive-border text-adaptive-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all placeholder:text-adaptive-text-muted/50"
                                    placeholder="输入注册手机号"
                                />
                            </div>
                        </div>

                        {loginType === 'password' ? (
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-adaptive-text-muted uppercase tracking-wider">密码</label>
                                    <a href="#" className="text-xs text-brand-tech font-medium hover:text-brand-tech/80 transition-colors">忘记密码？</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adaptive-text-muted" />
                                    <input
                                        type="password"
                                        className="w-full bg-adaptive-bg/50 border border-adaptive-border text-adaptive-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all placeholder:text-adaptive-text-muted/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-adaptive-text-muted uppercase tracking-wider">验证码</label>
                                <div className="relative flex gap-3">
                                    <div className="relative flex-1">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-adaptive-text-muted" />
                                        <input
                                            type="text"
                                            className="w-full bg-adaptive-bg/50 border border-adaptive-border text-adaptive-text rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand-tech focus:ring-1 focus:ring-brand-tech transition-all placeholder:text-adaptive-text-muted/50"
                                            placeholder="6位数字"
                                        />
                                    </div>
                                    <button type="button" className="px-4 bg-adaptive-bg hover:bg-adaptive-panel-hover text-brand-deep font-medium text-sm rounded-lg border border-adaptive-border transition-colors whitespace-nowrap">
                                        获取验证码
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => handleLogin('enterprise')}
                                className="w-full py-3.5 bg-brand-tech hover:bg-brand-deep text-white rounded-lg font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <span>企业 / 人才登录</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleLogin('park')}
                                className="w-full py-3.5 bg-white hover:bg-slate-50 text-brand-deep border border-brand-tech/30 rounded-lg font-bold text-base transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group"
                            >
                                <span>园区工作台登录</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-brand-tech" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-adaptive-border-light text-center">
                        <p className="text-adaptive-text-muted text-sm">
                            还没有账号？ <button type="button" onClick={() => navigate('/register')} className="text-brand-tech font-bold hover:underline transition-all">立即免费注册</button>
                        </p>
                    </div>
                </div>

                {/* Footer simple copy */}
                <p className="text-center text-adaptive-text-muted text-xs mt-8">
                    &copy; 2026 AI Policy Engine. 赋能科技转型与个体创作者.
                </p>
            </div>
        </div>
    );
}
