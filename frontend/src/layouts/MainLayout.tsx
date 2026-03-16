import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Library,
    Settings,
    Search,
    LogOut,
    BrainCircuit,
    AlertCircle,
    FolderOpen,
    Bell,
    Network
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Apply dark mode class to html document
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    const menuItems = [
        { path: '/dashboard', label: '工作台', icon: LayoutDashboard },
        { path: '/policies', label: '政策广场', icon: Library },
        { path: '/applications', label: '申报中心', icon: FolderOpen },
        { path: '/collaboration', label: '产业协同', icon: Network },
        { path: '/messages', label: '消息中心', icon: Bell },
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
                <div className="h-16 flex items-center px-6 border-b border-adaptive-border cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <BrainCircuit className="w-6 h-6 text-primary-500 mr-3" />
                    <span className="font-heading font-bold text-lg text-adaptive-text tracking-wide">Policy<span className="text-primary-500">Compass</span></span>
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
                                    : 'text-adaptive-text-muted hover:bg-adaptive-panel-hover hover:text-adaptive-text'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-400' : 'text-adaptive-text-muted group-hover:text-adaptive-text-muted'}`} />
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1 h-4 bg-primary-500 rounded-full" />
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-[2px] mr-3">
                            <div className="w-full h-full rounded-full bg-adaptive-panel border-2 border-adaptive-border flex items-center justify-center">
                                <span className="text-xs font-bold text-adaptive-text">OPC</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-adaptive-text truncate">超级个体测试账户</p>
                            <p className="text-xs text-adaptive-text-muted truncate">科技人才</p>
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
                    <div className="flex items-center w-96 bg-adaptive-panel/50 border border-adaptive-border-light/50 rounded-lg px-3 py-1.5 focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/50 transition-all">
                        <Search className="w-4 h-4 text-adaptive-text-muted mr-2" />
                        <input
                            type="text"
                            placeholder="搜索政策、材料或园区..."
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-adaptive-text placeholder:text-adaptive-text-muted"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-adaptive-text-muted hover:text-adaptive-text transition-colors rounded-full hover:bg-adaptive-panel-hover">
                            <AlertCircle className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cta-500 rounded-full border border-adaptive-panel"></span>
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
