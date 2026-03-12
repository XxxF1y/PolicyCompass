# 工作台总览开发 Tips（维护版）

本文用于后续维护“企业工作台总览”页面，避免前后端对数据来源理解不一致。

## 1. 当前数据托管状态

截至 2026-03-12：

- `overview`：后端实时聚合数据库结果。
- `tasks`：后端实时聚合数据库结果。
- `growth`：后端从数据库表读取并组装结构化响应（不再是硬编码）。

前端目前仍保留了 fallback mock：
- 后端不可用、鉴权失败时，页面会回退本地 mock 数据。
- 若要“完全后端托管”，需移除前端 service 中的 `catch -> return mock` 逻辑。

## 2. 接口清单（总览页）

- `GET /api/v1/dashboard/enterprise/overview`
- `GET /api/v1/dashboard/enterprise/tasks`
- `GET /api/v1/dashboard/enterprise/growth`

要求：
- 三个接口都需要 `Authorization: Bearer <token>`。
- 统一通过前端 `apiClient` 注入鉴权头。

## 3. overview / tasks 的数据库来源（聚合）

### 3.1 overview

主要由以下业务表聚合：
- `match_results`
- `applications`
- `materials`
- `policies`
- `enterprises / talents / parks`（用于展示名、画像完整度）

典型字段含义：
- `displayName`：优先取画像名称，无则回退手机号。
- `openPoliciesCount`：高匹配且近期可申报政策数。
- `estimatedAmount`：匹配可申报金额汇总。
- `processingCount`：申报处理中数量。
- `fatalBlockerCount / fatalBlockerReason`：低匹配且存在卡点项。

### 3.2 tasks

主要由以下表聚合：
- `applications`（申报任务）
- `match_results`（卡点任务）
- `messages`（消息任务）

无数据时后端返回 bootstrap 任务，避免页面空白。

## 4. growth 的数据库设计

`growth` 当前依赖 4 张表：

- `growth_stages`：阶段栏定义（标题、时期、背景色、宽度、排序）。
- `growth_nodes`：节点内容与位置（label/type/status/x/y/description/benefit/cost/tags/conditions）。
- `growth_connections`：节点连线关系（from_node_id -> to_node_id）。
- `growth_summaries`：右侧摘要（总收益、当前阶段、下一步建议）。

迁移文件：
- `backend/alembic/versions/e91f4c4d3a21_add_growth_tables_and_seed_data.py`

## 5. 前端如何拼成图（关键规则）

前端并不会“猜”结构，完全按接口返回拼图：

1. `stages[]` 决定阶段栏。
2. `nodes[]` 决定节点文案、样式、坐标。
3. `connections[]` 决定连线。

连线规则：
- `connections[].from` 与 `connections[].to` 必须是 `nodes[].id`。
- 后端内部可用数据库主键关联，但对前端返回时要映射成节点编码（当前为 `code`，如 `"1"`, `"2"`）。

坐标规则：
- `x/y` 为画布坐标，修改节点位置时同步检查连接线重叠和可读性。

## 6. 常见维护动作

### 6.1 新增 growth 节点

1. 在 `growth_nodes` 增加节点。
2. 视情况在 `growth_connections` 增加边。
3. 如要被“下一步推荐”命中，更新 `growth_summaries.next_recommendation_node_id`。
4. 保证 `code` 全局唯一，避免前端节点冲突。

### 6.2 修改展示文案

- 改 `growth_nodes.label/description/benefit/cost` 即可。
- `tags`、`conditions` 当前用 JSON 字符串存储，后端会反序列化成数组。

### 6.3 排查“有节点没连线”

先检查：
- `growth_connections` 是否存在对应 `from_node_id / to_node_id`。
- 对应节点是否存在。
- 节点 `code` 是否重复或被误改。

## 7. 联调检查清单

每次改总览相关逻辑后，至少检查：

1. `POST /api/v1/auth/login` 能拿到 token。
2. 三个总览接口都返回 `200`。
3. 前端进入工作台时：
   - 总览卡片有值；
   - 进行中任务能跳转；
   - growth 图节点与连线完整。
4. 后端不可用时 fallback 是否符合预期（如果尚未移除）。

## 8. 后续建议（可选）

- 若确定进入生产态，建议移除总览 fallback mock，改成错误态展示（空态 + 重试按钮）。
- 将 `tags_json` / `conditions_json` 从文本迁移为 `JSONB`，减少序列化错误风险。
- 补一个后台配置页，支持运营直接维护 growth 节点与连线。
