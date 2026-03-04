import { useState } from 'react';
import { BrainCircuit, ArrowRight, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState<'password' | 'code'>('password');

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col justify-center items-center p-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-400/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-medium"
            >
                <ArrowRight className="w-4 h-4 rotate-180" /> 返回首页
            </button>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                        <BrainCircuit className="w-8 h-8 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-white tracking-tight mb-2">Policy<span className="text-primary-500">Compass</span></h1>
                    <p className="text-slate-400 text-sm font-medium">企业政策申报的『智能芯片』</p>
                </div>

                {/* Login Glass Card */}
                <div className="glass-card-dark p-8 w-full shadow-2xl relative">
                    {/* Glowing pulse on top border */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setLoginType('password')}
                            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${loginType === 'password' ? 'border-primary-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            密码登录
                        </button>
                        <button
                            onClick={() => setLoginType('code')}
                            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${loginType === 'code' ? 'border-primary-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            验证码登录
                        </button>
                    </div>

                    <form className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">账号 / 手机号</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                                    placeholder="输入注册手机号"
                                />
                            </div>
                        </div>

                        {loginType === 'password' ? (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">密码</label>
                                    <a href="#" className="text-xs text-primary-500 hover:text-primary-400 transition-colors">忘记密码？</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="password"
                                        className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">验证码</label>
                                <div className="relative flex gap-3">
                                    <div className="relative flex-1">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                                            placeholder="6位数字"
                                        />
                                    </div>
                                    <button type="button" className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-700 transition-colors whitespace-nowrap">
                                        获取验证码
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-3.5 mt-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold text-base transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 group"
                        >
                            <span>登录引擎</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-slate-400 text-sm">
                            还没有账号？ <a href="#" className="text-primary-500 font-medium hover:text-primary-400 hover:underline transition-all">立即免费注册</a>
                        </p>
                    </div>
                </div>

                {/* Footer simple copy */}
                <p className="text-center text-slate-600 text-xs mt-8">
                    &copy; 2026 AI Policy Engine. 赋能科技转型与个体创作者.
                </p>
            </div>
        </div>
    );
}
