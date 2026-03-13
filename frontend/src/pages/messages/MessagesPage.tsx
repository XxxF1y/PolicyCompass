import { useState, useEffect } from 'react';
import {
    Bell,
    FileText,
    Target,
    ClipboardList,
    Users,
    Settings,
    CheckCheck,
    ChevronRight,
    Circle,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';

import type { MessageType, Message } from '../../types/message';
import { MessageService } from '../../services/messageService';

const typeConfig: Record<MessageType, { label: string; icon: typeof Bell; color: string; bgColor: string }> = {
    policy: { label: '政策提醒', icon: FileText, color: '#3182ce', bgColor: '#ebf8ff' },
    match: { label: '匹配通知', icon: Target, color: '#38a169', bgColor: '#f0fff4' },
    application: { label: '申报进度', icon: ClipboardList, color: '#805ad5', bgColor: '#faf5ff' },
    collaboration: { label: '协同邀请', icon: Users, color: '#d69e2e', bgColor: '#fffff0' },
    system: { label: '系统通知', icon: Settings, color: '#718096', bgColor: '#f7fafc' },
};



// ==================== 组件 ====================
export default function MessagesPage() {
    const [activeFilter, setActiveFilter] = useState<MessageType | 'all'>('all');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await MessageService.getMessages({ pageSize: 100 });
                setMessages(data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const filteredMessages = activeFilter === 'all'
        ? messages
        : messages.filter(m => m.type === activeFilter);

    const unreadCount = messages.filter(m => !m.isRead).length;

    const markAllRead = async () => {
        const prev = messages;
        setMessages(prevMsgs => prevMsgs.map(m => ({ ...m, isRead: true })));
        try {
            await MessageService.markAllRead();
        } catch (err) {
            console.error("Failed to mark all messages as read", err);
            setMessages(prev);
        }
    };

    const markRead = async (id: string) => {
        const target = messages.find(m => m.id === id);
        if (!target || target.isRead) return;
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
        try {
            await MessageService.markRead(id);
        } catch (err) {
            console.error("Failed to mark message as read", err);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: false } : m));
        }
    };

    const removeMessage = async (id: string) => {
        const prev = messages;
        setMessages(prevMsgs => prevMsgs.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
            setSelectedMessage(null);
        }
        try {
            await MessageService.deleteMessage(id);
        } catch (err) {
            console.error("Failed to delete message", err);
            setMessages(prev);
        }
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
                        onClick={() => { void markAllRead(); }}
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
                {isLoading ? (
                    <div className="space-y-4 animate-pulse mt-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-slate-100 rounded-xl w-full border border-slate-200"></div>
                        ))}
                    </div>
                ) : filteredMessages.length === 0 ? (
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
                                onClick={() => {
                                    void markRead(msg.id);
                                    setSelectedMessage(msg);
                                }}
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
                                        <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                        {/* Optional Highlight text */}
                                        {msg.highlightText && (
                                            <div className={`mt-2 flex items-start gap-1.5 p-2 rounded-lg text-xs font-medium ${msg.highlightStyle === 'success' ? 'bg-green-50 text-green-700' :
                                                msg.highlightStyle === 'warning' ? 'bg-orange-50 text-orange-700' :
                                                    msg.highlightStyle === 'error' ? 'bg-red-50 text-red-700' :
                                                        'bg-blue-50 text-blue-700'
                                                }`}>
                                                {msg.highlightStyle === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                                                <span>{msg.highlightText}</span>
                                            </div>
                                        )}

                                        {/* Optional Incentive text */}
                                        {msg.incentiveText && (
                                            <div className="mt-2 text-xs text-blue-600 bg-blue-50/50 p-2 rounded-lg font-medium">
                                                {msg.incentiveText}
                                            </div>
                                        )}

                                        {/* Optional Actions */}
                                        {msg.actions && msg.actions.length > 0 && (
                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                                                {msg.actions.map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (action.label === '查看详情') {
                                                                void markRead(msg.id);
                                                                setSelectedMessage(msg);
                                                            } else if (action.actionType === 'link' && action.url) {
                                                                window.open(action.url, '_blank');
                                                            } else {
                                                                void markRead(msg.id);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1
                                                            ${action.actionType === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' :
                                                                action.actionType === 'danger' ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50' :
                                                                    action.actionType === 'link' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' :
                                                                        'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }
                                                        `}
                                                    >
                                                        {action.label}
                                                        {action.actionType === 'link' && <ExternalLink className="w-3.5 h-3.5 ml-0.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            void removeMessage(msg.id);
                                        }}
                                        className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-1"
                                        title="删除消息"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: typeConfig[selectedMessage.type].bgColor }}>
                                    {(() => {
                                        const Icon = typeConfig[selectedMessage.type].icon;
                                        return <Icon className="w-5 h-5" style={{ color: typeConfig[selectedMessage.type].color }} />;
                                    })()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">消息详情</h3>
                                    <span className="text-xs text-slate-500">{selectedMessage.time}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto">
                            <h2 className="text-base font-bold text-slate-800 mb-4">{selectedMessage.title}</h2>
                            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                                {selectedMessage.content}
                            </div>

                            {/* Optional Highlight text */}
                            {selectedMessage.highlightText && (
                                <div className={`mt-4 flex items-start gap-2 p-3 rounded-xl text-sm font-medium ${selectedMessage.highlightStyle === 'success' ? 'bg-green-50 text-green-700 border border-green-100' :
                                    selectedMessage.highlightStyle === 'warning' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                        selectedMessage.highlightStyle === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
                                            'bg-blue-50 text-blue-700 border border-blue-100'
                                    }`}>
                                    {selectedMessage.highlightStyle === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                                    <span>{selectedMessage.highlightText}</span>
                                </div>
                            )}

                            {/* Optional Incentive text */}
                            {selectedMessage.incentiveText && (
                                <div className="mt-4 text-sm text-blue-600 bg-blue-50/50 p-3 rounded-xl font-medium border border-blue-100">
                                    {selectedMessage.incentiveText}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 flex-wrap">
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                关闭
                            </button>
                            <button
                                onClick={() => {
                                    void removeMessage(selectedMessage.id);
                                }}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm bg-white border border-red-200 text-red-600 hover:bg-red-50"
                            >
                                删除消息
                            </button>
                            {selectedMessage.actions && selectedMessage.actions.filter(a => a.label !== '查看详情' && a.label !== '忽略').map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (action.actionType === 'link' && action.url) {
                                            window.open(action.url, '_blank');
                                        }
                                        setSelectedMessage(null);
                                    }}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm
                                        ${action.actionType === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                            action.actionType === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                                                action.actionType === 'link' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' :
                                                    'bg-slate-800 text-white hover:bg-slate-900'
                                        }
                                    `}
                                >
                                    {action.label}
                                    {action.actionType === 'link' && <ExternalLink className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
