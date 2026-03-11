import type { ApplicationRecord, MaterialItem, MaterialPackage, MaterialAlert, MaterialDetailData } from '../types/application';

// ==================== 申报记录 Mock ====================
const mockApplicationsData: ApplicationRecord[] = [
    {
        id: 'app1',
        policyTitle: '人工智能算力平台专项补贴',
        agency: '苏州市工信局',
        amount: '最高 50 万',
        status: 'estimated_reviewing',
        materialGenerateTime: '2026-02-20',
        preReviewTime: '2026-02-25',
        preReviewType: 'ai',
        redirectUrl: 'https://fuwu.most.gov.cn',
        redirectTime: '2026-02-28',
        estimatedReviewStage: '评审阶段',
        estimatedResultDate: '2026-05-30',
        progress: 70,
    },
    {
        id: 'app2',
        policyTitle: '企业研发机构与创新平台奖励',
        agency: '江苏省科技厅',
        amount: '30 - 100 万',
        status: 'generating',
        materialGenerateTime: '2026-03-02',
        progress: 15,
    },
    {
        id: 'app3',
        policyTitle: '苏州市智改数转专项资金',
        agency: '苏州市工信局',
        amount: '最高 200 万',
        status: 'pending_redirect',
        materialGenerateTime: '2026-02-10',
        preReviewTime: '2026-02-15',
        preReviewType: 'ai',
        redirectUrl: 'https://sthjj.suzhou.gov.cn',
        estimatedResultDate: '2026-06-01',
        progress: 50,
    },
    {
        id: 'app4',
        policyTitle: '高新技术企业培育资金',
        agency: '苏州市科技局',
        amount: '20 万',
        status: 'granted',
        materialGenerateTime: '2025-10-05',
        preReviewTime: '2025-10-12',
        preReviewType: 'ai',
        redirectUrl: 'https://fuwu.most.gov.cn',
        redirectTime: '2025-10-15',
        estimatedReviewStage: '已公示',
        estimatedResultDate: '2025-12-10',
        actualResult: 'passed',
        resultScreenshotUrl: '/uploads/app4_result.jpg',
        grantAmount: '20 万',
        progress: 100,
    },
    {
        id: 'app5',
        policyTitle: '大模型专项扶持计划',
        agency: '深圳市科技创新委',
        amount: '最高 500 万',
        status: 'returned',
        materialGenerateTime: '2025-10-01',
        preReviewTime: '2025-10-10',
        preReviewType: 'expert',
        redirectUrl: 'https://stic.sz.gov.cn',
        redirectTime: '2025-11-20',
        estimatedReviewStage: '已公示',
        actualResult: 'returned',
        rejectReason: '研发费用专审报告缺少会计师签章',
        resultScreenshotUrl: '/uploads/app5_return.jpg',
        progress: 100,
    },
];

