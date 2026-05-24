# NETE 前端接入指南（合约 + 服务端）


本文档面向前端工程，按业务流程说明如何接入链上合约与后端服务。


**近期更新摘要**


- 新增 `GET /v1/dividend/ledger`、`GET /v1/v9/pool-ledger`
- `referral/info` 增加 `team_count`（团队人数，伞下不含本人）
- `income/ledger` **合并**矿机流水与签单领取（referral/dividend/v9），统一按 `occurred_at` 排序
- `income/claims` 的 dividend 记录增加 `user_level`；referral 记录增加 `position_id`/`tier`
- `accel/reward-ledger` 增加 `tier`/`principal`/`is_airdrop`；新增 `GET /v1/miners/positions`
- `income/overview`、`performance/legs`、`referral/downlines` 增加 `effective_direct_count`、`max_depth` 等
- 领导人等级 **仅按小区矿机业绩** 定级；加速日结公式统一为 **本金 × 层比例 ÷ 周期天数**


## 1. 架构与职责


- 链上合约负责：资金结算、矿机状态、订单撮合、签名领取最终校验。
- 服务端负责：扫块索引、统计聚合、签名消息生成、keeper辅助任务。
- 前端建议：**写操作走合约，读操作优先服务端**（体验更好、聚合更完整）。


## 2. 前置配置


### 2.1 合约地址


需要以下地址（按环境区分）：


- `NeteToken`
- `NeteCore`
- `NeteNetwork`
- `NeteMarket`
- `USDT`


### 2.2 服务端基址


服务支持前缀路由（便于 Nginx 代理），例如：


- `http_base = /nete`
- API 根路径即 `/nete/...`
- 文档路径：`/nete/spec`
- OpenAPI JSON：`/nete/spec.json`


## 3. 业务流程总览


1. 进入页面 -> 拉运行时配置（服务端）
2. 用户绑定推荐关系（可选，链上）
3. 激活矿机（链上）
4. 收益查询（服务端）
5. 领取矿机收益/提现利润（链上，一键提取优先）
6. C2C 挂单/吃单（链上）
7. 推荐/分红/V9 签名领取（服务端拿签名 + 链上提交）


---


## 4. 启动阶段（页面初始化）


### 4.1 读运行时配置（服务端）


`GET /v1/config/runtime`


关键字段：


- `guide_min_price`, `guide_max_price`
- `designated_window`, `recycle_window`
- `require_sbt`, `repurchase_paused`, `presale_active`


前端用途：


- 控制挂单价格区间提示
- 控制矿机/复投按钮态
- 展示系统开关状态


---


## 5. 推荐关系流程


### 5.0 关键口径（前端必读）


| 概念 | 定义 | 主要接口字段 |
|------|------|----------------|
| **绑定直推** | 已 `bindReferrer` 的第一层下级 | `direct_count` |
| **有效直推** | 直推中至少激活过 **1 台付费矿机**（`isAirdrop=false`） | `effective_direct_count` |
| **团队人数** | 伞下所有层级下级地址数（**不含本人**） | `team_count` |
| **可享加速层数** | 由有效直推数决定：1~7 人 → 1~7 层（5%）；≥8 人 → 20 层（8~20 层 1%） | `max_depth` |
| **领导人等级 V1~V9** | 仅看 **小区矿机业绩** `small_leg_miner_perf`（种子业绩不参与定级） | `user_level` |
| **加速日结** | `Σ(下级每台在运行付费矿机本金 × 层比例 ÷ 档位周期天数)`，UTC 日结 | `referral_pool_balance` |
| **加速可领** | `min(待领池, Running 最高档付费矿机剩余 headroom)`，**不进钱包** | `pending_referral` |


有效直推判定（与后端一致）：该直推地址在 `miner_positions` 中存在 `is_airdrop=0` 的记录。


**领导人等级阈值（小区矿机业绩 NETE）**


| 等级 | 小区矿机业绩 ≥ |
|------|----------------|
| V1 | 10,000 |
| V2 | 30,000 |
| V3 | 100,000 |
| V4 | 350,000 |
| V5 | 1,100,000 |
| V6 | 3,600,000 |
| V7 | 15,000,000 |
| V8 | 50,000,000 |
| V9 | 达 V8 且 2 条直推线均为 V8+ |


---


### 5.1 绑定推荐人（链上）


合约：`NeteNetwork.bindReferrer(referrer)`


前端注意：


- 一次性绑定，不可重复。
- 需要在交易前校验 `referrer != self`。
- 建议先读链上 `NeteNetwork.getReferrer(user)` 或后端 `GET /v1/referral/info?user=...`，若已绑定则隐藏绑定按钮。
- 若用户未主动绑定，当前 `NeteCore.buySeed/activateMiner` 会尝试自动绑定到 `topReferrer`；但前端仍建议显式引导用户先绑定真实邀请人。


推荐绑定交互建议：


1. 输入邀请人地址（二维码/邀请码解析后得到地址）。
2. 前端校验：
   - 地址格式合法
   - 不能等于当前钱包地址
3. 发起 `bindReferrer(referrer)` 交易。
4. 成功后刷新：
   - `GET /v1/referral/info?user=<address>`
   - `GET /v1/performance/personal?user=<address>`
   - `GET /v1/performance/legs?user=<address>`


### 5.2 读取推荐信息（服务端）


`GET /v1/referral/info?user=<address>`


返回：


- `referrer`, `direct_count`（绑定直推数）, `effective_direct_count`（有效直推购矿数）, `team_count`（团队人数，伞下全员不含本人）, `max_depth`（按有效直推解锁层数）
- `own_perf`, `subtree_perf`, `small_leg_perf`, `user_level`
- **定级口径**：`user_level` 仅看 `small_leg_miner_perf`（小区矿机业绩）；`small_leg_perf` 与矿机小区一致；种子业绩不计入定级
- `team_perf`（团队总业绩，不含本人）
- `team_big_leg_perf`, `team_small_leg_perf`（团队大区/小区业绩）
- `own_miner_perf`, `own_seed_perf`（`own_seed_perf` 为预售业绩）
- `subtree_miner_perf`, `subtree_seed_perf`（`subtree_seed_perf` 为团队预售业绩）
- `small_leg_miner_perf`, `small_leg_seed_perf`（`small_leg_seed_perf` 为小区预售业绩）
- `team_miner_total_perf`, `team_miner_big_leg_perf`, `team_miner_small_leg_perf`（团队矿机总和/大区/小区）
- `team_seed_total_perf`, `team_seed_big_leg_perf`, `team_seed_small_leg_perf`（团队种子总和/大区/小区）
- `direct_miner_perf`, `direct_presale_perf`, `direct_perf`（第一层直推业绩：矿机/预售/合计）


口径说明：


