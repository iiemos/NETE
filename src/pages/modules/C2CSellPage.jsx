import { c2cFeeRules, circulationRules, globalOverview } from "../../data/mockData";
import ModulePageHero from "../../components/common/ModulePageHero";

export default function C2CSellPage() {
  return (
    <section className="space-y-6">
      <ModulePageHero
        compact
        title="创建 C2C 卖单"
        subtitle="仅支持挂卖单。订单创建后进入 10 分钟定向期，超时自动切换为全网可见订单。"
      />

      <article className="module-panel">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/75">
            卖出数量（NETE）
            <input className="module-input" type="number" placeholder="例如 5000" />
          </label>
          <label className="space-y-2 text-sm text-white/75">
            卖出价格（USDT）
            <input className="module-input" type="number" placeholder="例如 0.92" />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="module-kpi-card">
            <div className="module-kpi-label">我的 USDT 余额</div>
            <div className="module-kpi-value">{globalOverview.wallet.usdtBalance}</div>
          </div>
          <div className="module-kpi-card">
            <div className="module-kpi-label">我的 NETE 余额</div>
            <div className="module-kpi-value">{globalOverview.circulateWallet}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="module-button-primary">创建卖单</button>
          <button className="module-button-ghost">全部 NETE</button>
        </div>
      </article>

      <article className="module-warning">
        <p>交易规则：</p>
        {c2cFeeRules.map((row) => (
          <p key={row.item}>- {row.item}：{row.rule}</p>
        ))}
        {circulationRules.map((row) => (
          <p key={row.mode}>- {row.mode}：{row.rule}</p>
        ))}
      </article>
    </section>
  );
}
