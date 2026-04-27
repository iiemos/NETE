import { shareAccelerationNote, shareAccelerationRules, teamMembers } from "../../data/mockData";
import ModulePageHero from "../../components/common/ModulePageHero";

const directCount = teamMembers.length;
const totalPerformance = teamMembers
  .reduce((sum, member) => sum + Number(member.performance.replaceAll(",", "")), 0)
  .toLocaleString();
const currentLayers = directCount >= 8 ? "8-20 层" : `${directCount} 层`;

export default function MyTeamPage() {
  return (
    <section className="space-y-6">
      <ModulePageHero
        compact
        title="团队模块"
        subtitle="展示团队结构、分享加速机制与直推成员数据，所有激励分配遵循链上规则执行。"
      />

      <div className="module-grid">
        <article className="module-kpi-card">
          <div className="module-kpi-label">当前直推成员数</div>
          <div className="module-kpi-value">{directCount}</div>
        </article>
        <article className="module-kpi-card">
          <div className="module-kpi-label">直推累计业绩（NETE）</div>
          <div className="module-kpi-value">{totalPerformance}</div>
        </article>
        <article className="module-kpi-card">
          <div className="module-kpi-label">当前享受层数</div>
          <div className="module-kpi-value">{currentLayers}</div>
        </article>
      </div>

      <article className="module-panel">
        <h2 className="module-title text-xl">分享（推广）加速机制</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>直推人数</th>
                <th>享受层数</th>
                <th>加速收益</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {shareAccelerationRules.map((row, index) => (
                <tr key={row.directs}>
                  <td>{row.directs}</td>
                  <td>{row.layers}</td>
                  <td>{row.income}</td>
                  <td>{index === 0 ? shareAccelerationNote : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="module-panel">
        <h2 className="module-title text-xl">直推列表</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>地址</th>
                <th>业绩（NETE）</th>
                <th>等级</th>
                <th>注册时间</th>
                <th>直推人数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.address}>
                  <td>{member.address}</td>
                  <td>{member.performance}</td>
                  <td>{member.level}</td>
                  <td>{member.joinedAt}</td>
                  <td>{member.directs}</td>
                  <td>
                    <button className="module-button-ghost">查看下级</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
