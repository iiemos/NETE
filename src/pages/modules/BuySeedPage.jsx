import { bootstrapDistribution, globalOverview, seedModelPlan, seedPurchaseRecords } from "../../data/mockData";
import ModulePageHero from "../../components/common/ModulePageHero";

export default function BuySeedPage() {
  const currentSeedPrice = 0.5;

  return (
    <section className="space-y-6">
      <ModulePageHero
        compact
        title="购买种子 NETE"
        subtitle="种子轮发行价 0.5 USDT/NETE，发行期 60 天，总量 500 万枚；未售完部分在发行期结束后打入黑洞地址。"
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="module-panel xl:col-span-2">
          <h2 className="module-title text-xl">购买输入</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/75">
              当前 NETE 价格（USDT）
              <input className="module-input" value={currentSeedPrice} disabled />
            </label>
            <label className="space-y-2 text-sm text-white/75">
              购买数量（NETE）
              <input className="module-input" type="number" placeholder="例如 3000" />
            </label>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/75">
              链上 USDT 余额
              <input className="module-input" value={globalOverview.wallet.usdtBalance} disabled />
            </label>
            <label className="space-y-2 text-sm text-white/75">
              预计扣除 USDT
              <input className="module-input" placeholder="自动计算：购买数量 × 价格" disabled />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="module-button-primary">确认购买</button>
            <button className="module-button-ghost">清空</button>
          </div>
        </article>

        <article className="module-panel space-y-4">
          <h2 className="module-title text-xl">发行规则</h2>
          <div className="module-kpi-card">
            <div className="module-kpi-label">发行总量</div>
            <div className="module-kpi-value">5,000,000 NETE</div>
          </div>
          <div className="module-kpi-card">
            <div className="module-kpi-label">发行价格</div>
            <div className="module-kpi-value">0.5 USDT/NETE</div>
          </div>
          <div className="module-kpi-card">
            <div className="module-kpi-label">发行期</div>
            <div className="module-kpi-value">60 天</div>
          </div>
        </article>
      </div>

      <article className="module-panel">
        <h2 className="module-title text-xl">启动分配（三驾马车）</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>分配渠道</th>
                <th>数量</th>
                <th>占比</th>
                <th>核心目的与规则</th>
              </tr>
            </thead>
            <tbody>
              {bootstrapDistribution.map((row) => (
                <tr key={row.channel}>
                  <td>{row.channel}</td>
                  <td>{row.amount}</td>
                  <td>{row.ratio}</td>
                  <td>{row.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="module-panel">
        <h2 className="module-title text-xl">种子矿机型号与数量</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>型号</th>
                <th>数量（台）</th>
              </tr>
            </thead>
            <tbody>
              {seedModelPlan.map((row) => (
                <tr key={row.model}>
                  <td>{row.model}</td>
                  <td>{row.quantity.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="module-panel">
        <h2 className="module-title text-xl">购买记录</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>购买数量（NETE）</th>
                <th>支付 USDT</th>
                <th>交易状态</th>
              </tr>
            </thead>
            <tbody>
              {seedPurchaseRecords.map((record) => (
                <tr key={`${record.time}-${record.amount}`}>
                  <td>{record.time}</td>
                  <td>{record.amount}</td>
                  <td>{record.paidUsdt}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