- `subtree_*` 为全子树口径（包含本人）
- `team_perf = subtree_perf - own_perf`（不含本人，仅团队下级）
- **定级与小区展示**：`small_leg_perf` = `small_leg_miner_perf`（仅矿机腿，不含种子腿）
- `team_small_leg_perf` = `small_leg_miner_perf`（团队小区矿机业绩）
- `team_big_leg_perf = team_perf - team_small_leg_perf`（团队口径仍含矿机+种子合计）
- `team_miner_total_perf = subtree_miner_perf - own_miner_perf`
- `team_miner_small_leg_perf = small_leg_miner_perf`
- `team_miner_big_leg_perf = team_miner_total_perf - team_miner_small_leg_perf`
- `team_seed_total_perf = subtree_seed_perf - own_seed_perf`
- `team_seed_small_leg_perf = small_leg_seed_perf`
- `team_seed_big_leg_perf = team_seed_total_perf - team_seed_small_leg_perf`
- `team_perf = team_miner_total_perf + team_seed_total_perf`
- `direct_*` 仅统计第一层直推用户的 `own_*` 之和，不包含更深层级


### 5.2.1 读取直推列表（服务端）


`GET /v1/referral/downlines?user=<address>`


**响应示例**


```json
{
  "user": "0xabc...",
  "direct_count": 2,
  "effective_direct_count": 1,
  "total": 2,
  "downlines": ["0x111...", "0x222..."],
  "entries": [
    { "user": "0x111...", "effective": true },
    { "user": "0x222...", "effective": false }
  ]
}
```


| 字段 | 说明 |
|------|------|
| `direct_count` | 绑定直推总数（= `total`） |
| `effective_direct_count` | 有效直推数（已购付费矿机） |
| `downlines` | 直推地址列表（兼容旧版，仅字符串） |
| `entries` | 直推明细；`effective=true` 表示有效直推 |
| `total` | 直推人数 |


### 5.3 个人业绩接口（服务端）


`GET /v1/performance/personal?user=<address>`


返回：


- `user`
- `miner_perf`（矿机业绩）
- `presale_perf`（预售业绩）
- `own_perf`（个人总业绩 = `miner_perf + presale_perf`）


### 5.4 大小区业绩接口（服务端）


`GET /v1/performance/legs?user=<address>`


**响应示例**


```json
{
  "user": "0xabc...",
  "team_perf": "33390000000000000000000",
  "big_leg_perf": "29570000000000000000000",
  "small_leg_perf": "3820000000000000000000",
  "small_leg_miner_perf": "3820000000000000000000",
  "user_level": 2,
  "direct_count": 2,
  "effective_direct_count": 1,
  "max_depth": 1
}
```


| 字段 | 说明 |
|------|------|
| `team_perf` | 团队总业绩（不含本人） |
| `big_leg_perf` | 大区业绩 |
| `small_leg_perf` | 小区业绩（**矿机口径**，用于定级展示） |
| `small_leg_miner_perf` | 与 `small_leg_perf` 相同 |
| `user_level` | V0~V9，由小区矿机业绩阈值决定 |
| `direct_count` / `effective_direct_count` / `max_depth` | 同 `referral/info` |


口径说明（后端中心化计算）：


- `team_perf = subtree_perf - own_perf`（不含本人；`subtree` 含矿机+种子）
- `big_leg_perf = team_perf - small_leg_perf`
- **`user_level` 仅由 `small_leg_miner_perf`（直推各腿矿机 subtree 的大区/小区差）决定**


---


## 6. 矿机流程（NeteCore）


### 6.1 激活矿机（链上）


1. `NeteToken.approve(NeteCore, amount)`
2. `NeteCore.activateMiner(tierIndex)`


`tierIndex` 默认档位对照（来源于合约 `TierLib.defaultTiers()`）：


| tierIndex | principal (NETE) | maxSlots | cycleDays | returnBps | feeBps |
|---:|---:|---:|---:|---:|---:|
| 0 | 100 | 1 | 35 | 0 | 2000 |
| 1 | 30 | 3 | 35 | 12000 | 2000 |
| 2 | 100 | 3 | 35 | 12000 | 2000 |
| 3 | 300 | 3 | 35 | 12000 | 2000 |
| 4 | 500 | 2 | 35 | 12500 | 2000 |
| 5 | 1000 | 1 | 40 | 13000 | 2000 |
| 6 | 3000 | 1 | 40 | 13500 | 2000 |
| 7 | 5000 | 1 | 40 | 13500 | 2000 |
| 8 | 10000 | 1 | 50 | 14000 | 2000 |
| 9 | 30000 | 1 | 50 | 14000 | 2000 |
| 10 | 50000 | 1 | 50 | 14000 | 2000 |


前端接入注意：


- `activateMiner` 仅允许付费档位（`tierIndex` 必须为 `1..10`）；传 `0` 会在链上 `revert InvalidTier()`。
- `tierIndex` 同时决定激活所需本金、同档位可持有上限、周期、总收益比例。
- 当 `presaleActive=true` 时，部分档位受预售额度限制（售罄会 `revert PresaleTierSoldOut()`）。
- 以上为默认配置，owner 可通过 `setTierConfig()` 调整，前端应以链上实时配置为准。
- 激活矿机支付来源（链上自动混合）：`repurchaseBalance`（本金池）优先 -> `positionProfit`（收益池）其次 -> 钱包 `NETE` 补差。


### 6.2 领取矿机收益（链上）


- `NeteCore.claimReward(positionId)`
- `NeteCore.claimAllRewards()`（一键领取所有可领收益）


按钮交互建议：


- **单笔领取**：在仓位卡片内保留 `claimReward(positionId)`，用于精细化领取。
- **一键领取**：在“我的矿机收益”区域提供主按钮，调用 `claimAllRewards()`。
- **按钮可用态**：
  - 若前端可计算到至少一个仓位存在 `pending > 0`，按钮可点击；
  - 否则可置灰，并提示“暂无可领取收益”。
- **发起后处理**：
  - 按单次链上交易处理（一个 tx）；
  - 成功后刷新仓位、`income/overview`、`income/ledger`。


失败提示建议：


- `NoPendingReward`：提示“当前没有可领取收益”。
- `PosPoolInsufficient`：提示“奖励池余额不足，请稍后再试”。
- 其它 `revert`：显示原始错误并给出“稍后重试/联系客服”。


与单笔领取的区别：


- **粒度**：
  - 单笔领取只处理一个 `positionId`；
  - 一键领取会遍历当前用户全部运行中仓位。
- **事件表现**：
  - 一键领取仍逐仓位产生原有事件（`RewardClaimed` / `AirdropRewardClaimed`）；
  - 后端索引与单笔领取一致，无需额外适配特殊聚合事件。
- **失败策略**：
  - 任何导致交易 `revert` 的条件会使整笔一键交易失败；
  - 前端应提示用户改用单笔领取排查具体仓位问题。


收益拆分口径（paid 矿机）：


- 每次 claim 按该仓位当期参数并行拆分，不再采用“先回本金、再计利润”。
- 设 `P=principal`，`R=totalReturn`，`pending=本次可领总额`：
  - `principalPart = pending * P / R`
  - `profitGross = pending - principalPart`
- 入账：
  - `principalPart -> repurchaseBalance`
  - `profitGross -> positionProfit`


### 6.2.1 BABT 签到（链上）


- `NeteCore.checkInWithBABT()`


新口径：


- 用户持有 `BABT`（当前合约用 `sbtContract` 地址校验余额）可签到。
- 每地址每 24h 仅可签到一次。
- 每次签到增加 `0.5333 NETE` 到签到收益池：`checkinProfitBalance[user]`。
- 用户一旦买过付费矿机（并自动获得空投矿机）后，签到入口关闭。


提现：


