import type { CollabOpportunity } from '../types/collaboration';

const mockOpportunities: CollabOpportunity[] = [
    {
        id: 'collab1',
        level: 'strong',
        type: '上下游联合申报',
        policyTitle: '江苏省智改数转专项 - 需AI视觉检测供应商',
        partnerName: '某汽车零部件制造有限公司',
        partnerInfo: '苏州，年营收2.3亿',
        description: '正在申报2026年度江苏省智改数转专项资金，项目方案中需要引入AI视觉检测系统，寻找技术供应商作为联合申报方。',
        matchReason: '贵司核心业务为工业AI视觉检测，与该企业需求高度匹配；联合申报可获得技术服务合同+专项补贴分成。',
        expectedReturn: '技术服务合同 50-80万 + 补贴分成 10-20万',
        status: 'pending_response',
        statusLabel: '待响应'
    },
    {
        id: 'collab2',
        level: 'normal',
        type: '企业+人才协同',
        policyTitle: '2026苏州市姑苏创新创业领军人才计划',
        partnerName: '张某某 (CTO)',
        partnerInfo: '匹配度88%',
        description: 'CTO个人符合领军人才计划申报条件，可与企业项目联合申报，企业可获得最高250万资助。',
        blocker: '需CTO完善个人画像信息',
        expectedReturn: '最高 250万资助',
        status: 'needs_info',
        statusLabel: '待完善信息'
    },
    {
        id: 'collab3',
        level: 'strong',
        type: '协同平台揭榜挂帅',
        policyTitle: '苏州市人工智能医疗场景应用揭榜挂帅',
        partnerName: '苏州市某三甲医院',
        partnerInfo: '脱敏展示',
        description: '医院提供医疗影像脱敏数据与应用场景，寻找具备大模型微调能力的 AI 团队联合攻关。',
        matchReason: '贵司具备医疗领域多模态大模型研发经验，且算力充沛。',
        expectedReturn: '项目经费 200万 + 优先采购权',
        status: 'pending_response',
        statusLabel: '待响应'
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CollaborationService = {
    getOpportunities: async (): Promise<CollabOpportunity[]> => {
        await delay(700);
        return mockOpportunities;
    }
};