// ==================== 素材管理 Mock ====================
const mockMaterialsData: MaterialItem[] = [
    {
        id: 'm1', name: '营业执照（统一社会信用代码）', category: 'license', materialType: '营业执照',
        uploadDate: '2026-01-15', validFrom: '2023-01-15', validTo: '2046-01-15', status: 'valid', fileType: 'PDF', fileSize: 1240000,
        ocrContent: '企业名称：苏州星瞳智算科技有限公司 统一社会信用代码：91320500MAXXXXXXXXX 法定代表人：张宇明 注册资本：100万人民币 成立日期：2023-03-15',
        extractedData: { '企业名称': '苏州星瞳智算科技有限公司', '信用代码': '91320500MAXXXXXXXXX', '法定代表人': '张宇明', '注册资本': '100万', '成立日期': '2023-03-15' }
    },
    {
        id: 'm2', name: '2025年度审计报告', category: 'finance', materialType: '审计报告',
        uploadDate: '2026-02-20', status: 'valid', fileType: 'PDF', fileSize: 5800000,
        ocrContent: '报告期间：2025年1月1日至2025年12月31日 营业收入：520万元 净利润：85万元 研发费用：125万元 总资产：380万元',
        extractedData: { '报告期间': '2025年度', '营业收入': '520万', '净利润': '85万', '研发费用': '125万', '总资产': '380万' }
    },
    {
        id: 'm3', name: '高新技术企业证书', category: 'qualification', materialType: '高新证书',
        uploadDate: '2025-06-10', validFrom: '2025-06-10', validTo: '2026-06-10', status: 'expiring', fileType: 'JPG', fileSize: 890000,
        extractedData: { '证书编号': 'GR202532XXXXXX', '发证日期': '2025-06-10', '有效期': '三年' }
    },
    {
        id: 'm4', name: '软件著作权登记证书（3项）', category: 'ip', materialType: '软著证书',
        uploadDate: '2025-09-05', status: 'valid', fileType: 'PDF', fileSize: 2300000,
        extractedData: { '登记号': '2025SR0XXXXXX 等3项', '软件名称': '星瞳算力编排系统 V1.0 等', '首次发表日期': '2025-05-01' }
    },
    {
        id: 'm5', name: '核心技术团队名单', category: 'personnel', materialType: '人员名单',
        uploadDate: '2026-01-20', status: 'valid', fileType: 'XLSX', fileSize: 45000,
    },
    {
        id: 'm6', name: '算法备案证明', category: 'qualification', materialType: '算法备案',
        uploadDate: '2024-11-01', validFrom: '2024-11-01', validTo: '2025-11-01', status: 'expired', fileType: 'PDF', fileSize: 670000,
        extractedData: { '备案编号': 'Algorithm-2024-XXXX', '备案日期': '2024-11-01' }
    },
    {
        id: 'm7', name: '数据安全评估报告', category: 'qualification', materialType: '安全评估',
        uploadDate: '2025-03-15', validFrom: '2025-03-15', validTo: '2026-03-15', status: 'expiring', fileType: 'PDF', fileSize: 3200000,
    },
    {
        id: 'm8', name: '科技项目验收报告', category: 'project', materialType: '验收报告',
        uploadDate: '2025-12-01', status: 'valid', fileType: 'PDF', fileSize: 4100000,
    },
];

// ==================== 材料工厂 Mock ====================
const mockPackagesData: MaterialPackage[] = [
    {
        id: 'pkg1', policyTitle: '人工智能算力平台专项补贴', totalItems: 8, completedItems: 8,
        status: 'ready', lastUpdated: '2026-03-01', preReviewScore: 92,
        materialChecklist: [
            { name: '企业注册登记表', status: 'ready', source: '已匹配：营业执照' },
            { name: '企业研发活动情况表', status: 'ready', source: '已匹配：审计报告、研发项目清单' },
            { name: '知识产权汇总表', status: 'ready', source: '已匹配：软著证书(3)' },
            { name: '科技人员情况表', status: 'ready', source: '已匹配：核心技术团队名单' },
            { name: '财务报表', status: 'ready', source: '已匹配：2025年审计报告' },
            { name: '研发费用辅助账', status: 'ready', source: '已匹配：财务报表' },
            { name: '算力使用证明', status: 'ready', source: '已匹配：算力补贴凭证' },
            { name: '算法备案证明', status: 'ready', source: '已匹配：算法备案证明' },
        ],
        preReviewReport: {
            errors: [],
            warnings: ['算法备案证明已过期，建议更新后重新提交'],
            suggestions: ['企业简介(120字)偏短，建议扩充至200-300字', '可补充算力平台的实际使用数据截图以增强说服力'],
        }
    },
    {
        id: 'pkg2', policyTitle: '企业研发机构与创新平台奖励', totalItems: 12, completedItems: 7,
        status: 'drafting', lastUpdated: '2026-03-03',
        materialChecklist: [
            { name: '企业注册登记表', status: 'ready', source: '已匹配：营业执照' },
            { name: '研发组织管理制度', status: 'ready', source: 'AI 生成初稿' },
            { name: '研发项目立项报告', status: 'ready', source: 'AI 生成初稿' },
            { name: '知识产权清单', status: 'ready', source: '已匹配：软著证书' },
            { name: '财务报表', status: 'ready', source: '已匹配：2025年审计报告' },
            { name: '研发费用专项审计报告', status: 'missing', note: '需会计师事务所出具' },
            { name: '研发人员花名册', status: 'ready', source: '已匹配：核心技术团队名单' },
            { name: '科技人员学历证明', status: 'warning', note: '已上传3人，还需补充2人' },
            { name: '研发场地证明', status: 'missing', note: '需提供租赁合同或产权证明' },
            { name: '项目验收报告', status: 'ready', source: '已匹配：科技项目验收报告' },
            { name: '产学研合作协议', status: 'missing', note: '如有高校合作可提供' },
            { name: '技术方案说明书', status: 'missing', note: 'AI 正在根据 BP 生成' },
        ],
    },
    {
        id: 'pkg3', policyTitle: '苏州市智改数转专项资金', totalItems: 10, completedItems: 10,
        status: 'ai_reviewing', lastUpdated: '2026-02-28', preReviewScore: 78,
        materialChecklist: [
            { name: '企业基本信息表', status: 'ready', source: '已匹配：营业执照' },
            { name: '项目实施方案', status: 'ready', source: 'AI 生成' },
            { name: '智能化改造清单', status: 'ready', source: 'AI 生成' },
            { name: '项目预算书', status: 'ready', source: 'AI 生成' },
            { name: '财务报表', status: 'ready', source: '已匹配：2025年审计报告' },
            { name: '设备采购合同', status: 'ready', source: '用户上传' },
            { name: '软件系统截图', status: 'ready', source: '用户上传' },
            { name: '数字化诊断报告', status: 'ready', source: 'AI 生成' },
            { name: '知识产权证明', status: 'ready', source: '已匹配：软著证书' },
            { name: '项目团队介绍', status: 'ready', source: '已匹配：核心技术团队名单' },
        ],
        preReviewReport: {
            errors: ['审计报告中员工人数(25人)与申请书(30人)不一致'],
            warnings: ['研发费用占比(3.1%)接近最低要求(3%)，驳回风险较高，建议说明研发费用归集口径', '项目预算中"其他费用"占比偏高(25%)，建议拆分至具体科目'],
            suggestions: ['项目实施方案中可补充行业对标案例', '建议附上系统实际运行界面截图'],
        }
    },
    {
        id: 'pkg4', policyTitle: '大模型专项扶持计划', totalItems: 15, completedItems: 15,
        status: 'exported', lastUpdated: '2025-11-15', preReviewScore: 88,
        materialChecklist: [
            { name: '企业基本信息', status: 'ready', source: '已匹配' },
            { name: '技术方案', status: 'ready', source: 'AI 生成' },
            { name: '财务报表', status: 'ready', source: '已匹配' },
        ],
        preReviewReport: {
            errors: [],
            warnings: [],
            suggestions: ['整体质量良好'],
        }
    },
];