- `NeteCore.withdrawCheckInProfit(amount)` 提取签到收益。


### 6.3 提现利润（链上）


- `NeteCore.withdrawProfit(positionId, amount)`
- `NeteCore.withdrawAllProfit()`（一键提取当前地址全部仓位利润到钱包）


提现口径更新：


- 对**所有矿机（含空投矿机）**，提现时按仓位档位配置扣手续费：`fee = amount * tierConfigs[tierIndex].feeBps / 10000`。
- 当前默认配置下，`tier 0..10` 的 `feeBps=2000`，即统一 `20%`。
- 提现手续费分账仍走 `Burn/Treasury/Dividend`。


调费方式（owner）：


- 通过 `NeteCore.setTierConfig(...)` 更新各档 `feeBps`，无需新增独立手续费字段。
- 若使用升级脚本，可设置环境变量：
  - `APPLY_UNIFORM_WITHDRAW_FEE=true`
  - `WITHDRAW_FEE_BPS=2000`
  脚本会在升级后批量把 `tier 1..10` 的 `feeBps` 调整为目标值。


前端按钮建议：


- 主按钮：`一键提取收益到钱包` -> 调用 `withdrawAllProfit()`
- 次按钮（可选）：`按仓位提取` -> 调用 `withdrawProfit(positionId, amount)`


失败提示建议：


- `NoProfitToWithdraw`：提示“当前没有可提取利润”
- `InsufficientProfitBalance`：提示“提取金额超过仓位可提利润”
- 其它 `revert`：展示链上原始错误并提示稍后重试


### 6.3.1 一键复投按钮启用条件（前端）


链上一键复投入口：


- 兼容入口：`NeteCore.repurchaseExpiredMiners()`（默认 `Auto`）
- 显式支付模式入口：`NeteCore.repurchaseExpiredMinersWithMode(payMode)`


链上单个复投入口：


- 兼容入口：`NeteCore.repurchase(positionId)`（默认 `Auto`）
- 显式支付模式入口：`NeteCore.repurchaseWithMode(positionId, payMode)`


`payMode` 约定：


- `0`：仅本金池（`RepurchasePoolOnly`）
- `1`：仅钱包 NETE（`WalletOnly`）
- `2`：自动混合（`Auto`，本金池优先，其次收益池，不足再钱包补差）
- `3`：仅收益池（`ProfitOnly`，按用户各仓位 `positionProfit` 依次扣减）


复投函数会在链上自动处理“当前可结转但仍 Running 的付费矿机”结算，再进入复投判断。前端仍建议按下述条件预筛选，以减少用户失败交易。


判断步骤（建议）：


1. 读取用户仓位：`getUserPositions(user)` + `getPosition(posId)`
2. 过滤可复投仓位（eligible，建议）：
   - `!isAirdrop`
   - `state == PendingRepurchase`（枚举值 `1`）
   - 或 `state == Running`（枚举值 `0`）且 `now >= endAt`
   - 或 `state == Ended`（枚举值 `2`，历史兼容：链上会在复投入口自动转为 `PendingRepurchase`）
3. 计算所需复投总额（按上述 eligible）：
   - `required = sum(principal of eligible)`
4. 读取 `repurchaseBalance(user)` 与运行时配置 `repurchase_paused`


按钮状态建议：


- `eligible.length == 0`：隐藏或置灰，文案 `暂无可复投矿机`
- `eligible.length > 0 && payMode=0 && repurchaseBalance < required`：置灰，文案 `复投余额不足`
- `repurchase_paused == true`：置灰，文案 `系统暂停复投`
- 其余情况：按钮可点，调用 `repurchaseExpiredMinersWithMode(payMode)` 或兼容入口 `repurchaseExpiredMiners()`


`Auto` 组合复投扣款顺序（链上）：


- 先扣 `repurchaseBalance(user)`（本金池）
- 再扣 `positionProfit`（收益池，按用户仓位顺序逐仓扣减）
- 最后不足部分扣钱包 NETE（需 `approve`）


批量复投补充说明：


- `repurchaseExpiredMiners*` 在链上最终仍按 `now >= endAt` 汇总本次批量复投仓位。
- 前端若要提高“按钮可点即成功”的命中率，建议批量按钮只统计 `now >= endAt` 的 eligible 仓位。


错误兜底提示（说明：错误名中仍有 `Expired` 字样，这是历史命名，语义按“暂无可复投矿机”处理）：


- `NoExpiredMinerForRepurchase`：暂无可复投矿机
- `InsufficientBalance`：复投余额不足
- `RepurchasePausedError`：系统暂停复投
- `InvalidRepurchasePayMode`：支付模式无效
- `PositionNotPendingRepurchase`（单复投场景）：当前矿机暂不可复投


复投支付事件（用于前端展示/对账）：


- `RepurchasePayment(user, payMode, fromRepurchasePool, fromProfitPool, fromWallet, totalAmount)`


加速收益与矿机封顶规则（重要）：


- 加速收益会自动分配到“用户当前 **Running** 状态中、等级最高的付费矿机”（非空投；已到期未复投的高档矿机不参与）。
- **领取时不转 NETE 到钱包**，仅增加目标矿机 `accelClaimed`（链上 `addAccelReward` → `AccelRewardAdded` 事件）。
- 单次领取金额 = `min(待领加速余额, 目标矿机剩余封顶空间)`；剩余部分继续留在待领池，复投开新周期后再领。
- 剩余封顶空间 = `totalReturn - grossClaimed - accelClaimed`；领满后矿机进入 `PendingRepurchase`。
- 链上 `addAccelReward` 会校验超额并 revert；签名接口返回 `target_position_id` / `accel_headroom` 供前端展示。
- 后端记录 `AccelRewardAdded` 到 `accel_reward_ledger`（矿机 ID、金额、tx），用于收益明细。


周期递增与封顶规则（Paid 矿机）：


- 首周期使用档位基础周期（不额外加天）。
- 每次复投后，下一周期时长 `+extendDays`（默认 +5 天）。
- 周期时长封顶 `maxDays`（默认 180 天）。
- 达到 180 天后可继续复投，但后续每次周期长度固定 180 天，不再继续增加。


### 6.4 前端收益读取（服务端）


#### 接口速查


| 页面/模块 | 接口 | 说明 |
|-----------|------|------|
| 收益总览 | `GET /v1/income/overview` | 加速/分红/V9 可领与累计、等级、有效直推 |
| **收益明细（统一）** | `GET /v1/income/ledger` | 矿机 claimReward + referral/dividend/v9 签单领取，**按时间统一排序** |
| 签单状态查询 | `GET /v1/income/claims` | 仅用于 pending/expired 等**领取流程**状态，不再用于明细列表 |
| 加速入账明细 | `GET /v1/accel/reward-ledger` | 上链后写入哪台矿机（调试/补充，明细页优先用 ledger） |
| **等级分红日结** | `GET /v1/dividend/ledger` | 按 UTC 日 V1~V9 应得拆分 |
| **V9 池注入** | `GET /v1/v9/pool-ledger` | 全网购矿 1% 注入流水 |
| V9 用户领取 | `GET /v1/income/claims?reward_type=v9` | 个人 V9 领取 |


#### `GET /v1/income/overview`（收益总览）


**请求**：`GET /v1/income/overview?user=<address>`


