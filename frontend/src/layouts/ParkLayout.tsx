import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Search,
    LogOut,
    BrainCircuit,
    AlertCircle,
    Bell,
    Settings,
    FileText,
    PieChart,
    Building2,
    Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ParkLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Apply dark mode class to html document
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    const menuItems = [
        { path: '/park/insights', label: '产业洞察', icon: PieChart },
        { path: '/park/investment', label: '智能招商', icon: Users },
        { path: '/park/policies', label: '政策推送', icon: FileText },
        { path: '/park/messages', label: '消息中心', icon: Bell },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-adaptive-panel text-adaptive-text font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-adaptive-panel border-r border-adaptive-border flex flex-col relative z-20 shadow-2xl">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-adaptive-border cursor-pointer" onClick={() => navigate('/park/insights')}>
                    <BrainCircuit className="w-6 h-6 text-brand-tech mr-3" />
                    <span className="font-heading font-bold text-lg text-adaptive-text tracking-wide">Park<span className="text-brand-tech">Space</span></span>
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
                                    ? 'bg-brand-tech/10 text-brand-deep font-medium'
                                    : 'text-adaptive-text-muted hover:bg-adaptive-panel-hover hover:text-adaptive-text'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-tech' : 'text-adaptive-text-muted group-hover:text-adaptive-text-muted'}`} />
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1 h-4 bg-brand-tech rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info & Settings */}
                <div className="p-4 border-t border-adaptive-border">
                    <button className="w-full flex items-center px-3 py-2 rounded-lg text-adaptive-text-muted hover:bg-adaptive-panel-hover hover:text-adaptive-text transition-colors mb-2">
                        <Settings className="w-5 h-5 mr-3 text-adaptive-text-muted" />
                        系统设置
                    </button>

                    <div className="flex items-center px-3 py-2 mt-4 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-tech to-brand-deep p-[2px] mr-3">
                            <div className="w-full h-full rounded-full bg-adaptive-panel border-2 border-adaptive-border flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-brand-deep" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-adaptive-text truncate">苏州AI园区测试账号</p>
                            <p className="text-xs text-brand-tech truncate">园区运营方</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1 text-adaptive-text-muted hover:text-red-400 transition-colors"
                            title="退出登录"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0 bg-adaptive-bg">
                {/* Header */}
                <header className="h-16 bg-adaptive-panel/50 backdrop-blur-md border-b border-adaptive-border flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center w-96 bg-adaptive-panel/50 border border-adaptive-border-light/50 rounded-lg px-3 py-1.5 focus-within:border-brand-tech/50 focus-within:ring-1 focus-within:ring-brand-tech/50 transition-all">
                        <Search className="w-4 h-4 text-adaptive-text-muted mr-2" />
                        <input
                            type="text"
                            placeholder="搜索企业、政策库..."
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-adaptive-text placeholder:text-adaptive-text-muted"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-adaptive-text-muted hover:text-adaptive-text transition-colors rounded-full hover:bg-adaptive-panel-hover">
                            <AlertCircle className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-adaptive-panel"></span>
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
