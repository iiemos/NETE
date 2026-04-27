export const globalOverview = {
  wallet: {
    connected: true,
    address: "0x7A9e...19b4",
    usdtBalance: "12,680.55",
  },
  memberLevel: "V3",
  netePrice: "0.86",
  principalWallet: "28,450.00",
  investmentPerformance: "226,800.00",
  circulateWallet: "5,460.90",
  teamPerformance: "1,820,300.00",
  zonePerformance: "168,000.00",
  burnTotal: "1,328,560.00",
  circulatingSupply: "2,548,310,000.00",
  burnToTarget: "2,527,310,000.00",
};

export const machineModels = [
  { model: "100 型", price: 100, unitCount: 3, periodDays: 35, returnRate: "120%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 29, remaining: 5000 },
  { model: "300 型", price: 300, unitCount: 3, periodDays: 35, returnRate: "120%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 28, remaining: 1000 },
  { model: "500 型", price: 500, unitCount: 2, periodDays: 35, returnRate: "125%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 27, remaining: 1000 },
  { model: "1000 型", price: 1000, unitCount: 1, periodDays: 40, returnRate: "130%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 26, remaining: 1000 },
  { model: "3000 型", price: 3000, unitCount: 1, periodDays: 40, returnRate: "135%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 25, remaining: 400 },
  { model: "5000 型", price: 5000, unitCount: 1, periodDays: 40, returnRate: "135%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 24, remaining: 300 },
  { model: "10000 型", price: 10000, unitCount: 1, periodDays: 50, returnRate: "140%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 23, remaining: 180 },
  { model: "30000 型", price: 30000, unitCount: 1, periodDays: 50, returnRate: "140%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 22, remaining: 90 },
  { model: "50000 型", price: 50000, unitCount: 1, periodDays: 50, returnRate: "140%", extendDays: 5, maxPeriodDays: 180, withdrawFee: 20, remaining: 50 },
];

export const airdropMachineModel = {
  model: "100（空投）",
  price: 100,
  unitCount: 1,
  periodDays: 35,
  returnRate: "20 枚",
  extendDays: 5,
  maxPeriodDays: 75,
  withdrawFee: 30,
};

export const purchasedMachines = [
  { model: "1000 型", quantity: 2, cycleProgress: "24 / 40 天", output: "128.50 NETE", remainingDays: 16 },
  { model: "5000 型", quantity: 1, cycleProgress: "11 / 40 天", output: "352.20 NETE", remainingDays: 29 },
];

export const airdropMachineStatus = {
  synthesized: true,
  permanent: false,
  validityLeftDays: 52,
  cycleLeft: 1,
  produced: "14.90 NETE",
  triggerGiftRule: "75 天内购买 ≥100 型矿机可转永久",
};

export const miningWalletRules = [
  "每个地址可同时持有多个矿机（小额度可多台合并）。",
  "每日产出由本金与利润组成，本金进入复投钱包，仅可用于复购矿机。",
  "利润进入利润钱包，可复购、提取或参与交易流通。",
  "矿机按约定节奏产生产出，前端按日聚合展示收益。",
];

export const reductionRules = [
  "每完成一个周期，统一延长 5 天，最长延长至 180 天。",
  "每一次链上提币和激活矿机均触发销毁。",
  "通过控制产出速率配合通缩，缓解流通压力。",
];

export const withdrawFeeDistributionRules = [
  { item: "销毁", ratio: "20%", use: "直接打入黑洞地址" },
  { item: "项目方", ratio: "30%", use: "运营、开发、市场建设" },
  { item: "社区分红", ratio: "50%", use: "其中 50% 平分给 V1-V9，50% 按当日新增业绩加权分配" },
];

export const leadershipLevels = [
  { level: "V1", requirement: "≥ 1 万", bonusRatio: "20%", fixedReward: 500 },
  { level: "V2", requirement: "3 万", bonusRatio: "17%", fixedReward: 1000 },
  { level: "V3", requirement: "10 万", bonusRatio: "14%", fixedReward: 2000 },
  { level: "V4", requirement: "35 万", bonusRatio: "12%", fixedReward: 4000 },
  { level: "V5", requirement: "110 万", bonusRatio: "10%", fixedReward: 8000 },
  { level: "V6", requirement: "360 万", bonusRatio: "10%", fixedReward: 16000 },
  { level: "V7", requirement: "1500 万", bonusRatio: "8%", fixedReward: 35000 },
  { level: "V8", requirement: "5000 万", bonusRatio: "6%", fixedReward: 65000 },
  { level: "V9", requirement: "2 个 V8", bonusRatio: "3% + 全球新增业绩 1%", fixedReward: 100000 },
];

export const leadershipRuleNotes = {
  bonus: "50% 平分给 V1-V9，50% 按当日新增业绩加权分配。",
  fixedReward: "固定奖励按累计口径发放：V1 累计 500 枚，V2 累计 1000 枚（即新增 500 枚），以此类推。",
};

export const shareAccelerationRules = [
  { directs: "1", layers: "1 层", income: "5%" },
  { directs: "2", layers: "2 层", income: "5%" },
  { directs: "3", layers: "3 层", income: "5%" },
  { directs: "4", layers: "4 层", income: "5%" },
  { directs: "5", layers: "5 层", income: "5%" },
  { directs: "6", layers: "6 层", income: "5%" },
  { directs: "7", layers: "7 层", income: "5%" },
  { directs: "≥8", layers: "8-20 层", income: "1%" },
];

export const shareAccelerationNote = "奖励按被分享人矿机生产周期每日均分。";

export const c2cMarketOrders = [
  { seller: "0xA1f3...9C2a", amount: "12,000 NETE", price: "0.88 USDT", leftTime: "08:23", stage: "定向期" },
  { seller: "0x9fD2...12a7", amount: "5,600 NETE", price: "0.91 USDT", leftTime: "06:54", stage: "定向期" },
  { seller: "0x18Ee...50B4", amount: "20,000 NETE", price: "0.95 USDT", leftTime: "00:00", stage: "全网期" },
];

export const c2cEntrustOrders = [
  { time: "2026-04-26 20:18", side: "卖出", amount: "8,000 NETE", price: "0.90", status: "待成交" },
  { time: "2026-04-26 18:06", side: "卖出", amount: "3,600 NETE", price: "0.93", status: "部分成交" },
];

export const c2cDealOrders = [
  { time: "2026-04-26 16:48", side: "买入", amount: "2,100 NETE", price: "0.87", total: "1,827 USDT" },
  { time: "2026-04-25 13:20", side: "卖出", amount: "4,500 NETE", price: "0.92", total: "4,140 USDT" },
];

export const c2cFeeRules = [
  { item: "手续费率", rule: "10%（由卖方支付 USDT）" },
  { item: "手续费用途", rule: "进入项目方钱包，用于流动性支持与生态建设" },
  { item: "做市商规则", rule: "V4 及以上可申请独立账户，免手续费并赚取 5% 市场差价" },
];

export const circulationRules = [
  { mode: "C2C 交易", rule: "仅支持挂卖单，前 10 分钟定向交易，超时全网可见" },
  { mode: "24 小时未成交", rule: "官方可回购（需符合托底条件）" },
];

export const fundSecurityRules = [
  { mechanism: "智能合约", detail: "自动执行收益分配，无人工干预" },
  { mechanism: "无中心资金池", detail: "所有资金锁定在合约或用户钱包" },
  { mechanism: "权限丢弃", detail: "合约所有权可放弃，实现去中心化治理" },
  { mechanism: "链上可查", detail: "交易、销毁、分红数据公开可溯源" },
];

export const bootstrapDistribution = [
  { channel: "种子轮发行", amount: "500 万枚", ratio: "0.17%", rule: "单价 0.5 USDT，发行期 60 天，未售完部分打入黑洞" },
  { channel: "阶段性空投", amount: "500 万枚", ratio: "0.17%", rule: "注册认证后赠送 100 矿机碎片，合成空投矿机，最多产出 40 枚" },
  { channel: "POS 质押产出", amount: "约 29.9 亿枚", ratio: "99.66%", rule: "仅能通过质押销毁挖矿产出" },
];

export const seedModelPlan = [
  { model: "5000 型矿机", quantity: 300 },
  { model: "3000 型矿机", quantity: 400 },
  { model: "1000 型矿机", quantity: 1000 },
  { model: "500 型矿机", quantity: 1000 },
  { model: "300 型矿机", quantity: 1000 },
  { model: "100 型矿机", quantity: 5000 },
];

export const capitalFlowRows = [
  { time: "2026-04-26 10:05", type: "购买矿机", amount: "-1,000", balance: "28,450", hash: "0x2d...94a1" },
  { time: "2026-04-25 09:12", type: "复投", amount: "-260", balance: "29,450", hash: "0x7a...133c" },
];

export const circulateFlowRows = [
  { time: "2026-04-26 14:22", type: "C2C 卖出", amount: "-3,000", balance: "5,460.9", hash: "0x1c...ca83" },
  { time: "2026-04-26 14:22", type: "手续费扣除", amount: "-300", balance: "8,460.9", hash: "0xf2...ab31" },
];

export const usdtFlowRows = [
  { time: "2026-04-26 14:23", type: "C2C 卖出收入", amount: "+2,430", balance: "12,680.55", hash: "0x6b...25fd" },
  { time: "2026-04-24 09:40", type: "充值 USDT", amount: "+5,000", balance: "10,250.55", hash: "0x3e...1a22" },
];

export const teamMembers = [
  { address: "0x3C8d...A19f", performance: "126,000", level: "V2", joinedAt: "2026-01-02", directs: 6 },
  { address: "0xA822...9f3D", performance: "58,400", level: "V1", joinedAt: "2026-01-18", directs: 2 },
  { address: "0x9011...7Baf", performance: "302,100", level: "V4", joinedAt: "2025-12-09", directs: 11 },
];

export const seedPurchaseRecords = [
  { time: "2026-04-26 11:20", amount: "3,000 NETE", paidUsdt: "1,500", status: "成功" },
  { time: "2026-04-20 09:08", amount: "1,500 NETE", paidUsdt: "750", status: "成功" },
];
