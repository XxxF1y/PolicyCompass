import { useState } from 'react';
import {
    Bell,
    FileText,
    Target,
    ClipboardList,
    Users,
    Settings,
    CheckCheck,
    ChevronRight,
    Circle
} from 'lucide-react';

// ==================== 类型定义 ====================
type MessageType = 'policy' | 'match' | 'application' | 'collaboration' | 'system';

interface Message {
    id: string;
    type: MessageType;
    title: string;
    content: string;
    time: string;
    isRead: boolean;
}

const typeConfig: Record<MessageType, { label: string; icon: typeof Bell; color: string; bgColor: string }> = {
    policy: { label: '政策提醒', icon: FileText, color: '#3182ce', bgColor: '#ebf8ff' },
    match: { label: '匹配通知', icon: Target, color: '#38a169', bgColor: '#f0fff4' },
    application: { label: '申报进度', icon: ClipboardList, color: '#805ad5', bgColor: '#faf5ff' },
    collaboration: { label: '协同邀请', icon: Users, color: '#d69e2e', bgColor: '#fffff0' },
    system: { label: '系统通知', icon: Settings, color: '#718096', bgColor: '#f7fafc' },
};

// ==================== Mock 数据 ====================
const messagesData: Message[] = [
    {
        id: 'msg1',
        type: 'policy',
        title: '新政策发布：苏州市 AI 算力基础设施专项资金',
        content: '苏州市工信局发布《2026年人工智能算力基础设施建设专项资金申报指南》，申报截止日期为 2026-04-30，预估最高补贴 200 万元。',
        time: '10 分钟前',
        isRead: false,
    },
    {
        id: 'msg2',
        type: 'match',
        title: '您有 3 项新匹配政策',
        content: '系统完成最新一轮智能匹配，发现 3 项高度匹配政策（匹配度 ≥ 80%），预估可申请扶持总额约 380 万元。',
        time: '1 小时前',
        isRead: false,
    },
    {
        id: 'msg3',
        type: 'application',
        title: '「人工智能算力平台专项补贴」预审已完成',
        content: 'AI 预审评分 92 分，建议优化"技术方案合理性"部分后提交。点击查看详细预审报告。',
        time: '2 小时前',
        isRead: false,
    },
    {
        id: 'msg4',
        type: 'collaboration',
        title: '芯智科技有限公司邀请您参与联合申报',
        content: '芯智科技（AI 芯片设计方向）希望与您就"苏州市产业链协同创新项目"进行联合申报，匹配类型为：单线主导型。',
        time: '3 小时前',
        isRead: false,
    },
    {
        id: 'msg5',
        type: 'system',
        title: '画像完整度提醒：建议补充知识产权信息',
        content: '您的企业画像完整度为 75%（良好），补充知识产权和 AI 合规信息后可提升至 90% 以上，将解锁更多精准匹配结果。',
        time: '5 小时前',
        isRead: true,
    },
    {
        id: 'msg6',
        type: 'policy',
        title: '政策窗口期提醒：高新技术企业认定即将截止',
        content: '2026 年度高新技术企业认定申报将于 2026-03-31 截止，您当前匹配度为 85%，建议尽快补充材料并提交。',
        time: '昨天',
        isRead: true,
    },
    {
        id: 'msg7',
        type: 'application',
        title: '「苏州市智改数转专项资金」状态更新',
        content: '您的申报材料已导出并标记为"待前往申报"，请前往官方申报平台提交。预估审核结果时间：2026-05-01。',
        time: '昨天',
        isRead: true,
    },
    {
        id: 'msg8',
        type: 'match',
        title: 'OPC 专属政策更新',
        content: '深圳市南山区发布 OPC 创业者专项扶持计划，包含免租 2 年 + 算力券 5 万元 + 模型券 3 万元，您的 OPC 属性已自动匹配。',
        time: '2 天前',
        isRead: true,
    },
    {
        id: 'msg9',
        type: 'system',
        title: '素材有效期提醒：算法备案证明已过期',
        content: '您上传的「算法备案证明」已于 2025-11-01 过期，该素材关联 2 项政策申报，请尽快更新。',
        time: '3 天前',
        isRead: true,
    },
    {
        id: 'msg10',
        type: 'collaboration',
        title: '协同申报匹配推荐',
        content: '系统识别到深言智能科技（垂直大模型方向）与您存在产业互补关系，可联合申报"江苏省AI产业链协同项目"，预估联合收益增加 40%。',
        time: '5 天前',
        isRead: true,
    },
];

// ==================== 组件 ====================
export default function MessagesPage() {
    const [activeFilter, setActiveFilter] = useState<MessageType | 'all'>('all');
    const [messages, setMessages] = useState(messagesData);

    const filteredMessages = activeFilter === 'all'
        ? messages
        : messages.filter(m => m.type === activeFilter);

    const unreadCount = messages.filter(m => !m.isRead).length;

    const markAllRead = () => {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
    };

    const markRead = (id: string) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    };

    const filters = [
        { key: 'all' as const, label: '全部', count: messages.length },
        ...Object.entries(typeConfig).map(([key, config]) => ({
            key: key as MessageType,
            label: config.label,
            count: messages.filter(m => m.type === key).length,
        })),
    ];

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 px-4 md:px-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                        消息中心
                        <Bell className="w-6 h-6 text-slate-400" />
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        政策提醒、匹配通知、申报进度和协同邀请。
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        全部已读 ({unreadCount})
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                {filters.map(f => {
                    const isActive = activeFilter === f.key;
                    const config = f.key !== 'all' ? typeConfig[f.key] : null;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${isActive
                                    ? 'text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            style={isActive ? { backgroundColor: config?.color || '#1e293b' } : {}}
                        >
                            {f.label}
                            <span className={`ml-0.5 text-[10px] px-1 py-0 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100'
                                }`}>
                                {f.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Messages List */}
            <div className="space-y-2">
                {filteredMessages.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">暂无此类消息</p>
                    </div>
                ) : (
                    filteredMessages.map(msg => {
                        const tc = typeConfig[msg.type];
                        const Icon = tc.icon;
                        return (
                            <div
                                key={msg.id}
                                className={`bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${msg.isRead ? 'border-slate-200' : 'border-slate-300'
                                    }`}
                                onClick={() => markRead(msg.id)}
                            >
                                <div className="flex items-start p-4 md:p-5 gap-4">
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bgColor }}>
                                        <Icon className="w-5 h-5" style={{ color: tc.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {!msg.isRead && (
                                                <Circle className="w-2 h-2 fill-blue-500 text-blue-500 shrink-0" />
                                            )}
                                            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ color: tc.color, backgroundColor: tc.bgColor }}>
                                                {tc.label}
                                            </span>
                                            <span className="text-[11px] text-slate-400 ml-auto shrink-0">{msg.time}</span>
                                        </div>
                                        <h3 className={`text-sm leading-snug mb-1 ${msg.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-800'}`}>
                                            {msg.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{msg.content}</p>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
