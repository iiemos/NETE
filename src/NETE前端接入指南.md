# NETE 前端接入指南（合约 + 服务端）


本文档面向前端工程，按业务流程说明如何接入链上合约与后端服务。


## 1. 架构


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
5. 领取矿机收益/提现利润（链上）
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


### 5.1 绑定推荐人（链上）


合约：`NeteNetwork.bindReferrer(referrer)`


前端注意：


- 一次性绑定，不可重复。
- 需要在交易前校验 `referrer != self`。


### 5.2 读取推荐信息（服务端）


`GET /v1/referral/info?user=<address>`


返回：


- `referrer`, `direct_count`, `max_depth`
- `own_perf`, `subtree_perf`, `small_leg_perf`, `user_level`


---


## 6. 矿机流程（NeteCore）


### 6.1 激活矿机（链上）


1. `NeteToken.approve(NeteCore, amount)`
2. `NeteCore.activateMiner(tierIndex)`


### 6.2 领取矿机收益（链上）


- `NeteCore.claimReward(positionId)`


### 6.3 提现利润（链上）


- `NeteCore.withdrawProfit(positionId, amount)`


### 6.4 前端收益读取（服务端）


- 总览：`GET /v1/income/overview?user=<address>`
- 流水：`GET /v1/income/ledger?user=<address>&page=1&page_size=20`


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
- 公域订单簿：`GET /v1/orders/public?page=1&page_size=20`


前端注意：


- `orderId` 是 `uint256` 大整数，前端必须按**字符串**处理。
- 不要用 JS `Number` 存储链上金额或 `orderId`。


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
   * - 不传：默认 available（= 可领取总额 - 已确认领取 - 冻结中金额）
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


export type ReferralInfo = {
  /** 当前用户地址 */
  user: string;
  /** 推荐人地址（未绑定可能为空） */
  referrer: string;
  /** 直推人数 */
  direct_count: number;
  /** 最大奖励层级深度 */
  max_depth: number;
  /** 个人业绩（18位精度） */
  own_perf: string;
  /** 团队总业绩（18位精度） */
  subtree_perf: string;
  /** 小区业绩（18位精度） */
  small_leg_perf: string;
  /** 用户等级（V0~V9） */
  user_level: number;
};


export type IncomeOverview = {
  /** 用户地址 */
  user: string;
  /** 用户等级（V0~V9） */
  user_level: number;
  /** 矿机累计收益 */
  miner_income_total: string;
  /** 推荐累计收益（已结算） */
  accel_income_total: string;
  /** 分红累计已领取 */
  dividend_income_total: string;
  /** V9累计已领取 */
  v9_income_total: string;
  /** 推荐当前可领取 */
  pending_referral: string;
  /** 分红当前可领取 */
  pending_dividend: string;
  /** V9当前可领取 */
  pending_v9: string;
};


export type IncomeLedgerRow = {
  /** 用户地址 */
  user: string;
  /** 仓位ID */
  position_id: number;
  /** 结算日（UTC day） */
  epoch_day: number;
  /** 本次总收益 */
  gross_reward: string;
  /** 本次计入本金部分 */
  principal_part: string;
  /** 本次计入利润部分 */
  profit_part: string;
  /** 本次加速收益 */
  accel_income: string;
  /** 关联交易哈希 */
  tx_hash: string;
};


export type RecycleRunOnceResult = {
  /** 本次回收订单数量 */
  recycled: number;
};
```


### 14.1 路由与类型对应


- `GET /v1/config/runtime` -> `RuntimeConfig`
- `GET /v1/orders/public` -> `ApiListResponse<OrderView>`
- `GET /v1/orders/public/:user` -> `ApiListResponse<OrderView>`（我的挂单）
- `GET /v1/orders/taken/:user` -> `ApiListResponse<OrderView>`（我的吃单）
- `GET /v1/orders/:order_id` -> `OrderView`
- `GET /v1/referral/info?user=...` -> `ReferralInfo | null`
- `GET /v1/income/overview?user=...` -> `IncomeOverview`
- `GET /v1/income/ledger?user=...` -> `ApiListResponse<IncomeLedgerRow>`
- `POST /v1/referral/claim-message` -> `ClaimMessage`
- `POST /v1/dividend/claim-message` -> `ClaimMessage`
- `POST /v1/v9/claim-message` -> `ClaimMessage`
- `POST /v1/keeper/recycle/run-once` -> `RecycleRunOnceResult`


### 14.2 前端实现注意


- 所有金额字段使用 `string`，不要转 JS `number`。
- `order_id` 是大整数，必须字符串处理。
- `claim-message` 返回的 `nonce/deadline` 直接透传到链上 `claimWithSignature`。