**响应示例**


```json
{
  "user": "0xabc...",
  "user_level": 2,
  "direct_count": 2,
  "effective_direct_count": 1,
  "max_depth": 1,
  "miner_income_total": "51042130248316498316488",
  "miner_profit_gross_total": "10552958531144781144783",
  "miner_profit_fee_total": "0",
  "miner_profit_net_total": "10552958531144781144783",
  "accel_income_total": "18739285714285714285",
  "referral_pool_balance": "18739285714285714285",
  "pending_referral": "18739285714285714285",
  "accel_target_position_id": 4,
  "accel_headroom": "11893777777777777777778",
  "dividend_income_total": "0",
  "pending_dividend": "0",
  "v9_income_total": "0",
  "pending_v9": "0"
}
```


| 字段 | 前端展示建议 |
|------|----------------|
| `user_level` | 领导人等级 V0~V9 |
| `direct_count` / `effective_direct_count` / `max_depth` | 推广页：绑定直推 / 有效直推 / 可享层数 |
| `referral_pool_balance` | **加速待领池**（已日结、未领取） |
| `pending_referral` | **本周期可领加速**（领取按钮用此值） |
| `accel_target_position_id` | 领取后加速入账的矿机 ID |
| `accel_headroom` | 目标矿机剩余加速空间；池子 > 可领时提示「部分待复投后领取」 |
| `accel_income_total` | 加速累计（通常 ≈ 池子 + 已领加速） |
| `pending_dividend` / `dividend_income_total` | 分红可领 / 已领 |
| `pending_v9` / `v9_income_total` | V9 可领 / 已领 |
| `miner_*` | 矿机收益统计（与链上 `positionProfit` 不同口径） |


#### `GET /v1/income/ledger`（统一收益明细）


**请求**：`GET /v1/income/ledger?user=<address>&page=1&page_size=20`


可选筛选：


| 参数 | 说明 |
|------|------|
| `kind` | `miner` / `referral` / `dividend` / `v9` |
| `status` | 签单状态（`pending`/`confirmed`/`expired` 等）；默认含矿机 confirmed + 全部签单 |
| `epoch` | UTC 日 epoch_day 过滤 |


**响应**：`items[]` 按 `occurred_at` 降序（矿机 claimReward 与签单领取合并为一条时间线）。


```json
{
  "items": [
    {
      "kind": "dividend",
      "occurred_at": 1779590991,
      "user": "0xcf29...",
      "amount": "947757589285714285",
      "tx_hash": "0x5d1f...",
       "status": "confirmed",
      "epoch_day": 20597,
      "user_level": 2
    },
    {
      "kind": "referral",
      "occurred_at": 1779547030,
      "amount": "120000000000000000000",
      "status": "confirmed",
      "position_id": 27,
      "tier": 0,
      "principal": "100000000000000000000",
      "is_airdrop": true
    },
    {
      "kind": "miner",
      "occurred_at": 1779500000,
      "amount": "5000000000000000000",
      "status": "confirmed",
      "position_id": 1,
      "tier": 5,
      "gross_reward": "5000000000000000000",
      "profit_net": "4000000000000000000"
    }
  ],
  "total": 3,
  "page": 1,
  "page_size": 20
}
```


| `kind` | 含义 | 主要字段 |
|--------|------|----------|
| `miner` | 链上 `claimReward` 矿机收益 | `gross_reward`/`profit_*`/`accel_income` |
| `referral` | 加速奖励签单领取 | `position_id`/`tier`（入账矿机型号） |
| `dividend` | 等级分红签单领取 | `user_level`（领取当日 V 等级） |
| `v9` | V9 池签单领取 | `amount`/`tx_hash`/`status` |


**前端迁移**：原先分别请求 `income/ledger` + `income/claims` 再客户端合并排序的，改为**只调本接口**。


其它列表接口：
- 加速分配明细：`GET /v1/accel/reward-ledger?user=<address>&page=1&page_size=20`（见 **6.4.2**）
- 等级分红日结明细：`GET /v1/dividend/ledger?user=<address>&page=1&page_size=20`（见 **6.4.3**）
- V9 奖池注入明细：`GET /v1/v9/pool-ledger?page=1&page_size=20`（见 **6.4.4**）


口径提示：


- 服务端收益接口主要用于统计展示（累计口径）。
- 当前“可提取收益/可用于支付的收益池余额”应以链上 `positionProfit` 实时值为准。
- **加速待领 vs 本周期可领**：`referral_pool_balance` 是待领池总额；`pending_referral` 是 `min(池子, 矿机 headroom)`。池子 > 0 但可领 = 0 时，常见原因：① 10 分钟内签单冻结中；② 无 Running 付费矿机；③ 矿机周期已顶满需复投。
- 打开 overview 或再次签单时会自动 `expire` 超过 10 分钟未上链的 pending 签单（无需单独后台任务，但可选加定时清理以保持 DB 状态一致）。


领取记录筛选参数（可选，**仅 `/v1/income/claims` 签单状态查询**）：


- `reward_type`: `referral | dividend | v9`
- `status`: `pending | submitted | confirmed | expired`


**`dividend` 类型领取记录** 会附带 `user_level`（领取对应 UTC 日的 V1~V9 等级）。**`referral` 类型** 在已上链时会附带 `position_id`、`tier`、`principal`（加速入账矿机型号）。


### 6.4.1.1 矿机仓位列表（`/v1/miners/positions`）


`GET /v1/miners/positions?user=<address>`


返回该用户全部矿机仓位（含 `tier` 档位、`principal` 本金、`state` 状态），用于将 `position_id=27` 映射为具体型号。


```json
{
  "items": [
    {
      "position_id": 27,
      "owner": "0xcf29...",
      "tier": 1,
      "principal": "100000000000000000000",
      "start_at": 1779500000,
      "end_at": 0,
      "total_return": "...",
      "gross_claimed": "...",
      "current_period": 1,
      "state": "Running",
      "is_airdrop": true
    }
  ]
}
```


档位与型号对照见 **5.3** `tierIndex` 表；`tier=0` 为空投矿机。


### 6.4.2 加速分配明细（`/v1/accel/reward-ledger`）


用途：展示「推荐奖励领取后，实际给哪台矿机加速了多少」——对应链上 `AccelRewardAdded(user, positionId, amount)` 事件。


**请求**


```
GET /v1/accel/reward-ledger?user=0x...&page=1&page_size=20
```


| 参数 | 必填 | 说明 |
|------|------|------|
| `user` | 是 | 用户地址（EVM） |
| `page` | 否 | 页码，默认 `1` |
| `page_size` | 否 | 每页条数，默认 `20` |


**响应**


```json
{
  "items": [
    {
      "user": "0xabc...",
      "position_id": 3,
      "tier": 5,
      "principal": "1000000000000000000000",
      "is_airdrop": false,
      "amount": "10000000000000000000",
      "tx_hash": "0x...",
      "log_index": 12,
      "block_number": 12345678,
      "created_at": 1716500000
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```


TypeScript：`ApiListResponse<AccelRewardLedgerRow>`


**字段说明**


