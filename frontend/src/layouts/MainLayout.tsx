import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Target,
    FileText,
    Library,
    MessageSquare,
    Building2,
    Settings,
    Search,
    LogOut,
    BrainCircuit,
    AlertCircle
} from 'lucide-react';

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', label: '工作台总览', icon: LayoutDashboard },
        { path: '/matching', label: '智能匹配', icon: Target },
        { path: '/materials', label: '材料工厂', icon: FileText },
        { path: '/policies', label: '政策中心', icon: Library },
        { path: '/collaboration', label: '产业协同', icon: MessageSquare },
        { path: '/park', label: '园区空间', icon: Building2 },
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col relative z-20 shadow-2xl">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <BrainCircuit className="w-6 h-6 text-primary-500 mr-3" />
                    <span className="font-heading font-bold text-lg text-white tracking-wide">Policy<span className="text-primary-500">Compass</span></span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-primary-500/10 text-primary-400 font-medium'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1 h-4 bg-primary-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info & Settings */}
                <div className="p-4 border-t border-slate-800">
                    <button className="w-full flex items-center px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors mb-2">
                        <Settings className="w-5 h-5 mr-3 text-slate-500" />
                        系统设置
                    </button>

                    <div className="flex items-center px-3 py-2 mt-4 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-[2px] mr-3">
                            <div className="w-full h-full rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">OPC</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">超级个体测试账户</p>
                            <p className="text-xs text-slate-500 truncate">科技人才</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            title="退出登录"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0 bg-[#0B1120]">
                {/* Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center w-96 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-1.5 focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/50 transition-all">
                        <Search className="w-4 h-4 text-slate-500 mr-2" />
                        <input
                            type="text"
                            placeholder="搜索政策、材料或园区..."
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-200 placeholder:text-slate-600"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-800">
                            <AlertCircle className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cta-500 rounded-full border border-slate-900"></span>
                        </button>
                    </div>
                </header>

                {/* Sub-routing outlet for actual pages */}
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