// ==================== 素材缺失提醒 Mock ====================
const mockMaterialAlerts: MaterialAlert[] = [
    { missingName: '2024年社保缴纳证明', requiredByCount: 3 },
    { missingName: '研发费用专项审计报告', requiredByCount: 2 },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApplicationService = {
    getApplications: async (): Promise<ApplicationRecord[]> => {
        await delay(500);
        return mockApplicationsData;
    },
    getMaterials: async (): Promise<MaterialItem[]> => {
        await delay(400);
        return mockMaterialsData;
    },
    getPackages: async (): Promise<MaterialPackage[]> => {
        await delay(600);
        return mockPackagesData;
    },
    getMaterialAlerts: async (): Promise<MaterialAlert[]> => {
        await delay(300);
        return mockMaterialAlerts;
    },
    getMaterialDetail: async (appId: string): Promise<MaterialDetailData> => {
        await delay(600);
        const detailMap: Record<string, MaterialDetailData> = {
            app1: {
                applicationId: 'app1',
                policyTitle: '人工智能算力平台专项补贴',
                agency: '苏州市工信局',
                completeness: 100,
                checklist: [
                    { name: '企业注册登记表', status: 'ready', source: '已从素材库匹配：营业执照' },
                    { name: '企业研发活动情况表', status: 'ready', source: '已从素材库匹配：审计报告、研发项目清单' },
                    { name: '知识产权汇总表', status: 'ready', source: '已从素材库匹配：软著证书(3)' },
                    { name: '科技人员情况表', status: 'ready', source: '已从素材库匹配：核心技术团队名单' },
                    { name: '财务报表', status: 'ready', source: '已从素材库匹配：2025年审计报告' },
                    { name: '研发费用辅助账', status: 'ready', source: '已从素材库匹配：财务报表' },
                    { name: '算力使用证明', status: 'ready', source: '已从素材库匹配：算力补贴凭证' },
                    { name: '算法备案证明', status: 'ready', source: '已从素材库匹配：算法备案证明' },
                ],
                smartSuggestions: [],
                preReviewScore: 92,
                preReviewReport: {
                    errors: [],
                    warnings: ['算法备案证明已过期，建议更新后重新提交'],
                    suggestions: [
                        '企业简介(120字)偏短，建议扩充至200-300字',
                        '可补充算力平台的实际使用数据截图以增强说服力',
                    ],
                },
                isFinalized: true,
                finalScore: 92,
                redirectUrl: 'https://fuwu.most.gov.cn',
                redirectLabel: '科学技术部政务服务平台',
            },
            app2: {
                applicationId: 'app2',
                policyTitle: '企业研发机构与创新平台奖励',
                agency: '江苏省科技厅',
                completeness: 58,
                checklist: [
                    { name: '企业注册登记表', status: 'ready', source: '已从素材库匹配：营业执照' },
                    { name: '研发组织管理制度', status: 'ready', source: 'AI 生成初稿' },
                    { name: '研发项目立项报告', status: 'ready', source: 'AI 生成初稿' },
                    { name: '知识产权清单', status: 'ready', source: '已从素材库匹配：软著证书' },
                    { name: '财务报表', status: 'ready', source: '已从素材库匹配：2025年审计报告' },
                    { name: '研发费用专项审计报告', status: 'missing', note: '需会计师事务所出具' },
                    { name: '研发人员花名册', status: 'ready', source: '已从素材库匹配：核心技术团队名单' },
                    { name: '科技人员学历证明', status: 'warning', note: '已上传3人，还需补充2人' },
                    { name: '研发场地证明', status: 'missing', note: '需提供租赁合同或产权证明' },
                    { name: '项目验收报告', status: 'ready', source: '已从素材库匹配：科技项目验收报告' },
                    { name: '产学研合作协议', status: 'missing', note: '如有高校合作可提供，非必填' },
                    { name: '技术方案说明书', status: 'missing', note: 'AI 正在根据 BP 生成中...' },
                ],
                smartSuggestions: [
                    '研发费用专审报告建议找有资质的会计师事务所出具',
                    '推荐机构：XX 会计师事务所（已服务 50+ 企业高新申报）',
                    '科技人员学历证明需补充2人，可从企业画像「人员资质」模块一键导入',
                ],
                isFinalized: false,
            },
            app3: {
                applicationId: 'app3',
                policyTitle: '苏州市智改数转专项资金',
                agency: '苏州市工信局',
                completeness: 100,
                checklist: [
                    { name: '企业基本信息表', status: 'ready', source: '已从素材库匹配：营业执照' },
                    { name: '项目实施方案', status: 'ready', source: 'AI 生成' },
                    { name: '智能化改造清单', status: 'ready', source: 'AI 生成' },
                    { name: '项目预算书', status: 'ready', source: 'AI 生成' },
                    { name: '财务报表', status: 'ready', source: '已从素材库匹配：2025年审计报告' },
                    { name: '设备采购合同', status: 'ready', source: '用户上传' },
                    { name: '软件系统截图', status: 'ready', source: '用户上传' },
                    { name: '数字化诊断报告', status: 'ready', source: 'AI 生成' },
                    { name: '知识产权证明', status: 'ready', source: '已从素材库匹配：软著证书' },
                    { name: '项目团队介绍', status: 'ready', source: '已从素材库匹配：核心技术团队名单' },
                ],
                smartSuggestions: [
                    '项目实施方案中可补充行业对标案例以提升竞争力',
                    '建议附上系统实际运行界面截图',
                ],
                preReviewScore: 78,
                preReviewReport: {
                    errors: ['审计报告中员工人数(25人)与申请书(30人)不一致'],
                    warnings: [
                        '研发费用占比(3.1%)接近最低要求(3%)，驳回风险较高，建议在申报书中详细说明研发费用归集口径',
                        '项目预算中"其他费用"占比偏高(25%)，建议拆分至具体科目',
                    ],
                    suggestions: [
                        '项目实施方案中可补充行业对标案例',
                        '建议附上系统实际运行界面截图',
                    ],
                },
                isFinalized: false,
                redirectUrl: 'https://sthjj.suzhou.gov.cn',
                redirectLabel: '苏州市工信局政务平台',
            },
        };
        return detailMap[appId] || detailMap['app2'];
    },
};