| 字段 | 说明 |
|------|------|
| `position_id` | **本次**入账的目标矿机 ID（领取瞬间 Running 最高档付费矿机，非空投） |
| `tier` | 矿机档位 index（0=空投，1~10=付费档位，对应合约 `tierIndex`；前端可映射为型号/本金） |
| `principal` | 矿机本金（18 位精度 NETE） |
| `is_airdrop` | 是否空投矿机 |
| `amount` | 本次写入该矿机 `accelClaimed` 的金额（18 位精度字符串） |
| `tx_hash` | 用户调用 `NeteNetwork.claimWithSignature`（推荐奖励）的交易哈希 |
| `log_index` | 事件在交易内的 log 索引 |
| `block_number` | 区块高度 |
| `created_at` | 区块时间（Unix 秒） |


**与其它接口的关系**


| 接口 | 区别 |
|------|------|
| `GET /v1/income/overview` | `referral_pool_balance` = 待领池总额；`pending_referral` = 本周期可领（已按矿机 headroom 截断） |
| `POST /v1/referral/claim-message` | 签名返回 `target_position_id` / `accel_headroom`，表示**即将**入账的目标矿机 |
| 本接口 | **已上链**的分配记录；一条领取 tx 通常对应一条明细（金额 = 实际入账额，≤ 签名 `amount`） |


**前端展示建议**


- 列表列：`时间` / `矿机 ID` / `档位 tier` / `加速金额` / `Tx`（`tier`+`principal` 已由本接口返回，无需再查链）
- 若单次领取导致矿机顶满周期，可在该条明细旁提示「本周期已结束，请复投」
- 待领但未领取的部分**不会**出现在本接口，只在 overview 的 `referral_pool_balance` 中体现


### 6.4.3 等级分红日结明细（`/v1/dividend/ledger`）


按 UTC 日展示该用户 V1~V9 分红应得拆分（链下日结；**领取前**可查每日应得，**领取后**查 `income/claims`）。


**请求**


```
GET /v1/dividend/ledger?user=0x...&page=1&page_size=20
```


**响应示例**


```json
{
  "items": [
    {
      "user": "0xabc...",
      "epoch_day": 20596,
      "user_level": 2,
      "equal_part": "800000000000000000000",
      "weighted_part": "315008928571428571428",
      "total_part": "1115008928571428571",
      "created_at": 1779523200,
      "updated_at": 1779523200
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```


| 字段 | 说明 |
|------|------|
| `epoch_day` | UTC 结算日（`timestamp / 86400`） |
| `user_level` | 当日用于分红的等级（V0 无分红） |
| `equal_part` | 等级均分池（手续费池 50% 中按 V1~V9 档位拆分） |
| `weighted_part` | 加权业绩池（按当日新增业绩权重） |
| `total_part` | 当日应得合计（18 位精度 wei 字符串） |


前端列表建议：`日期` / `等级` / `均分` / `加权` / `合计`。


与 `income/overview`：`pending_dividend` = 各日 `total_part` 累加 − 已确认领取 − 冻结签名。


### 6.4.4 V9 奖池明细


#### 全网注入流水 `GET /v1/v9/pool-ledger`


购矿金额 1% 注入 V9 奖池的链上事件索引（**不按用户**）。


**请求**：`GET /v1/v9/pool-ledger?page=1&page_size=20`（无需 `user`）


**响应示例**


```json
{
  "items": [
    {
      "epoch_day": 20596,
      "injected": "500000000000000000000",
      "total_balance": "12000000000000000000000",
      "tx_hash": "0x...",
      "block_number": 12345678,
      "created_at": 1779523200
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20
}
```


| 字段 | 说明 |
|------|------|
| `epoch_day` | UTC 日 |
| `injected` | 本条注入 NETE |
| `total_balance` | 注入后 V9 池余额 |
| `tx_hash` / `block_number` | 链上来源 |


#### 用户 V9 领取


| 用途 | 接口 |
|------|------|
| 可领金额 | `income/overview` → `pending_v9` |
| 已领累计 | `v9_income_total` |
| 签名单 / 上链记录 | `GET /v1/income/claims?user=...&reward_type=v9` |


V9 可领计算：池子总额 ÷ 当前全网 V9 人数 − 该用户已领（详见服务端 `calc_user_v9_claimable`）。


**示例场景**


- 待领池 20，矿机剩余 headroom 10 → 用户领取 10 → 本接口新增 1 条：`position_id=目标矿机, amount=10`；overview 中 `referral_pool_balance` 仍剩 10
- 500 档已到期、100 档 Running → 领取后 `position_id` 为 100 档矿机 ID，而非 500 档


---


### 6.4.1 空投矿机（首购付费矿机自动赠送）


链上入口：


- 无需单独领取入口；在首次 `activateMiner(tierIndex)` 成功后自动发放 1 台空投矿机。


新规则：


- 首次购买任意付费矿机时自动赠送 1 台空投矿机（仅一次）。
- 空投矿机永久有效，不再有 75 天过期窗口。
- 空投矿机每周期产出 20 枚 NETE：
  - 周期 1：35 天
  - 后续每周期 +5 天
  - 周期长度上限 180 天（达到后固定 180 天）
- 空投矿机收益进入 `positionProfit`，提现同样收 20% 手续费（默认配置）。


失败提示建议：


- 其它 `revert`：显示原始错误并提示稍后重试。


按钮文案建议：


- 空投区入口：`空投矿机（首购自动赠送）`
- 状态说明：`已自动获得` / `未获得（购买任意付费矿机后自动赠送）`


---


## 6.5 预售记录查询（服务端）


RESTful 路由（统一风格）：


- 全量分页：`GET /v1/presale/records?page=1&page_size=20`
- 按用户分页：`GET /v1/presale/records/:user?page=1&page_size=20`


返回字段（每条记录）：


- `buyer`
- `usdt_amount`
- `nete_amount`
- `tx_hash`
- `log_index`
- `block_number`
- `created_at`


前端用途：


- 预售明细列表
- 用户历史认购记录（时间 / 数量 / 交易哈希）


---


## 6.6 签到记录与统计（服务端）


接口：


- `GET /v1/checkin/records?user=0x...&page=1&page_size=20`


返回字段：


- `user`: 地址（小写）
- `checkin_count`: 累计签到次数
- `checkin_reward_total`: 累计签到奖励（18 位精度整数字符串）
- `items`: 签到明细（按 `checkin_at` 倒序）
  - `amount`
  - `checkin_at`
  - `tx_hash`
  - `log_index`
  - `block_number`
- `total/page/page_size`: 分页信息


---


## 7. C2C 订单流程（NeteMarket）


### 7.1 创建卖单（链上）


1. `NeteToken.approve(NeteMarket, neteAmount)`
2. `NeteMarket.createSellOrder(neteAmount, pricePerNete)`


### 7.2 成交（链上）


1. `USDT.approve(NeteMarket, totalUsdt)`
2. `NeteMarket.fillOrder(orderId)`


### 7.3 订单读取（服务端）


- 订单详情：`GET /v1/orders/:order_id`
- 短号详情：`GET /v1/orders/by-short/:short_no`（推荐用于前端搜索/展示）
- 公域订单簿：`GET /v1/orders/public?page=1&page_size=20`


前端注意：


- `orderId` 是 `uint256` 大整数，前端必须按**字符串**处理。
- 不要用 JS `Number` 存储链上金额或 `orderId`。
- 前端展示建议使用后端返回的 `short_order_no`（10位hex），上链交互仍使用 `order_id`。


