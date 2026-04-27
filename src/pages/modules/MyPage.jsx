import { Link } from "react-router-dom";
import ModulePageHero from "../../components/common/ModulePageHero";
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
      <ModulePageHero
        compact
        title="我的"
        subtitle="汇总你的链上资产、钱包流水与关键规则，帮助你更高效地管理 NETE 账户。"
        meta={`钱包状态：${globalOverview.wallet.connected ? "已连接" : "未连接"} · ${globalOverview.wallet.address}`}
      />

      <article className="module-panel">
        <h2 className="module-title text-xl">全局资产概览</h2>
        <div className="module-grid">
          {summaryItems.map((item) => (
            <article key={item.label} className="module-kpi-card">
              <div className="module-kpi-label">{item.label}</div>
              <div className="module-kpi-value">{item.value}</div>
            </article>
          ))}
        </div>
      </article>

      <article className="module-panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="module-title text-xl">流水模块</h2>
          <span className="module-badge">仅在我的页面展示</span>
        </div>

        <div className="space-y-4">
          {flowSections.map((section) => (
            <section key={section.title} className="rounded-xl border border-white/10 bg-transparent p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-white">{section.title}</h3>
                <span className="text-xs text-white/50">最近 {section.rows.length} 条</span>
              </div>

              <div className="module-table-wrap">
                <table className="module-table">
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

      <article className="module-panel">
        <h2 className="module-title text-xl">快捷入口</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/account/team" className="module-button-primary">
            进入团队
          </Link>
          <Link to="/finance/buy-seed" className="module-button-ghost">
            购买种子 NETE
          </Link>
          <Link to="/mining" className="module-button-ghost">
            查看矿机
          </Link>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        <details className="module-collapsible">
          <summary className="module-collapsible-summary">
            <h2 className="module-title text-xl">提币手续费分配</h2>
            <span className="module-collapsible-chevron" aria-hidden="true">
              v
            </span>
          </summary>
          <div className="module-collapsible-content">
            <div className="module-table-wrap">
              <table className="module-table">
                <thead>
                  <tr>
                    <th>分配项</th>
                    <th>占比</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawFeeDistributionRules.map((row) => (
                    <tr key={row.item}>
                      <td>{row.item}</td>
                      <td>{row.ratio}</td>
                      <td>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>

        <details className="module-collapsible">
          <summary className="module-collapsible-summary">
            <h2 className="module-title text-xl">分享加速规则</h2>
            <span className="module-collapsible-chevron" aria-hidden="true">
              v
            </span>
          </summary>
          <div className="module-collapsible-content">
            <div className="module-table-wrap">
              <table className="module-table">
                <thead>
                  <tr>
                    <th>直推人数</th>
                    <th>享受层数</th>
                    <th>加速收益</th>
                  </tr>
                </thead>
                <tbody>
                  {shareAccelerationRules.map((row) => (
                    <tr key={row.directs}>
                      <td>{row.directs}</td>
                      <td>{row.layers}</td>
                      <td>{row.income}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-white/70">{shareAccelerationNote}</p>
          </div>
        </details>
      </div>
    </section>
  );
}
