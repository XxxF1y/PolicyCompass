# 开发维护总文档（Development Tips）

本文件用于沉淀各页面/模块的开发约定，减少前后端与数据库理解偏差。

## 1. 使用方式

- 新开发一个页面：先补本文件对应章节。
- 修改接口/表结构：同步更新“接口”和“数据表”小节。
- 联调完成后：补“联调检查清单”。

---

## 2. 认证模块（登录/注册）

### 2.1 前端位置
- `frontend/src/pages/auth/LoginPage.tsx`
- `frontend/src/pages/auth/RegisterPage.tsx`
- `frontend/src/services/authService.ts`
- `frontend/src/services/apiClient.ts`

### 2.2 后端接口
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`

### 2.3 数据表
- `users`（用户主表）
- 角色画像扩展表：`enterprises` / `talents` / `parks`

### 2.4 维护要点
- 手机号注册约束：11位纯数字。
- 验证码当前为短期校验逻辑（不长期入库）。
- 鉴权头统一由 `apiClient` 注入。

### 2.5 验证码策略（当前约定）
- 当前注册流程中，验证码字段 `code` 为占位字段。
- 现阶段规则：前端可填写任意值，后端不做真实短信校验，不写入数据库。
- 数据库存储中不保留验证码明文或历史记录。
- 若后续接入真实短信服务，再新增：
  - 发送验证码接口（带频控/过期时间）。
  - 短期验证码存储（如 Redis）与校验逻辑。
  - 防刷与风控（IP/手机号限流、错误次数限制）。

---

## 3. 企业工作台总览（Dashboard）

### 3.1 前端位置
- `frontend/src/pages/dashboard/DashboardPage.tsx`
- `frontend/src/services/dashboardService.ts`
- `frontend/src/services/growthService.ts`

### 3.2 后端接口
- `GET /api/v1/dashboard/enterprise/overview`
- `GET /api/v1/dashboard/enterprise/tasks`
- `GET /api/v1/dashboard/enterprise/growth`

### 3.3 当前托管状态
- `overview`：数据库聚合。
- `tasks`：数据库聚合。
- `growth`：数据库读取（已非硬编码）。
- 前端目前仍有 fallback mock（后端不可用时兜底）。

### 3.4 overview/tasks 数据来源
- `overview` 主要聚合：`match_results`、`applications`、`materials`、`policies`、`enterprises/talents/parks`。
- `tasks` 主要聚合：`applications`、`match_results`、`messages`。

### 3.5 growth 数据模型
- `growth_stages`：阶段定义
- `growth_nodes`：节点定义（内容+坐标）
- `growth_connections`：连线定义
- `growth_summaries`：摘要与下一步建议

迁移文件：
- `backend/alembic/versions/e91f4c4d3a21_add_growth_tables_and_seed_data.py`

### 3.6 前端拼图规则
- `stages[]`：决定阶段栏。
- `nodes[]`：决定节点内容与位置。
- `connections[]`：决定节点连线。
- `connections.from/to` 必须能匹配 `nodes.id`。

### 3.7 联调最小清单
1. 登录拿 token。
2. 三个总览接口均返回 200。
3. 页面展示卡片、任务、成长图完整。

---

## 4. 画像模块（企业/人才/园区）

### 4.1 数据表
- `enterprises`
- `talents`
- `parks`

### 4.2 维护要点
- 画像完整度会影响工作台匹配结果展示。
- 画像字段变更后，要同步检查总览页聚合逻辑。

---

## 5. 申报模块

### 5.1 数据表
- `applications`
- `materials`
- `policies`

### 5.2 维护要点
- 申报状态枚举变更时，要同步更新：
  - 后端任务聚合状态映射
  - 前端状态文案显示

---

## 6. 消息模块

### 6.1 数据表
- `messages`

### 6.2 维护要点
- 未读消息会进入工作台 `tasks` 聚合。
- 消息类型扩展需同步任务分类映射。

---

## 7. 园区与协同模块（待持续补充）

### 7.1 相关模块
- 园区工作台
- 产业协同
- 招商线索

### 7.2 待补充项
- 页面列表
- 接口清单
- 数据表关系
- 聚合口径

---

## 8. 通用约定

### 8.1 接口返回
- 统一使用 `ResponseModel` 包装。
- 鉴权接口默认要求 Bearer Token。

### 8.2 变更同步原则
- 改表结构：必须更新 Alembic 迁移与本文档。
- 改接口字段：必须同步前端类型与 service。
- 改业务口径：必须补“字段含义/聚合规则”说明。

### 8.3 发布前检查
1. `backend` 迁移已执行到 `head`。
2. 核心接口冒烟通过。
3. `frontend npm run build` 通过。

---

## 9. 变更记录

- 2026-03-12：建立总维护文档；纳入认证与企业工作台总览（含 growth 数据库化）。
