import { globalOverview, leadershipLevels, leadershipRuleNotes } from "../../data/mockData";
import ModulePageHero from "../../components/common/ModulePageHero";

export default function LeadershipPage() {
  return (
    <section className="space-y-6">
      <ModulePageHero
        compact
        title="领导力等级模块（V1–V9）"
        subtitle="等级依据小区业绩链上自动判定，围绕分红比例、固定奖励与治理权益构建社区价值分层体系。"
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="module-panel xl:col-span-2">
          <h2 className="module-title text-xl">等级权益表</h2>
          <div className="module-table-wrap mt-4">
            <table className="module-table">
              <thead>
                <tr>
                  <th>等级</th>
                  <th>小区业绩要求</th>
                  <th>分红比例</th>
                  <th>固定奖励（NETE）</th>
                </tr>
              </thead>
              <tbody>
                {leadershipLevels.map((row) => (
                  <tr key={row.level}>
                    <td>{row.level}</td>
                    <td>{row.requirement}</td>
                    <td>{row.bonusRatio}</td>
                    <td>{row.fixedReward.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="module-panel space-y-4">
          <h2 className="module-title text-xl">当前用户状态</h2>
          <div className="module-kpi-card">
            <div className="module-kpi-label">当前等级</div>
            <div className="module-kpi-value">{globalOverview.memberLevel}</div>
          </div>
          <div className="module-kpi-card">
            <div className="module-kpi-label">当前小区业绩</div>
            <div className="module-kpi-value">{globalOverview.zonePerformance} NETE</div>
          </div>
          <div className="module-kpi-card">
            <div className="module-kpi-label">下一等级判定</div>
            <div className="module-kpi-value">按链上业绩实时计算</div>
          </div>
          <div className="module-warning">
            <p>分红比例说明：{leadershipRuleNotes.bonus}</p>
            <p className="mt-2">固定奖励说明：{leadershipRuleNotes.fixedReward}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
