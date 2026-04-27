import { c2cMarketOrders, circulationRules } from "../../data/mockData";
import ModulePageHero from "../../components/common/ModulePageHero";

export default function C2CMarketPage() {
  return (
    <section className="space-y-6">
      <ModulePageHero
        compact
        title="C2C 市场"
        subtitle="展示当前所有活跃卖单，按单价由低到高排序，买方可在规则约束内完成链上撮合交易。"
      />

      <article className="module-panel">
        <div className="module-table-wrap">
          <table className="module-table">
            <thead>
              <tr>
                <th>卖方地址</th>
                <th>数量</th>
                <th>单价</th>
                <th>剩余时间</th>
                <th>订单阶段</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {c2cMarketOrders.map((row) => (
                <tr key={`${row.seller}-${row.amount}`}>
                  <td>{row.seller}</td>
                  <td>{row.amount}</td>
                  <td>{row.price}</td>
                  <td>{row.leftTime}</td>
                  <td>{row.stage}</td>
                  <td>
                    <button className="module-button-primary">购买</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="module-warning">
        {circulationRules.map((row) => (
          <p key={row.mode}>
            {row.mode}：{row.rule}
          </p>
        ))}
        <p className="mt-2">通过 C2C 购买的 NETE 仅可用于购买矿机进行挖矿，不可二次 C2C 转卖。</p>
      </article>
    </section>
  );
}