### 7.4 我的挂单 / 我的吃单


当前服务端已可通过订单详情与订单簿查询，但前端业务上需要单独支持：


- 我的挂单（我是 `seller`）
- 我的吃单（我是 `buyer`）


后端接口：


- `GET /v1/orders/public/:user?page=1&page_size=20`（我的挂单，`seller=user`）
- `GET /v1/orders/taken/:user?page=1&page_size=20`（我的吃单，`buyer=user`）


若暂未新增接口，前端临时方案：


- 使用 `orders/public` + 按 `seller` 前端过滤（仅适合数据量小）
- 或直接根据已知 `orderId` 列表批量拉详情


### 7.5 订单可见性规则


- 我的挂单查询**不受10分钟窗口限制**，应始终可查。
- 公共订单簿（`/v1/orders/public`）通常用于展示 `Open` 订单。


---


## 8. 签名领取流程（NeteNetwork）


适用奖励：


- 推荐奖励（referral）
- 分红奖励（dividend）
- V9 奖励（v9）


### 8.1 获取签名消息（服务端）


- `POST /v1/referral/claim-message`
- `POST /v1/dividend/claim-message`
- `POST /v1/v9/claim-message`


请求体：


```json
{
  "user": "0x...",
  "amount": "可选，18位精度整数字符串"
}
```


规则：


- `amount` 不传：默认使用当前可领取最大值（已扣除冻结）。
- `amount` 传值：必须 `<= available`。
- 同一 `user + rewardType` 存在活跃签名单时，接口会返回同一单（单飞）。


**推荐（加速）奖励额外规则**：


- **不进钱包**：链上领取只调用 `NeteCore.addAccelReward`，把金额记入 **Running 最高档付费矿机** 的 `accelClaimed`，用于加速回本/周期封顶；**无 NETE 转账**。
- 可领上限 = `min(referral_pool_balance, 目标矿机 headroom)`；超额部分留在待领池，复投后再领。
- 无 Running 付费矿机或 headroom = 0 时，接口报错，前端应引导复投或激活矿机。
- 签名响应含 `target_position_id`、`accel_headroom`（仅 `reward_type=0`）；上链成功后可在 `GET /v1/accel/reward-ledger` 查到对应 `position_id` + `amount` 明细。


加速（推荐）奖励结算说明：


- **日结公式（定版）**：`每日加速 = 被推荐人矿机本金 × 层比例 ÷ 档位周期天数`（1~7 层 5%，8~20 层 1%）；同一 UTC 日多台在运行付费矿机按台相加；按 `(upline, from_user, depth)` 合并一条。
- **层比例**：深度 1~7 → 5%；8~20 → 1%。**可享层数** = `max_depth`（由 `effective_direct_count` 决定）。
- **预估当日加速**（前端展示用）：对有效直推及其下级在运行矿机，按上式逐台求和；勿用「直推本金 ×5%」一次性估算。
- 服务端 UTC 日结（默认 `00:00`）结算 `D-1`；管理接口 `POST /v1/rewards/accel/settle?epoch_day=` 可补算/重算（覆盖该日已有行）。


### 8.2 前端提交链上领取


合约：`NeteNetwork.claimWithSignature(payload, signature)`


`payload` 使用服务端返回字段：


- `user, amount, epoch, nonce, deadline, claim_id, reward_type`


### 8.3 冻结与超时


- 冻结窗口：**10分钟**
- 活跃单状态：`pending/submitted`
- 超时自动 `expired`，冻结释放
- 成功上链后状态 `confirmed`


前端建议：


- 签名弹窗展示 `deadline` 倒计时
- 倒计时结束后提示“签名已过期，请重新获取”


### 8.4 签名开关


若服务端 `signer.enabled=false`，签名接口返回：


- `403 claim signature disabled`


前端处理：


- 隐藏/禁用签名领取按钮
- 弹出“当前环境未开启签名领取”


---


## 9. 状态一致性与重试建议


### 9.1 索引延迟


- 链上交易成功后，服务端读模型可能有秒级延迟。
- 前端流程建议：
  - 先显示链上交易成功
  - 再轮询服务端 API 刷新聚合视图


### 9.2 幂等与防重


- 订单、收益、推荐等索引具备幂等去重。
- 签名领取使用链上 `nonce + claimId` 校验，服务端使用单飞冻结，避免并发重签。


### 9.3 kill/restart 安全


- 服务端扫块数据与 `last_block/last_hash` 同事务提交，重启不会造成高度与数据错位。


---


## 10. 精度与数据类型规范（前端必须）


- 所有金额（NETE/USDT）使用 `string` + `BigInt`/`bignumber` 处理。
- 不使用浮点数参与业务计算。
- `orderId`, `positionId`, `nonce`, `epoch` 均按字符串/大整数处理。


---


## 11. 推荐接入顺序（工程落地）


1. 封装 `contracts` SDK（写操作）
2. 封装 `service` SDK（读操作、签名）
3. 先完成矿机主流程（激活/收益/提现）
4. 再接 C2C 订单流程
5. 最后接签名领取流程（含倒计时、重试、过期处理）


---


## 12. 常见错误码与处理


- 合约 `revert`：
  - 前端显示链上错误原文（可附业务化翻译）
- 服务端 `403 claim signature disabled`：
  - 提示“签名领取未开启”
- 服务端 `400/500`：
  - 保留 requestId（如果网关有）并提示稍后重试


---


## 13. 调试建议


- 合约交易：优先看链上 tx receipt + event。
- 服务读模型：看 `chain_events` 是否已入库。
- 若出现“链上已成功但服务端未更新”：
  - 检查 indexer 是否追到最新块
  - 检查 `start_block` 配置与网络 RPC 可用性


---


## 14. 前端接口字段对照表（TS 类型定义）


以下类型可直接放到前端 `types/api.ts` 使用。


