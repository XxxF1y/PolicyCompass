export type MessageType = 'policy' | 'match' | 'application' | 'collaboration' | 'system';

export interface MessageAction {
    label: string;
    actionType: 'primary' | 'secondary' | 'danger' | 'link';
    url?: string;
}

export interface Message {
    id: string;
    type: MessageType;
    title: string;
    content: string;
    time: string;
    isRead: boolean;
    actions?: MessageAction[];
    highlightText?: string;
    highlightStyle?: 'info' | 'success' | 'warning' | 'error';
    incentiveText?: string;
}

