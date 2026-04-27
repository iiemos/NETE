import ModulePageHero from "../../components/common/ModulePageHero";
import {
  airdropMachineModel,
  airdropMachineStatus,
  machineModels,
  miningWalletRules,
  purchasedMachines,
  reductionRules,
  withdrawFeeDistributionRules,
} from "../../data/mockData";

export default function MiningPage() {
  return (
    <section className="space-y-6">
      <ModulePageHero
        title="矿机模块"
        subtitle="NETE 核心产出机制基于 POS 质押销毁挖矿，矿机产出参数、手续费等级与减产节奏均由链上规则约束并公开可审计。"
      />

      <article className="module-panel space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="module-title text-xl">矿机型号列表</h2>
          <span className="module-badge">按成本金额从小到大</span>
        </div>

        <div className="module-table-wrap">
          <table className="module-table">
            <thead>
              <tr>
                <th>型号</th>
                <th>矿机价格 (NETE)</th>
                <th>数量</th>
                <th>周期 (天)</th>
                <th>总收益率</th>
                <th>延长 (天)</th>
                <th>最长周期 (天)</th>
                <th>提币手续费 (%)</th>
                <th>购买数量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {machineModels.map((model) => (
                <tr key={model.model}>
                  <td>{model.model}</td>
                  <td>{model.price}</td>
                  <td>{model.unitCount}</td>
                  <td>{model.periodDays}</td>
                  <td>{model.returnRate}</td>
                  <td>{model.extendDays}</td>
                  <td>{model.maxPeriodDays}</td>
                  <td>{model.withdrawFee}%</td>
                  <td>
                    <input className="module-input max-w-[120px]" type="number" min="1" defaultValue="1" />
                  </td>
                  <td>
                    <button className="module-button-primary">购买</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="module-panel space-y-4">
          <h2 className="module-title text-xl">空投矿机机制</h2>
          <div className="module-table-wrap">
            <table className="module-table">
              <thead>
                <tr>
                  <th>空投型号</th>
                  <th>金额</th>
                  <th>数量</th>
                  <th>周期</th>
                  <th>最高产出</th>
                  <th>最长周期</th>
                  <th>提币费</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{airdropMachineModel.model}</td>
                  <td>{airdropMachineModel.price}</td>
                  <td>{airdropMachineModel.unitCount}</td>
                  <td>{airdropMachineModel.periodDays} 天</td>
                  <td>{airdropMachineModel.returnRate}</td>
                  <td>{airdropMachineModel.maxPeriodDays} 天</td>
                  <td>{airdropMachineModel.withdrawFee}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="module-warning">
            注册认证赠送 100 矿机碎片（手动合成 100 型空投矿机）；若 75 天内购买 ≥100 型矿机，空投矿机可转为永久矿机。
          </div>
        </article>

        <article className="module-panel">
          <h2 className="module-title text-xl">空投矿机状态</h2>
          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            <div className="module-kpi-card">
              <div className="module-kpi-label">是否已合成</div>
              <div className="module-kpi-value">{airdropMachineStatus.synthesized ? "已合成" : "未合成"}</div>
            </div>
            <div className="module-kpi-card">
              <div className="module-kpi-label">永久矿机状态</div>
              <div className="module-kpi-value">{airdropMachineStatus.permanent ? "已转永久" : "未转永久"}</div>
            </div>
            <div className="module-kpi-card">
              <div className="module-kpi-label">有效期剩余</div>
              <div className="module-kpi-value">{airdropMachineStatus.validityLeftDays} 天</div>
            </div>
            <div className="module-kpi-card">
              <div className="module-kpi-label">已产出收益</div>
              <div className="module-kpi-value">{airdropMachineStatus.produced}</div>
            </div>
          </div>
          <div className="module-warning mt-4">买一赠一规则：{airdropMachineStatus.triggerGiftRule}</div>
        </article>
      </div>

      <article className="module-panel">
        <h2 className="module-title text-xl">已购买矿机列表</h2>
        <div className="module-table-wrap mt-4">
          <table className="module-table">
            <thead>
              <tr>
                <th>矿机型号</th>
                <th>购买数量</th>
                <th>周期进度</th>
                <th>已产出收益</th>
                <th>剩余周期</th>
              </tr>
            </thead>
            <tbody>
              {purchasedMachines.map((machine) => (
                <tr key={`${machine.model}-${machine.quantity}`}>
                  <td>{machine.model}</td>
                  <td>{machine.quantity}</td>
                  <td>{machine.cycleProgress}</td>
                  <td>{machine.output}</td>
                  <td>{machine.remainingDays} 天</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="module-panel">
          <h2 className="module-title text-xl">产出与钱包规则</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {miningWalletRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="module-panel">
          <h2 className="module-title text-xl">减产机制（时间调节阀）</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {reductionRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="module-panel">
        <h2 className="module-title text-xl">提币手续费分配机制（100% 分配）</h2>
        <div className="module-table-wrap mt-4">
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
      </article>

      <article className="module-warning">
        <p>机制提示：</p>
        <p>1. 矿机产出与销毁同步进行，确保增长与通缩同向联动。</p>
        <p>2. 提币手续费按矿机等级动态收取（20%-30%），每日链上自动分配。</p>
      </article>
    </section>
  );
}
