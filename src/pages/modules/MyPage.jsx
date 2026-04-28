import { Link } from "react-router-dom";
import {
  capitalFlowRows,
  circulateFlowRows,
  globalOverview,
  shareAccelerationNote,
  shareAccelerationRules,
  usdtFlowRows,
  withdrawFeeDistributionRules,
} from "../../data/mockData";

const summaryItems = [
  { label: "会员等级", value: globalOverview.memberLevel },
  { label: "今日 NETE 价格", value: `${globalOverview.netePrice} USDT` },
  { label: "本金钱包", value: `${globalOverview.principalWallet} NETE` },
  { label: "投资业绩", value: `${globalOverview.investmentPerformance} NETE` },
  { label: "流通钱包", value: `${globalOverview.circulateWallet} NETE` },
  { label: "团队业绩", value: `${globalOverview.teamPerformance} NETE` },
  { label: "小区业绩", value: `${globalOverview.zonePerformance} NETE` },
  { label: "已销毁总量", value: `${globalOverview.burnTotal} NETE` },
  { label: "当前流通总量", value: `${globalOverview.circulatingSupply} NETE` },
  { label: "距 2100 万目标", value: `${globalOverview.burnToTarget} NETE` },
];

const flowSections = [
  { title: "本金钱包流水", unit: "NETE", rows: capitalFlowRows },
  { title: "流通钱包流水", unit: "NETE", rows: circulateFlowRows },
  { title: "USDT 钱包流水", unit: "USDT", rows: usdtFlowRows },
];

function amountClassName(amount) {
  return amount.startsWith("+") ? "text-emerald-300" : "text-rose-300";
}

export default function MyPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-[28px] bg-transparent">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl font-black tracking-tight text-white md:text-3xl">我的</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">汇总你的链上资产、钱包流水与关键规则，帮助你更高效地管理 NETE 账户。</p>
          </div>
        </div>
      </header>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display mb-4 text-base font-bold tracking-wide text-white md:text-xl">全局资产概览</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/10 bg-transparent p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-white/55">{item.label}</div>
              <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{item.value}</div>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-2xl bg-transparent">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">流水模块</h2>
        </div>

        <div className="space-y-4">
          {flowSections.map((section) => (
            <section key={section.title} className="rounded-xl border border-white/10 bg-transparent p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-white">{section.title}</h3>
                <span className="text-xs text-white/50">最近 {section.rows.length} 条</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full border-collapse text-left text-xs md:text-sm [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-white/65 [&_td]:border-t [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-white/85">
                  <thead>
                    <tr>
                      <th>时间戳</th>
                      <th>类型</th>
                      <th>数量（{section.unit}）</th>
                      <th>余额（{section.unit}）</th>
                      <th>交易 Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={`${row.time}-${row.hash}`}>
                        <td>{row.time}</td>
                        <td>{row.type}</td>
                        <td className={amountClassName(row.amount)}>{row.amount}</td>
                        <td>{row.balance}</td>
                        <td className="font-mono text-xs text-[#caff00]">{row.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">快捷入口</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/account/team" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition hover:shadow-[0_0_30px_rgba(202,255,0,0.45)]">
            进入团队
          </Link>
          <Link to="/finance/buy-seed" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5">
            购买种子 NETE
          </Link>
          <Link to="/mining" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5">
            查看矿机
          </Link>
        </div>
      </article>
    </section>
  );
}