```ts
export type ApiListResponse<T> = {
  /** 列表数据 */
  items: T[];
  /** 总条数 */
  total: number;
  /** 当前页（部分接口返回） */
  page?: number;
  /** 每页条数（部分接口返回） */
  page_size?: number;
};


export type ClaimRequest = {
  /** 领取用户地址（EVM address） */
  user: string;
  /**
   * 可选领取金额（18位精度整数字符串）
   * - 不传：默认 available（推荐奖励 = min(待领池, 矿机 headroom)；其它类型 = 可领总额 - 已确认 - 冻结）
   * - 传值：必须 <= available
   */
  amount?: string;
};


export type ClaimMessage = {
  /** 领取用户地址（需与链上 msg.sender 一致） */
  user: string;
  /** 本次签名允许领取金额（18位精度整数字符串） */
  amount: string;
  /** 签名生成时的日分桶（UTC day），用于审计/对账 */
  epoch: number;
  /** 链上 userNonce，claimWithSignature 必须严格匹配 */
  nonce: number;
  /** 签名过期时间（Unix 秒），超过后链上会 ExpiredDeadline */
  deadline: number;
  /** 领取单唯一ID（签名体的一部分，链上 usedClaimIds 防重） */
  claim_id: string;
  /** 奖励类型：0=推荐，1=分红，2=V9 */
  reward_type: 0 | 1 | 2; // 0=Referral, 1=Dividend, 2=V9Pool
  /** EIP-712 签名 */
  signature: string;
  /** 推荐奖励：本次加速入账的目标矿机 ID（仅 reward_type=0） */
  target_position_id?: number;
  /** 推荐奖励：签名时目标矿机剩余封顶空间（18位精度，仅 reward_type=0） */
  accel_headroom?: string;
};


export type RuntimeConfig = {
  /** 市场指导最低价（18位精度） */
  guide_min_price: string;
  /** 市场指导最高价（18位精度） */
  guide_max_price: string;
  /** 订单可回收窗口（秒） */
  recycle_window: number;
  /** 设计窗口（秒） */
  designated_window: number;
  /** 是否要求 SBT */
  require_sbt: boolean;
  /** 复投是否暂停 */
  repurchase_paused: boolean;
  /** 预售是否开启 */
  presale_active: boolean;
  /** 种子池剩余 NETE（18位精度） */
  seed_remaining: string;
  /** POS 池剩余 NETE（18位精度） */
  pos_remaining: string;
};


export type OrderView = {
  /** 订单ID（uint256，前端按字符串处理） */
  order_id: string;
  /** 10位短订单号（hex，小写） */
  short_order_no: string;
  /** 订单号（bytes32 hex） */
  order_no: string;
  /** 卖家地址 */
  seller: string;
  /** 买家地址（未成交时可能为空串） */
  buyer: string;
  /** 挂单 NETE 数量（18位精度） */
  nete_amount: string;
  /** 单价（USDT/NETE，18位精度） */
  price_usdt: string;
  /** 总价（USDT，18位精度） */
  total_usdt: string;
  /** 手续费（USDT，18位精度） */
  fee: string;
  /** 创建时间（Unix 秒） */
  created_at: number;
  /** 成交时间（Unix 秒，未成交可能为0） */
  filled_at: number;
  /** 私有截止时间（created_at + designated_window） */
  private_deadline: number;
  /** 回收时间（created_at + recycle_window） */
  recycle_at: number;
  /** 订单状态 */
  status: "Open" | "Filled" | "Cancelled" | "Recycled" | string;
  /** 当前是否可在公共订单簿展示 */
  is_public: boolean;
};


export type SeedOrderView = {
  /** 参与预售地址 */
  buyer: string;
  /** 预售支付 USDT 数量（18位精度） */
  usdt_amount: string;
  /** 预售获得 NETE 数量（18位精度） */
  nete_amount: string;
  /** 对应链上交易哈希 */
  tx_hash: string;
  /** 事件日志索引 */
  log_index: number;
  /** 区块高度 */
  block_number: number;
  /** 记录创建时间（Unix 秒） */
  created_at: number;
};


export type ReferralInfo = {
  /** 当前用户地址 */
  user: string;
  /** 推荐人地址（未绑定可能为空） */
  referrer: string;
  /** 绑定直推人数 */
  direct_count: number;
  /** 有效直推人数（至少 1 台付费矿机） */
  effective_direct_count: number;
  /** 可享加速层数（由 effective_direct_count 决定） */
  max_depth: number;
  /** 团队人数（伞下所有层级，不含本人） */
  team_count: number;
  /** 个人业绩（18位精度） */
  own_perf: string;
  /** 个人矿机业绩（18位精度） */
  own_miner_perf: string;
  /** 个人预售业绩（18位精度，字段名历史沿用 seed） */
  own_seed_perf: string;
  /** 团队总业绩（18位精度） */
  subtree_perf: string;
  /** 团队矿机业绩（18位精度） */
  subtree_miner_perf: string;
  /** 团队预售业绩（18位精度，字段名历史沿用 seed） */
  subtree_seed_perf: string;
  /** 小区业绩（18位精度，= small_leg_miner_perf，定级依据） */
  small_leg_perf: string;
  /** 小区矿机业绩（18位精度，定级仅看此字段） */
  small_leg_miner_perf: string;
  /** 小区预售业绩（18位精度，仅展示，不参与定级） */
  small_leg_seed_perf: string;
  /** 用户等级（V0~V9，由 small_leg_miner_perf 阈值决定） */
  user_level: number;
  /** 团队业绩（18位精度，不含本人） */
  team_perf: string;
  /** 团队大区业绩（18位精度，不含本人） */
  team_big_leg_perf: string;
  /** 团队小区业绩（18位精度，不含本人） */
  team_small_leg_perf: string;
  /** 团队矿机总业绩（18位精度，不含本人） */
  team_miner_total_perf: string;
  /** 团队矿机大区业绩（18位精度，不含本人） */
  team_miner_big_leg_perf: string;
  /** 团队矿机小区业绩（18位精度，不含本人） */
  team_miner_small_leg_perf: string;
  /** 团队预售总业绩（18位精度，不含本人） */
  team_seed_total_perf: string;
  /** 团队预售大区业绩（18位精度，不含本人） */
  team_seed_big_leg_perf: string;
  /** 团队预售小区业绩（18位精度，不含本人） */
  team_seed_small_leg_perf: string;
  /** 直推总业绩（18位精度，仅第一层直推） */
  direct_perf: string;
  /** 直推矿机业绩（18位精度，仅第一层直推） */
  direct_miner_perf: string;
  /** 直推预售业绩（18位精度，仅第一层直推） */
  direct_presale_perf: string;
};


export type PersonalPerformance = {
  /** 当前用户地址 */
  user: string;
  /** 个人总业绩（18位精度）= miner_perf + presale_perf */
  own_perf: string;
  /** 矿机业绩（18位精度） */
  miner_perf: string;
  /** 预售业绩（18位精度） */
  presale_perf: string;
};


export type DownlineEntry = {
  user: string;
  /** 是否有效直推（已购付费矿机） */
  effective: boolean;
};


export type DownlinesResponse = {
  user: string;
  direct_count: number;
  effective_direct_count: number;
  total: number;
  /** 兼容旧版，仅地址 */
  downlines: string[];
  entries: DownlineEntry[];
};


export type LegPerformance = {
  user: string;
  team_perf: string;
  big_leg_perf: string;
  /** 小区矿机业绩（定级展示） */
  small_leg_perf: string;
  small_leg_miner_perf: string;
  user_level: number;
  direct_count: number;
  effective_direct_count: number;
  max_depth: number;
};


export type IncomeOverview = {
  user: string;
  user_level: number;
  direct_count: number;
  effective_direct_count: number;
  max_depth: number;
  /** 矿机累计收益 */
  miner_income_total: string;
  /** 矿机利润累计毛额（claim拆分出来的利润，不含扣费） */
  miner_profit_gross_total: string;
  /** 矿机利润累计手续费（统计口径字段） */
  miner_profit_fee_total: string;
  /** 矿机利润累计净额（= 毛额 - 手续费） */
  miner_profit_net_total: string;
  /** 推荐累计收益（已结算） */
  accel_income_total: string;
  /** 分红累计已领取 */
  dividend_income_total: string;
  /** V9累计已领取 */
  v9_income_total: string;
  /** 加速待领池总额（未按矿机封顶截断） */
  referral_pool_balance: string;
  /** 本周期可领加速 = min(referral_pool_balance, accel_headroom) */
  pending_referral: string;
  /** 当前加速目标矿机 ID（Running 最高档付费矿机） */
  accel_target_position_id?: number;
  /** 目标矿机剩余封顶空间 */
  accel_headroom?: string;
  /** 分红当前可领取 */
  pending_dividend: string;
  /** V9当前可领取 */
  pending_v9: string;
};


export type IncomeDetailRow = {
  /** miner | referral | dividend | v9 */
  kind: "miner" | "referral" | "dividend" | "v9" | string;
  /** 排序时间戳（Unix 秒） */
  occurred_at: number;
  user: string;
  /** 主金额（18 位精度） */
  amount: string;
  tx_hash: string;
  status: string;
  epoch_day: number;
  position_id?: number;
  tier?: number;
  principal?: string;
  is_airdrop?: boolean;
  gross_reward?: string;
  principal_part?: string;
  profit_part?: string;
  profit_gross?: string;
  profit_fee?: string;
  profit_net?: string;
  accel_income?: string;
  claim_id?: string;
  nonce?: number;
  user_level?: number;
  created_at?: number;
  claimed_at?: number;
};


/** @deprecated 请使用 IncomeDetailRow（统一收益明细） */
export type IncomeLedgerRow = {
  /** 用户地址 */
  user: string;
  /** 仓位ID */
  position_id: number;
  /** 矿机档位（tierIndex） */
  tier: number;
  /** 矿机本金（18位精度） */
  principal: string;
  /** 是否空投矿机 */
  is_airdrop: boolean;
  /** 结算日（UTC day） */
  epoch_day: number;
  /** 领取时间（Unix 秒时间戳） */
  claimed_at: number;
  /** 本次总收益 */
  gross_reward: string;
  /** 本次计入本金部分 */
  principal_part: string;
  /** 本次计入利润部分 */
  profit_part: string;
  /** 本次利润毛额（与profit_part等价，保留用于新口径显式展示） */
  profit_gross: string;
  /** 本次利润手续费 */
  profit_fee: string;
  /** 本次利润净额（进入positionProfit） */
  profit_net: string;
  /** 本次加速收益 */
  accel_income: string;
  /** 关联交易哈希 */
  tx_hash: string;
};


export type DividendLedgerRow = {
  user: string;
  epoch_day: number;
  user_level: number;
  equal_part: string;
  weighted_part: string;
  total_part: string;
  created_at: number;
  updated_at: number;
};


export type V9PoolLedgerRow = {
  epoch_day: number;
  injected: string;
  total_balance: string;
  tx_hash: string;
  block_number: number;
  created_at: number;
};


export type AccelRewardLedgerRow = {
  /** 用户地址（小写 0x 前缀） */
  user: string;
  /**
   * 本次加速入账的目标矿机 ID（链上 AccelRewardAdded.positionId）。
   * 对应领取瞬间 Running 最高档付费矿机；历史记录不会因后续矿机状态变化而改写。
   */
  position_id: number;
  /** 矿机档位 index（0=空投，1~10=付费档位） */
  tier: number;
  /** 矿机本金（18 位精度） */
  principal: string;
  /** 是否空投矿机 */
  is_airdrop: boolean;
  /** 本次写入该矿机 accelClaimed 的金额（18 位精度整数字符串，单位 NETE） */
  amount: string;
  /** 用户 claimWithSignature（推荐奖励）的交易哈希 */
  tx_hash: string;
  /** AccelRewardAdded 事件在交易内的 log 索引 */
  log_index: number;
  /** 事件所在区块高度 */
  block_number: number;
  /** 区块时间戳（Unix 秒） */
  created_at: number;
};


export type ClaimRecordRow = {
  /** 用户地址 */
  user: string;
  /** 本次签名领取金额（18位精度） */
  amount: string;
  /** 奖励类型：referral/dividend/v9 */
  reward_type: "referral" | "dividend" | "v9" | string;
  /** 结算日（UTC day） */
  epoch: number;
  /** 领取单唯一ID */
  claim_id: string;
  /** 链上 nonce（签名时使用） */
  nonce: number;
  /** 上链交易哈希；未提交时可能为空串 */
  tx_hash: string;
  /** 状态：pending/submitted/confirmed/expired */
  status: "pending" | "submitted" | "confirmed" | "expired" | string;
  /** 记录创建时间（Unix 秒） */
  created_at: number;
  /** 确认领取时间（Unix 秒，未确认时可能为0） */
  claimed_at: number;
  /** 领取当日等级（仅 dividend 时有值） */
  user_level?: number;
  /** 加速入账矿机 ID（仅 referral 且已上链时有值） */
  position_id?: number;
  /** 矿机档位 index */
  tier?: number;
  /** 矿机本金（18 位精度） */
  principal?: string;
  /** 是否空投矿机 */
  is_airdrop?: boolean;
};


export type RecycleRunOnceResult = {
  /** 本次回收订单数量 */
  recycled: number;
};
```


