// ==================== 申报记录 ====================

export type AppStatus =
    | 'generating'          // 材料生成中
    | 'pre_reviewed'        // 预审完成
    | 'pending_redirect'    // 待前往申报
    | 'redirected'          // 已前往申报
    | 'estimated_reviewing' // 预估审核中
    | 'passed'              // 已通过
    | 'rejected'            // 未通过
    | 'returned'            // 已退回
    | 'granted';            // 已拨付

export interface ApplicationRecord {
    id: string;
    policyTitle: string;
    agency: string;
    amount: string;
    status: AppStatus;

    // 时间线
    materialGenerateTime: string;
    preReviewTime?: string;
    preReviewType?: 'ai' | 'expert';

    // 跳转
    redirectUrl?: string;
    redirectTime?: string;

    // 预估审核
    estimatedReviewStage?: string;
    estimatedResultDate?: string;

    // 用户反馈
    actualResult?: 'passed' | 'rejected' | 'returned';
    resultScreenshotUrl?: string;
    rejectReason?: string;
    grantAmount?: string;

    progress: number;
}

// ==================== 素材管理 ====================

export type MaterialCategory = 'license' | 'finance' | 'qualification' | 'ip' | 'personnel' | 'project';
export type MaterialStatus = 'valid' | 'expiring' | 'expired';

export interface MaterialItem {
    id: string;
    name: string;
    category: MaterialCategory;
    materialType: string;           // 具体类型（营业执照/审计报告 etc.）
    uploadDate: string;
    validFrom?: string;
    validTo?: string;
    status: MaterialStatus;
    fileType: string;
    fileSize?: number;              // 字节
    ocrContent?: string;            // OCR 原始文本
    extractedData?: Record<string, string>;  // 结构化提取数据
}

// ==================== 材料工厂 ====================

export type PackageStatus = 'drafting' | 'ai_reviewing' | 'expert_reviewing' | 'ready' | 'exported';

export interface ChecklistItem {
    name: string;
    status: 'ready' | 'missing' | 'warning';
    source?: string;
    note?: string;
}

export interface PreReviewReport {
    errors: string[];
    warnings: string[];
    suggestions: string[];
}

export interface MaterialPackage {
    id: string;
    policyTitle: string;
    totalItems: number;
    completedItems: number;
    status: PackageStatus;
    lastUpdated: string;
    preReviewScore?: number;
    materialChecklist?: ChecklistItem[];
    preReviewReport?: PreReviewReport;
}

// ==================== 素材缺失提示 ====================

export interface MaterialAlert {
    missingName: string;
    requiredByCount: number;       // 几项政策需要
}

// ==================== 材料生成详情页 ====================

export interface MaterialDetailData {
    applicationId: string;
    policyTitle: string;
    agency: string;
    completeness: number;            // 0-100 材料完整度
    checklist: ChecklistItem[];
    smartSuggestions: string[];
    preReviewScore?: number;
    preReviewReport?: PreReviewReport;
    isFinalized: boolean;            // 是否已定稿
    finalScore?: number;
    redirectUrl?: string;
    redirectLabel?: string;          // "科学技术部政务服务平台" 等
}
