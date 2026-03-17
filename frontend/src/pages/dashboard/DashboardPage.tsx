import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    ChevronRight,
    ShieldAlert,
    TrendingUp,
    FolderOpen,
    GripVertical,
    RotateCcw,
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardService } from '../../services/dashboardService';
import { ProfileService } from '../../services/profileService';
import { ApplicationService } from '../../services/applicationService';
import type { DashboardStats, DashboardTask } from '../../types/dashboard';
import type { ProfileData } from '../../types/profile';
import type { MaterialItem } from '../../types/application';
import GrowthNavigator from './components/GrowthNavigator';

type ProfileRole = 'enterprise' | 'talent' | 'park';
type WidgetId = 'overview' | 'profile' | 'materials' | 'growth';

const ALL_WIDGETS: WidgetId[] = ['overview', 'profile', 'materials', 'growth'];

const roleTitleMap: Record<ProfileRole, { overview: string; profile: string }> = {
    enterprise: { overview: '企业概览', profile: '企业画像' },
    talent: { overview: '人才概览', profile: '人才画像' },
    park: { overview: '园区概览', profile: '园区画像' },
};

const mapUserRoleToProfileRole = (userRole: string | null): ProfileRole => {
    if (userRole === 'talent') return 'talent';
    if (userRole === 'park') return 'park';
    return 'enterprise';
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const profileRole = mapUserRoleToProfileRole(userRole);
    const defaultOrder: WidgetId[] = ['overview', 'profile', 'materials', 'growth'];

    const storageKey = `dashboard_layout_${profileRole}_v1`;
    const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() => {
        try {
            const cached = localStorage.getItem(storageKey);
            if (!cached) return defaultOrder;
            const parsed = JSON.parse(cached) as string[];
            if (
                Array.isArray(parsed) &&
                parsed.length === defaultOrder.length &&
                parsed.every((id) => ALL_WIDGETS.includes(id as WidgetId))
            ) {
                return parsed as WidgetId[];
            }
        } catch {
            // ignore malformed cache
        }
        return defaultOrder;
    });
    const [draggingWidget, setDraggingWidget] = useState<WidgetId | null>(null);

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [tasks, setTasks] = useState<DashboardTask[]>([]);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [materials, setMaterials] = useState<MaterialItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);

    useEffect(() => {
        setWidgetOrder(() => {
            try {
                const cached = localStorage.getItem(storageKey);
                if (!cached) return defaultOrder;
                const parsed = JSON.parse(cached) as string[];
                if (
                    Array.isArray(parsed) &&
                    parsed.length === defaultOrder.length &&
                    parsed.every((id) => ALL_WIDGETS.includes(id as WidgetId))
                ) {
                    return parsed as WidgetId[];
                }
            } catch {
                // ignore malformed cache
            }
            return defaultOrder;
        });
    }, [storageKey]);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(widgetOrder));
    }, [storageKey, widgetOrder]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [statsData, taskData, profileData, materialsData] = await Promise.all([
                    DashboardService.getEnterpriseStats(),
                    DashboardService.getEnterpriseTasks(),
                    ProfileService.getProfile(profileRole),
                    ApplicationService.getMaterials(),
                ]);
                setStats(statsData);
                setTasks(taskData);
                setProfile(profileData);
                setMaterials(materialsData);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [profileRole]);

    const onDropWidget = (targetId: WidgetId) => {
        if (!draggingWidget || draggingWidget === targetId) {
            setDraggingWidget(null);
            return;
        }
        const next = [...widgetOrder];
        const from = next.indexOf(draggingWidget);
        const to = next.indexOf(targetId);
        if (from < 0 || to < 0) {
            setDraggingWidget(null);
            return;
        }
        next.splice(from, 1);
        next.splice(to, 0, draggingWidget);
        setWidgetOrder(next);
        setDraggingWidget(null);
    };

    const moveWidget = (id: WidgetId, direction: 'up' | 'down') => {
        const idx = widgetOrder.indexOf(id);
        if (idx < 0) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= widgetOrder.length) return;
        const next = [...widgetOrder];
        const [item] = next.splice(idx, 1);
        next.splice(swapIdx, 0, item);
        setWidgetOrder(next);
    };

    const materialSummary = useMemo(() => {
        const valid = materials.filter((m) => m.status === 'valid').length;
        const expiring = materials.filter((m) => m.status === 'expiring').length;
        const expired = materials.filter((m) => m.status === 'expired').length;
        return { valid, expiring, expired };
    }, [materials]);

    const renderWidget = (id: WidgetId, body: ReactNode, title: string) => (
        <section
            key={id}
            draggable
            onDragStart={() => setDraggingWidget(id)}
            onDragEnd={() => setDraggingWidget(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropWidget(id)}
            className={`glass-card-adaptive p-5 rounded-2xl border ${draggingWidget === id ? 'opacity-70 border-primary-400' : 'border-adaptive-border'}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-adaptive-text">{title}</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => moveWidget(id, 'up')} className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text">上移</button>
                    <button onClick={() => moveWidget(id, 'down')} className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text">下移</button>
                    <span className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted flex items-center gap-1">
                        <GripVertical className="w-3.5 h-3.5" /> 拖拽
                    </span>
                </div>
            </div>
            {body}
        </section>
    );

    if (isLoading || !stats || !profile) {
        return (
            <div className="space-y-4 max-w-7xl mx-auto animate-pulse">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl border border-slate-200" />)}
            </div>
        );
    }

    const titles = roleTitleMap[profileRole];

    const widgetMap: Record<WidgetId, ReactNode> = {
        overview: (
            <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-adaptive-text">工作台</h1>
                        <p className="text-adaptive-text-muted mt-2">
                            晚上好，{stats.displayName || '用户'}。当前有 <span className="text-primary-400 font-medium">{stats.openPoliciesCount} 个</span> 高匹配政策窗口。
                        </p>
                    </div>
                    <button
                        onClick={() => setWidgetOrder(defaultOrder)}
                        className="text-xs px-3 py-2 rounded-lg border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text inline-flex items-center gap-1"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> 恢复默认布局
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-adaptive-panel border border-adaptive-border">
                        <p className="text-xs text-adaptive-text-muted">预估可申报额度</p>
                        <p className="text-2xl font-bold text-adaptive-text mt-1">{stats.estimatedAmount}{stats.amountUnit}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-adaptive-panel border border-adaptive-border">
                        <p className="text-xs text-adaptive-text-muted">高度匹配政策</p>
                        <p className="text-2xl font-bold text-adaptive-text mt-1">{stats.highlyMatchedCount} 项</p>
                    </div>
                    <div className="p-4 rounded-xl bg-adaptive-panel border border-adaptive-border">
                        <p className="text-xs text-adaptive-text-muted">进行中申报</p>
                        <p className="text-2xl font-bold text-adaptive-text mt-1">{stats.processingCount} 份</p>
                    </div>
                    <div className="p-4 rounded-xl bg-adaptive-panel border border-adaptive-border">
                        <p className="text-xs text-adaptive-text-muted">致命卡点</p>
                        <p className="text-2xl font-bold text-cta-500 mt-1">{stats.fatalBlockerCount} 个</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-adaptive-panel rounded-xl border border-adaptive-border p-4">
                        <h3 className="text-sm font-medium text-adaptive-text flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-cta-500" /> 卡点说明
                        </h3>
                        <p className="text-sm text-adaptive-text-muted mt-2">{stats.fatalBlockerReason}</p>
                    </div>
                    <div className="bg-adaptive-panel rounded-xl border border-adaptive-border p-4">
                        <h3 className="text-sm font-medium text-adaptive-text flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary-400" /> 进行中任务
                        </h3>
                        <div className="space-y-3 mt-3">
                            {tasks.slice(0, 3).map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => navigate(task.actionPath)}
                                    className="w-full text-left p-3 rounded-lg border border-adaptive-border hover:border-adaptive-border-light bg-adaptive-panel-hover"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-adaptive-text-muted">{task.category}</span>
                                        <span className="text-xs text-adaptive-text-muted">{task.updatedAt}</span>
                                    </div>
                                    <p className="text-sm font-medium text-adaptive-text mt-1">{task.title}</p>
                                    <p className="text-xs text-adaptive-text-muted mt-1 line-clamp-1">{task.summary}</p>
                                </button>
                            ))}
                            {tasks.length === 0 && <p className="text-xs text-adaptive-text-muted">暂无任务</p>}
                        </div>
                    </div>
                </div>
            </div>
        ),
        profile: (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-adaptive-text-muted">画像状态</p>
                        <p className="text-lg font-semibold text-adaptive-text mt-1">{profile.alert.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsProfileCollapsed((v) => !v)}
                            className="text-xs px-3 py-2 rounded-lg border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text"
                        >
                            {isProfileCollapsed ? '展开' : '折叠'}
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/profile-edit')}
                            className="text-xs px-3 py-2 rounded-lg border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text"
                        >
                            进入完整编辑
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-xs text-adaptive-text-muted">画像完整度</p>
                        <p className="text-2xl font-bold text-adaptive-text mt-1">{profile.completionRate}%</p>
                    </div>
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-xs text-adaptive-text-muted">待补项</p>
                        <p className="text-2xl font-bold text-amber-500 mt-1">{profile.alert.missingCount ?? profile.alert.tips.length}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-xs text-adaptive-text-muted">画像风险</p>
                        <p className="text-2xl font-bold mt-1 text-adaptive-text">
                            {profile.completionRate >= 85 ? '低' : profile.completionRate >= 65 ? '中' : '高'}
                        </p>
                    </div>
                </div>

                {!isProfileCollapsed && (
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-sm font-bold text-brand-deep flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-brand-tech" />
                            {profileRole === 'talent' ? '人才竞争力雷达' : profileRole === 'park' ? '园区吸引力雷达' : '企业综合战斗力'}
                        </p>
                        <p className="text-xs text-adaptive-text-muted mb-3 border-b border-adaptive-border-light pb-2">基于全网相似大数据排名计算得出。</p>
                        <div className="h-[320px] mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={profile.radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#1e3a5f', fontSize: 13, fontWeight: 700 }}
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="指标" dataKey="A" stroke="#3182ce" strokeWidth={2.5} fill="#3182ce" fillOpacity={0.15} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {!isProfileCollapsed && (
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-sm font-medium text-adaptive-text flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-cta-500" /> 关键提示
                        </p>
                        <p className="text-xs text-adaptive-text-muted mt-1">{profile.alert.description}</p>
                        <div className="mt-3 space-y-2">
                            {profile.alert.tips.slice(0, 4).map((tip) => (
                                <div key={tip.id} className="p-3 rounded-lg border border-adaptive-border bg-adaptive-panel-hover flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm text-adaptive-text line-clamp-2">{tip.content}</p>
                                        <span className="text-[11px] text-adaptive-text-muted">{tip.actionLabel}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/dashboard/profile-edit')}
                                        className="text-xs px-2 py-1 rounded border border-adaptive-border text-adaptive-text-muted hover:text-adaptive-text whitespace-nowrap"
                                    >
                                        去补充
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ),
        materials: (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-xs text-adaptive-text-muted">有效素材</p>
                        <p className="text-2xl font-bold text-adaptive-text mt-1">{materialSummary.valid}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-xs text-adaptive-text-muted">临期素材</p>
                        <p className="text-2xl font-bold text-amber-500 mt-1">{materialSummary.expiring}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-adaptive-border bg-adaptive-panel">
                        <p className="text-xs text-adaptive-text-muted">过期素材</p>
                        <p className="text-2xl font-bold text-red-500 mt-1">{materialSummary.expired}</p>
                    </div>
                </div>
                <div className="rounded-xl border border-adaptive-border bg-adaptive-panel p-4">
                    <p className="text-sm font-medium text-adaptive-text flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary-500" /> 最近素材
                    </p>
                    <div className="mt-3 space-y-2">
                        {materials.slice(0, 5).map((m) => (
                            <div key={m.id} className="flex items-center justify-between text-sm p-2 rounded bg-adaptive-panel-hover">
                                <span className="text-adaptive-text line-clamp-1">{m.name}</span>
                                <span className="text-xs text-adaptive-text-muted">{m.uploadDate}</span>
                            </div>
                        ))}
                        {materials.length === 0 && <p className="text-xs text-adaptive-text-muted">暂无素材</p>}
                    </div>
                    <button
                        onClick={() => navigate('/applications')}
                        className="mt-3 text-xs text-primary-500 hover:text-primary-400 inline-flex items-center gap-1"
                    >
                        进入素材库 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        ),
        growth: (
            <div className="space-y-3">
                <p className="text-sm text-adaptive-text-muted">成长导航仪按当前角色画像与政策路径动态展示。</p>
                <GrowthNavigator />
            </div>
        ),
    };

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            {widgetOrder.map((id) => renderWidget(id, widgetMap[id], id === 'overview' ? titles.overview : id === 'profile' ? titles.profile : id === 'materials' ? '素材库' : '成长导航仪'))}
            <div className="pt-2 text-xs text-adaptive-text-muted flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                工作台支持模块拖拽与前后排序，布局按当前角色本地保存。
            </div>
        </div>
    );
}
