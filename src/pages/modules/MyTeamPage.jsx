import { shareAccelerationNote, shareAccelerationRules, teamMembers } from "../../data/mockData";

const directCount = teamMembers.length;
const totalPerformance = teamMembers
  .reduce((sum, member) => sum + Number(member.performance.replaceAll(",", "")), 0)
  .toLocaleString();
const currentLayers = directCount >= 8 ? "8-20 层" : `${directCount} 层`;

export default function MyTeamPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-[28px] bg-transparent">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl font-black tracking-tight text-white md:text-3xl">团队模块</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">展示团队结构、分享加速机制与直推成员数据，所有激励分配遵循链上规则执行。</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">当前直推成员数</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{directCount}</div>
        </article>
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">直推累计业绩（NETE）</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{totalPerformance}</div>
        </article>
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">当前享受层数</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{currentLayers}</div>
        </article>
      </div>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">分享（推广）加速机制</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full border-collapse text-left text-xs md:text-sm [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-white/65 [&_td]:border-t [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-white/85">
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

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">直推列表</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full border-collapse text-left text-xs md:text-sm [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-white/65 [&_td]:border-t [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-white/85">
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
                    <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5">查看下级</button>
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
