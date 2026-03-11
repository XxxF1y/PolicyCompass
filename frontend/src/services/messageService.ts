import type { Message } from '../types/message';

const mockMessages: Message[] = [
    {
        id: 'msg1',
        type: 'policy',
        title: '【申报截止提醒】高新技术企业认定将于3天后截止申报',
        content: '建议尽快完成申报材料准备，避免错过年度申报窗口。',
        time: '3 分钟前',
        isRead: false,
        highlightText: '您的匹配度：80%',
        highlightStyle: 'warning',
        actions: [
            { label: '查看详情', actionType: 'primary' },
            { label: '忽略', actionType: 'secondary' },
        ],
    },
    {
        id: 'msg2',
        type: 'match',
        title: '【新政策匹配】发现2项新政策与您高度匹配',
        content: '• 人工智能创新应用专项（匹配度95%）\n• 数据要素市场培育试点（匹配度88%）',
        time: '1 小时前',
        isRead: false,
        actions: [
            { label: '查看详情', actionType: 'primary' },
            { label: '忽略', actionType: 'secondary' },
        ],
    },
    {
        id: 'msg3',
        type: 'application',
        title: '【预估进度】科技型中小企业入库申报预计已进入公示阶段',
        content: '预估依据：根据政策文件评审时间节点推算',
        time: '昨天 15:30',
        isRead: false,
        incentiveText: '💡 请前往官方申报平台查看实际进展，获得结果后请及时反馈',
        actions: [
            { label: '前往申报平台 ↗', actionType: 'link', url: 'https://fuwu.most.gov.cn' },
            { label: '反馈结果', actionType: 'primary' },
        ],
    },
    {
        id: 'msg4',
        type: 'application',
        title: '【结果确认】您反馈的科技型中小企业入库申报结果已记录',
        content: '审核结果：已通过 | 入库编号：2024440300XXXXX',
        time: '今天 09:00',
        isRead: true,
        highlightText: '🎉 恭喜！您已获得 50 积分奖励',
        highlightStyle: 'success',
        actions: [
            { label: '查看详情', actionType: 'secondary' },
        ],
    },
    {
        id: 'msg5',
        type: 'collaboration',
        title: '【协同申报邀请】XX产业园邀请您参与特色产业集群申报',
        content: '参与收益：集群成员资质 + 优先享受园区政策',
        time: '昨天 10:00',
        isRead: true,
        actions: [
            { label: '查看详情', actionType: 'secondary' },
            { label: '接受', actionType: 'primary' },
            { label: '拒绝', actionType: 'danger' },
        ],
    },
    {
        id: 'msg6',
        type: 'system',
        title: '【系统维护】平台将于本周末进行升级维护',
        content: '升级期间部分功能可能不可用，带来的不便敬请谅解。',
        time: '2 天前',
        isRead: true,
        actions: [
            { label: '查看详情', actionType: 'secondary' },
        ],
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MessageService = {
    getMessages: async (): Promise<Message[]> => {
        await delay(500);
        return mockMessages;
    }
};
