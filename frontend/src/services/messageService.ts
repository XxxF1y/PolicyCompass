import { apiClient } from './apiClient';
import type { Message, MessageType } from '../types/message';

interface MessageApiItem {
    id: string;
    msg_type: string;
    title: string;
    content: string | null;
    is_read: boolean;
    created_at: string;
}

interface MessageListResponse {
    total: number;
    page: number;
    page_size: number;
    items: MessageApiItem[];
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

const toMessageType = (raw: string): MessageType => {
    if (raw === 'policy' || raw === 'match' || raw === 'application' || raw === 'collaboration' || raw === 'system') {
        return raw;
    }
    return 'system';
};

const formatTime = (value: string): string => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const now = Date.now();
    const diffMinutes = Math.floor((now - d.getTime()) / 60000);
    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} 小时前`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} 天前`;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const mapMessage = (item: MessageApiItem): Message => {
    const type = toMessageType(item.msg_type);
    return {
        id: item.id,
        type,
        title: item.title,
        content: item.content || '',
        isRead: item.is_read,
        time: formatTime(item.created_at),
        actions: [{ label: '查看详情', actionType: 'secondary' }],
    };
};

export const MessageService = {
    getMessages: async (params?: {
        type?: MessageType | 'all';
        isRead?: boolean;
        page?: number;
        pageSize?: number;
    }): Promise<Message[]> => {
        const query: Record<string, string | number | boolean> = {
            page: params?.page ?? 1,
            page_size: params?.pageSize ?? 100,
        };
        if (params?.type && params.type !== 'all') query.msg_type = params.type;
        if (typeof params?.isRead === 'boolean') query.is_read = params.isRead;

        const response = await apiClient.get<ApiResponse<MessageListResponse>>('/api/v1/messages', { params: query });
        return (response.data.data?.items || []).map(mapMessage);
    },

    markRead: async (id: string): Promise<void> => {
        await apiClient.patch(`/api/v1/messages/${id}/read`);
    },

    markAllRead: async (): Promise<void> => {
        await apiClient.patch('/api/v1/messages/read-all');
    },

    deleteMessage: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/messages/${id}`);
    },
};