### 14.1 路由与类型对应


- `GET /v1/config/runtime` -> `RuntimeConfig`
- `GET /v1/presale/records` -> `ApiListResponse<SeedOrderView>`
- `GET /v1/presale/records/:user` -> `ApiListResponse<SeedOrderView>`
- `GET /v1/orders/public` -> `ApiListResponse<OrderView>`
- `GET /v1/orders/public/:user` -> `ApiListResponse<OrderView>`（我的挂单）
- `GET /v1/orders/taken/:user` -> `ApiListResponse<OrderView>`（我的吃单）
- `GET /v1/orders/:order_id` -> `OrderView`
- `GET /v1/orders/by-short/:short_no` -> `OrderView`
- `GET /v1/referral/info?user=...` -> `ReferralInfo | null`
- `GET /v1/referral/downlines?user=...` -> `DownlinesResponse`（见 5.2.1）
- `GET /v1/performance/personal?user=...` -> `PersonalPerformance`
- `GET /v1/performance/legs?user=...` -> `LegPerformance`
- `GET /v1/income/overview?user=...` -> `IncomeOverview`（见 6.4）
- `GET /v1/income/ledger?user=...` -> `ApiListResponse<IncomeDetailRow>`（统一收益明细，见 6.4）
- `GET /v1/miners/positions?user=...` -> `{ items: PositionView[] }`
- `GET /v1/income/claims?user=...` -> `ApiListResponse<ClaimRecordRow>`
- `GET /v1/dividend/ledger?user=...` -> `ApiListResponse<DividendLedgerRow>`（等级分红日结，见 6.4.3）
- `GET /v1/v9/pool-ledger` -> `ApiListResponse<V9PoolLedgerRow>`（V9 池注入，见 6.4.4）
- `GET /v1/accel/reward-ledger?user=...` -> `ApiListResponse<AccelRewardLedgerRow>`（加速入账矿机明细，见 6.4.2）
- `POST /v1/referral/claim-message` -> `ClaimMessage`
- `POST /v1/dividend/claim-message` -> `ClaimMessage`
- `POST /v1/v9/claim-message` -> `ClaimMessage`
- `POST /v1/keeper/recycle/run-once` -> `RecycleRunOnceResult`


### 14.2 前端实现注意


- 所有金额字段使用 `string`，不要转 JS `number`。
- `order_id` 是大整数，必须字符串处理。
- `claim-message` 返回的 `nonce/deadline` 直接透传到链上 `claimWithSignature`。



