import { Link } from "react-router-dom";
import { c2cDealOrders, c2cEntrustOrders, c2cFeeRules, circulationRules, fundSecurityRules, globalOverview } from "../../data/mockData";
import ModulePageHero from "../../components/common/ModulePageHero";

const entryCards = [
  { title: "创建 C2C 卖单", desc: "输入卖出数量和单价，支持 10 分钟定向挂单", to: "/c2c/sell" },
  { title: "查看 C2C 市场", desc: "按价格由低到高浏览活跃卖单并购买", to: "/c2c/market" },
  { title: "C2C 委托订单", desc: "查看未成交卖单并支持撤单", to: "/c2c#entrust" },
  { title: "C2C 成交订单", desc: "查看历史成交记录与成交额", to: "/c2c#deals" },
];

export default function C2COverviewPage() {
  return (
    <section className="space-y-6">
      <ModulePageHero
        compact
        title="C2C 模块总览"
        subtitle="C2C 采用挂卖单机制组织链上流通，交易规则、手续费口径与安全约束统一按合约参数执行。"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {entryCards.map((card) => (
          <Link key={card.title} to={card.to} className="module-link-card">
            <h2 className="font-display text-lg font-semibold text-white">{card.title}</h2>
            <p className="text-sm text-white/65">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="module-panel" id="entrust">
          <h2 className="module-title text-xl">C2C 委托订单</h2>
          <div className="module-table-wrap mt-4">
            <table className="module-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>方向</th>
                  <th>数量</th>
                  <th>价格</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {c2cEntrustOrders.map((row) => (
                  <tr key={`${row.time}-${row.amount}`}>
                    <td>{row.time}</td>
                    <td>{row.side}</td>
                    <td>{row.amount}</td>
                    <td>{row.price}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="module-panel" id="deals">
          <h2 className="module-title text-xl">C2C 成交订单</h2>
          <div className="module-table-wrap mt-4">
            <table className="module-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>方向</th>
                  <th>数量</th>
                  <th>单价</th>
                  <th>成交额</th>
                </tr>
              </thead>
              <tbody>
                {c2cDealOrders.map((row) => (
                  <tr key={`${row.time}-${row.total}`}>
                    <td>{row.time}</td>
                    <td>{row.side}</td>
                    <td>{row.amount}</td>
                    <td>{row.price}</td>
                    <td>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="module-panel">
          <h2 className="module-title text-xl">C2C 手续费规则</h2>
          <div className="module-table-wrap mt-4">
            <table className="module-table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>规则</th>
                </tr>
              </thead>
              <tbody>
                {c2cFeeRules.map((row) => (
                  <tr key={row.item}>
                    <td>{row.item}</td>
                    <td>{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="module-panel">
          <h2 className="module-title text-xl">链上交互与流通规则</h2>
          <div className="module-table-wrap mt-4">
            <table className="module-table">
              <thead>
                <tr>
                  <th>交易方式</th>
                  <th>规则</th>
                </tr>
              </thead>
              <tbody>
                {circulationRules.map((row) => (
                  <tr key={row.mode}>
                    <td>{row.mode}</td>
                    <td>{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article className="module-panel">
        <h2 className="module-title text-xl">资金安全机制</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>机制</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {fundSecurityRules.map((row) => (
                <tr key={row.mechanism}>
                  <td>{row.mechanism}</td>
                  <td>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="module-panel">
        <h2 className="module-title text-xl">余额信息</h2>
        <div className="module-grid mt-4">
          <div className="module-kpi-card">
            <div className="module-kpi-label">我的 USDT 余额</div>
            <div className="module-kpi-value">{globalOverview.wallet.usdtBalance}</div>
          </div>
          <div className="module-kpi-card">
            <div className="module-kpi-label">我的 NETE 余额</div>
            <div className="module-kpi-value">{globalOverview.circulateWallet}</div>
          </div>
        </div>
      </article>
    </section>
  );
}
