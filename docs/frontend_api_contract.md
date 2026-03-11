# PolicyCompass API 集成文档 (Frontend to Backend)

本篇文档由前端团队出具，旨在为后端团队提供所有已重构为异步加载页面的 **接口设计契约与数据结构格式**。

目前前端页面已去除所有组件内的硬编码假数据，通过统一的 `src/services/` 接口和 `src/types/` 类型定义进行异步拦截模拟。

后端团队开发对应的 RESTful API 时，**必须严格遵守** 以下各模块中定义的数据结构、字段名称以及对应的枚举值（Enums），以确保联调直接顺畅。

---

## 目录
1. [通用约束与规范](#通用约束与规范)
2. [认证与主控制台 (Auth & Dashboard)](#认证与主控制台-auth--dashboard)
3. [画像中心 (Profile Center)](#画像中心-profile-center)
4. [智能匹配与政策详情 (Matching & Policy)](#智能匹配与政策详情-matching--policy)
5. [产业协同网络 (Collaboration)](#产业协同网络-collaboration)
6. [申报中心 (Applications & Materials)](#申报中心-applications--materials)
7. [消息与通知 (Messages)](#消息与通知-messages)
8. [成长导航仪 (Growth Navigator)](#成长导航仪-growth-navigator)

---

## 1. 通用约束与规范

### 网络请求
前端预留的请求工具是标准 `Fetch API` 或是 `Axios`（后续接入）。所有涉及后端查询的请求预计在未来替换掉 `src/services/` 内置的 `setTimeout` 延迟并使用真实 URL。

### 数据包装
对于所有列举的数据结构（以 `Interface` 书写），后端在 Response 中应当用一个通用标准体进行包装，如：
```json
{
  "code": 200,
  "message": "success",
  "data": { ... } // 以下文档中定义的数据结构包裹在这里
}
```

---

## 2. 认证与主控制台 (Auth & Dashboard)

### 获取企业/人才控制台概览数据
**接口定位**: `GET /api/v1/dashboard/enterprise/stats`  (或通过 Token 内部判断)

**前端需求接口 (`DashboardStats`)**:
```typescript
interface DashboardStats {
    matchCount: number;         // 智能匹配到的政策总数
    subsidyAmount: string;      // 预估最高补贴额度 (字符串，如 "380 万")
    applicationCount: number;   // 申报中的任务数
    taskCount: number;          // 待办/协同任务数
    total_policies: number;     // 平台政策基数总数
    matched_enterprises: number;// 已服务企业数
    generated_materials: number;// 累计生成的材料数
    success_rate: string;       // 申报成功率 (如 "89%")
}
```

### 获取园区控制台概览数据 (Park Space)
**接口定位**: `GET /api/v1/dashboard/park/stats`

**前端需求接口 (`ParkStats`)**:
```typescript
interface ParkStats {
    activeEnterprises: number;   // 园区内在驻活跃企业数
    totalOutputValue: string;    // 园区累计产值 (字符串，如 "120 亿")
    settlementRate: string;      // 园区入驻率 (如 "92%")
    policyMatchedSubsidy: string;// 累计帮助企业获取补贴额
    investmentTargets: {         // 招商意向/雷达列表
        id: string;
        name: string;
        tag: string;             // 如 "强链企业"
        progress: number;        // 意向进度 0-100
        matchReason: string;     // 匹配园区的判定理由
    }[];
    trendData: {                 // 招商趋势图数据 (按月)
        month: string;
        入驻意向: number;
        已落户: number;
    }[];
}
```

---

## 3. 画像中心 (Profile Center)

前端通过此单点接口拉取企业、人才或园区的雷达图评测分、完成度及行动建议（Alerts）。

**接口定位**: `GET /api/v1/profile/summary?role={talent|enterprise|park}`

**前端需求接口 (`ProfileData`)**:
```typescript
interface ProfileData {
    role: 'talent' | 'enterprise' | 'park';
    completionRate: number;      // 0-100 进度条
    radarData: {                 // 动态雷达图的 6 个维度
        subject: string;         // 如 "创新能力"
        A: number;               // 分数
        fullMark: number;        // 满分 (固定 100)
    }[];
    alert: {                     // 顶部智能提示块
        title: string;
        description: string;
        missingCount?: number;   // 缺失的必填项数量
        tips: {                  // 建议完善的选项
            id: string;
            content: string;     // 具体事宜 (如 "更新营收")
            actionLabel: string; // 标签 (如 "加分项")
            type: 'warning' | 'success' | 'info' | 'bonus'; 
        }[];
    };
}
```

*(注意：具体的庞长画像输入表单项（如资本、人员数量），会在后续设计专门的 `/api/v1/profile/detail` 全量聚合字段文档，此处先处理 Dashboard 需要的展示流。)*

---

## 4. 智能匹配与政策详情 (Matching & Policy)

### 获取政策列表 (智能匹配引擎)
**接口定位**: `GET /api/v1/policies/matches`

**前端需求接口 (`PolicyItem`)**:
```typescript
type MatchType = 'strong' | 'potential' | 'normal';
type TagColor = 'blue' | 'purple' | 'orange' | 'green' | 'red';

interface PolicyItem {
    id: string;
    title: string;
    level: string;           // 如 "国家级"
    levelColor: TagColor;
    department: string;      // 发文部门
    category: string;        // 类别
    matchScore: number;      // 0-100 (外置圆环进度)
    matchType: MatchType;    // matching type flag
    publishDate: string;
    deadline?: string;       // YYYY-MM-DD
    maxAmount: string;       // 最高额度描述
    matchReasons: string[];  // ['企业属于XX产业', '高企认证有效']
    blockers?: string[];     // ['缺少知识产权2项'] (如果有则生成 blocker 逻辑锁)
    viewCount: number;
    favorited: boolean;
}
```

### 获取单个政策图谱详情
**接口定位**: `GET /api/v1/policies/{id}`

返回非常丰富的数据维系 7大面板，包括知识图谱树。详见此页面特定的接口类型：
```typescript
interface PolicyDetail {
    id: string;
    title: string;
    level: string;
    department: string;
    publishDate: string;
    deadline: string;
    status: '申报中' | '已截止' | '即将开始';
    views: number;
    favorites: number;
    tags: string[];
    
    // AI 解读模块
    aiSummary: string;
    aiHighlights: string[];
    
    // 解析条件模块 (基础 vs 加分)
    parsedConditions: {
        required: string[];
        bonus: string[];
    };
    
    // 核心扶持收益
    supportBenefits: {
        title: string;
        amount: string;
        description: string;
    }[];
    
    // 上下游/前置图谱关联
    graphRelations: {
        prerequisites: { id: string; title: string; required: boolean }[];
        nextSteps: { id: string; title: string; type: 'advance' | 'expand' }[];
    };
    
    // 当前用户的匹配诊断卡
    myMatchStatus: {
        score: number;
        status: 'ready' | 'missing_info' | 'not_match';
        passItems: string[];
        failItems: { label: string; action: string }[]; // 'label': 缺项, 'action': 该去更新什么
        amountEstimate: string;
    };
}
```

---

## 5. 产业协同网络 (Collaboration)

**接口定位**: `GET /api/v1/collaboration/opportunities`

**前端需求接口 (`CollabOpportunity`)**:
```typescript
type MatchLevel = 'strong' | 'normal';
type CollabStatus = 'pending_response' | 'needs_info' | 'connected';

interface CollabOpportunity {
    id: string;
    level: MatchLevel;       // 是否为爆款推荐
    type: string;            // 如 "上下游联合申报"
    policyTitle: string;
    partnerName: string;     // 合作方名称 (可能脱敏)
    partnerInfo: string;     // 合作方附加信息或匹配纯度
    description: string;     // 供需大段描述
    matchReason?: string;    // 系统判定牵线的理由
    blocker?: string;        // 需要补全卡点的地方
    expectedReturn: string;  // 联合总收益估算
    status: CollabStatus;    // 当前我的介入状态
    statusLabel: string;     // 状态中文文本
}
```

---

## 6. 申报中心 (Applications & Materials)

申报中心整合了三大子模块：追踪表、自有素材库、材料工厂加工台。

**(1) 我的申报记录**
**接口定位**: `GET /api/v1/applications/records`

```typescript
type AppStatus = 'generating' | 'pre_reviewed' | 'pending_submit' | 'reviewing' | 'passed' | 'rejected' | 'returned';

interface ApplicationRecord {
    id: string;
    policyTitle: string;
    agency: string;
    amount: string;
    status: AppStatus;
    submitDate: string;
    estimatedResult?: string;
    progress: number; // 0-100 (底侧进度条)
}
```

**(2) 我的素材库 (证明书/财报/专利)**
**接口定位**: `GET /api/v1/applications/materials`

```typescript
type MaterialCategory = 'license' | 'finance' | 'qualification' | 'ip' | 'personnel' | 'project';
type MaterialStatus = 'valid' | 'expiring' | 'expired';

interface MaterialItem {
    id: string;
    name: string;
    category: MaterialCategory;
    uploadDate: string;     // YYYY-MM-DD
    validTo?: string;       // 有效期及判定
    status: MaterialStatus; 
    fileType: string;       // 原文件扩展名，如 PDF
}
```

**(3) 可提报材料包列表 (AI Generator Table)**
**接口定位**: `GET /api/v1/applications/packages`

```typescript
type PackageStatus = 'drafting' | 'ai_reviewing' | 'expert_reviewing' | 'ready' | 'exported';

interface MaterialPackage {
    id: string;
    policyTitle: string;
    totalItems: number;     // 政策硬性要求的长清单项数
    completedItems: number; // 当前 AI/人工已筹备完毕项数
    status: PackageStatus;
    lastUpdated: string;
    preReviewScore?: number;// 提前 AI 诊断得分
}
```

---

## 7. 消息与通知 (Messages)

**接口定位**: `GET /api/v1/messages`

```typescript
type MessageType = 'policy' | 'match' | 'application' | 'collaboration' | 'system';

interface Message {
    id: string;
    type: MessageType;       // 决定使用什么图标及底色
    title: string;
    content: string;
    time: string;            // 如 "10 分钟前", 建议后端传 timestamp 前端格式化
    isRead: boolean;         // 未读小红点标记
}
```

---

## 8. 成长导航仪 (Growth Navigator)

成长导航仪是系统中**最复杂的可视化组件**，它以横向有向图（DAG）的形式展示企业从"OPC起步"到"国家级小巨人"的完整成长路径。

该组件涉及 **图论数据模型**：节点（Node）、边（Connection）、阶段（Stage）、以及一个总览摘要（Summary）。

**接口定位**: `GET /api/v1/growth/navigator`

> ⚠️ **重要说明**：该接口应当是**个性化的**。后端需要根据当前登录企业的画像（Profile）、已获资质、已申报政策等信息，动态计算每个节点的 `status`（已完成/推荐/锁定/远期），以及 `summary` 中的推荐建议。

### 顶层数据结构 (`GrowthNavigatorData`)
```typescript
interface GrowthNavigatorData {
    stages: GrowthStage[];
    nodes: GrowthNode[];
    connections: GrowthConnection[];
    summary: GrowthSummary;
}
```

### 阶段定义 (`GrowthStage`)
定义水平时间轴上的各个成长阶段背景条。
```typescript
interface GrowthStage {
    id: string;           // 如 "s1"
    title: string;        // 如 "阶段一：OPC起步期"
    period: string;       // 如 "2024年"
    bgColor: string;      // Tailwind class，如 "bg-emerald-50/60"
    width: number;        // 像素宽度 (控制该阶段在画布中的占比)
}
```

### 节点定义 (`GrowthNode`)
每个节点代表一个政策申报事件、资质认定、或关键里程碑。
```typescript
type NodeType = 'milestone' | 'policy' | 'qualification';
type NodeStatus = 'completed' | 'recommended' | 'locked' | 'future';

interface GrowthNode {
    id: string;
    label: string;              // 节点标题 (如 "高新技术企业认定")
    type: NodeType;             // 节点类型
    status: NodeStatus;         // ⭐ 核心字段：后端需动态计算
    x: number;                  // 画布横向像素坐标
    y: number;                  // 画布纵向百分比位置 (25/50/75 形成三条泳道)
    description?: string;       // 节点的详细说明文字
    benefit?: string;           // 预估收益描述 (如 "奖励30-50万+15%税惠")
    cost?: string;              // 预估投入描述 (如 "审计费约3万")
    tags?: string[];            // 附加标签 (如 ["关键里程碑", "2026复评"])
    conditions?: string[];      // 申报条件列表 (用于详情面板展示)
}
```

**`status` 字段的后端计算逻辑说明：**
| Status | 含义 | 后端判定规则 |
|---|---|---|
| `completed` | 已完成 | 企业已获得该资质/已完成该申报 |
| `recommended` | 当前推荐 | 前置条件已满足，AI 建议立即申报 |
| `locked` | 未解锁 | 前置条件尚未满足（需先完成其他节点） |
| `future` | 远期目标 | 距离目标仍需多步，非当前规划周期 |

### 边 / 连接定义 (`GrowthConnection`)
定义节点间的前置依赖关系（有向边），前端会据此绘制 Bezier 曲线箭头。
```typescript
interface GrowthConnection {
    from: string;    // 起始节点 ID
    to: string;      // 目标节点 ID
}
```

### 总览摘要 (`GrowthSummary`)
展示在图谱下方左侧的深色汇总卡中。
```typescript
interface GrowthSummary {
    totalEstimatedBenefit: string;      // 如 "400-600万"
    currentStage: string;               // 如 "阶段三：资质积累期"
    nextRecommendation: string;         // 如 "立即申报：科技型中小企业评价"
    nextRecommendationNodeId: string;   // 推荐节点的 ID，点击按钮会自动高亮该节点
}
```

---
**附录**：
所有前端涉及与这些结构桥接的 mock 数据服务代码均位于项目工程目录 `/frontend/src/services/` (如 `growthService.ts`, `messageService.ts`, `applicationService.ts` 等)。后端工程师在进行 Schema 设计与测试时，可以直接对照这些 TypeScript 源码校验结果。

