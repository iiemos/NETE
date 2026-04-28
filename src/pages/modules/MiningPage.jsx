import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { airdropMachineStatus, machineModels, miningWalletRules, purchasedMachines, reductionRules, withdrawFeeDistributionRules } from "../../data/mockData";

export default function MiningPage() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState("1");
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);

  const amountValue = Number(purchaseAmount);
  const isAmountValid = Number.isFinite(amountValue) && amountValue >= 1;

  const projectedCost = useMemo(() => {
    if (!selectedModel || !isAmountValid) {
      return 0;
    }
    return selectedModel.price * amountValue;
  }, [amountValue, isAmountValid, selectedModel]);

  const projectedOutput = useMemo(() => {
    if (!selectedModel || !isAmountValid) {
      return 0;
    }
    const rate = Number(String(selectedModel.returnRate).replace("%", ""));
    if (!Number.isFinite(rate)) {
      return 0;
    }
    return projectedCost * (rate / 100);
  }, [isAmountValid, projectedCost, selectedModel]);

  function openPurchaseModal(model = machineModels[0]) {
    setSelectedModel(model);
    setPurchaseAmount("1");
    setAcceptedAgreement(false);
    setModelPickerOpen(false);
  }

  function closePurchaseModal() {
    setSelectedModel(null);
    setPurchaseAmount("1");
    setAcceptedAgreement(false);
    setModelPickerOpen(false);
  }

  function openAgreementModal() {
    setAgreementOpen(true);
  }

  function closeAgreementModal() {
    setAgreementOpen(false);
  }

  function openAgreementFromPurchase() {
    closePurchaseModal();
    setAgreementOpen(true);
  }

  return (
    <section className="space-y-4">
      <header className="rounded-[28px] bg-transparent">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <p className="font-display text-base font-bold uppercase tracking-[0.12em] text-[#caff00] md:text-lg">NETE mining</p>
            <h1 className="mt-3 font-display text-xl font-black tracking-tight text-white md:text-2xl">矿机</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              NETE 核心产出机制基于 POS 质押销毁挖矿，矿机产出参数、手续费等级与减产节奏均由链上规则约束并公开可审计。
            </p>
          </div>
        </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition hover:shadow-[0_0_30px_rgba(202,255,0,0.45)]"
              type="button"
              onClick={() => openPurchaseModal()}
            >
              申购矿机
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5"
              type="button"
              onClick={openAgreementModal}
            >
              关于矿机
            </button>
          </div>
      </header>

      <article className="rounded-2xl bg-transparent p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
          <h2 className="font-display text-base font-bold tracking-wide  text-white md:text-xl">矿机型号</h2>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <ul className="min-w-[680px] text-left text-xs md:text-sm">
            <li className="grid grid-cols-[1.3fr_0.6fr_0.7fr_0.8fr] px-4 py-3 font-semibold text-white/65">
              <span>型号</span>
              <span>数量</span>
              <span>周期 (天)</span>
              <span>总收益率</span>
            </li>
            {machineModels.map((model) => (
              <li key={model.model} className="grid grid-cols-[1.3fr_0.6fr_0.7fr_0.8fr] px-4 py-3 text-white/85">
                <span>
                  <span className="block font-semibold text-white">{model.model}</span>
                  <span className="mt-1 block text-xs text-white/60">{model.price}NETE</span>
                </span>
                <span>{model.unitCount}</span>
                <span>{model.periodDays}</span>
                <span className="font-semibold text-[#caff00]">{model.returnRate}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-2 md:hidden">
          {machineModels.map((model) => (
            <li key={`mobile-${model.model}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{model.model}</p>
                  <p className="mt-1 text-[11px] text-white/60">{model.price} NETE</p>
                </div>
                <p className="text-sm font-semibold text-[#caff00]">{model.returnRate}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-white/70">
                <p>数量 {model.unitCount}</p>
                <p>周期 {model.periodDays} 天</p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide pb-2 border-b border-white/10 text-white md:text-xl">已购买矿机列表</h2>
        <div className="mt-4 hidden overflow-x-auto border-b-1 border-white/10 md:block">
          <ul className="min-w-[860px] text-left text-xs md:text-sm">
            <li className="grid grid-cols-[1.2fr_0.8fr_1fr_1fr_0.8fr] px-4 py-3 font-semibold text-white/65">
              <span>矿机型号</span>
              <span>购买数量</span>
              <span>周期进度</span>
              <span>已产出收益</span>
              <span>剩余周期</span>
            </li>
            {purchasedMachines.map((machine) => (
              <li key={`${machine.model}-${machine.quantity}`} className="grid grid-cols-[1.2fr_0.8fr_1fr_1fr_0.8fr]  px-4 py-3 text-white/85">
                <span>{machine.model}</span>
                <span>{machine.quantity}</span>
                <span className="font-semibold text-[#caff00]">{machine.cycleProgress}</span>
                <span className="font-semibold text-[#caff00]">{machine.output}</span>
                <span>{machine.remainingDays} 天</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-4 space-y-2 border-b border-white/10 pb-3 md:hidden">
          {purchasedMachines.map((machine) => (
            <li key={`mobile-purchased-${machine.model}-${machine.quantity}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-white">{machine.model}</p>
                <p className="text-sm font-semibold text-[#caff00]">{machine.output}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-white/70">
                <p>数量 {machine.quantity}</p>
                <p>进度 {machine.cycleProgress}</p>
                <p className="col-span-2">剩余周期 {machine.remainingDays} 天</p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      {selectedModel ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-2 pb-2 pt-2 backdrop-blur-sm md:bg-black/75 md:px-2 md:py-4 md:items-center"
          onClick={closePurchaseModal}
          role="presentation"
        >
          <article
            className="mobile-drawer-enter max-h-[70dvh] w-full max-w-[760px] overflow-y-auto rounded-t-[20px] rounded-b-none border border-white/10 bg-[#141419] p-4 text-white shadow-[0_25px_80px_rgba(0,0,0,0.55)] md:max-h-[92vh] md:rounded-[24px] md:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedModel.model} 申购`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff9900] text-base font-bold text-white">B</span>
                <h3 className="font-display text-lg font-bold tracking-tight text-white md:text-xl">{selectedModel.model} 申购</h3>
              </div>
              <button
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xl leading-none text-white/70 transition hover:bg-white/10 hover:text-white"
                type="button"
                onClick={closePurchaseModal}
                aria-label="关闭"
              >
                <Icon icon="solar:close-circle-outline" width="1em" height="1em" />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-white/90">
                矿机型号
              </label>
              <div className="relative mt-2">
                <button
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-white/20 bg-black/35 px-3 text-left text-sm font-semibold text-white transition hover:border-white/35"
                  type="button"
                  onClick={() => setModelPickerOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={modelPickerOpen}
                >
                  <span className="truncate">
                    {selectedModel.model} - {selectedModel.price}NETE
                  </span>
                  <span className={`ml-3 shrink-0 text-base text-white/70 transition-transform ${modelPickerOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    <Icon icon="solar:alt-arrow-down-outline" width="1em" height="1em" />
                  </span>
                </button>

                {modelPickerOpen ? (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-[#1a1a22] shadow-[0_16px_50px_rgba(0,0,0,0.55)]">
                    <div className="max-h-56 overflow-y-auto py-1.5" role="listbox" aria-label="矿机型号选择">
                      {machineModels.map((model) => {
                        const active = selectedModel.model === model.model;
                        return (
                          <button
                            key={model.model}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                              active ? "bg-[#caff00]/12 text-[#dcff64]" : "text-white/90 hover:bg-white/5"
                            }`}
                            type="button"
                            onClick={() => {
                              setSelectedModel(model);
                              setPurchaseAmount("1");
                              setAcceptedAgreement(false);
                              setModelPickerOpen(false);
                            }}
                            role="option"
                            aria-selected={active}
                          >
                            <span className="truncate">
                              {model.model} - {model.price}NETE
                            </span>
                            {active ? (
                              <span className="ml-3 shrink-0 text-base text-[#caff00]" aria-hidden="true">
                                <Icon icon="solar:check-circle-bold" width="1em" height="1em" />
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-base font-semibold text-white/90">参考总收益率</div>
              <div className="mt-1.5 inline-flex items-center rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white/85">活期</div>
              <p className="mt-1.5 font-display text-2xl font-black text-[#caff00]">{selectedModel.returnRate}</p>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-white/90" htmlFor="mining-purchase-input">
                申购数量
              </label>
              <div className="mt-2 flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4">
                <input
                  id="mining-purchase-input"
                  className="w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/45"
                  type="number"
                  min="1"
                  value={purchaseAmount}
                  onChange={(event) => setPurchaseAmount(event.target.value)}
                  placeholder={`最小 1，最大 ${selectedModel.remaining}`}
                />
                <span className="shrink-0 text-sm font-semibold text-white/65">台</span>
                <button
                  className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-sm font-semibold text-[#caff00] transition hover:bg-[#caff00]/10 hover:text-[#dcff64]"
                  type="button"
                  onClick={() => setPurchaseAmount(String(selectedModel.remaining))}
                >
                  最大
                </button>
              </div>
              <p className="mt-2 text-xs text-white/65">可购数量 {selectedModel.remaining} 台</p>
            </div>

            <section className="mt-6">
              <h4 className="text-2xl font-black leading-none text-white">收益计算</h4>
              <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs md:grid-cols-2 md:text-sm">
                <div>
                  <p className="text-white/55">预计总投入</p>
                  <p className="mt-1 text-base font-semibold text-white">{isAmountValid ? `${projectedCost.toLocaleString()} NETE` : "--"}</p>
                </div>
                <div>
                  <p className="text-white/55">预计总产出</p>
                  <p className="mt-1 text-base font-semibold text-[#caff00]">{isAmountValid ? `${projectedOutput.toLocaleString(undefined, { maximumFractionDigits: 2 })} NETE` : "--"}</p>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <h4 className="text-2xl font-black leading-none text-white">流程</h4>
              <p className="mt-1.5 text-xs text-white/70">按小时计息，随时存取</p>
              <ol className="mt-3 space-y-3 border-l border-dashed border-white/20 pl-3">
                <li>
                  <p className="text-base font-semibold text-white">申购时间</p>
                  <p className="text-sm text-white/60">即时确认</p>
                </li>
                <li>
                  <p className="text-base font-semibold text-white">起息时间</p>
                  <p className="text-sm text-white/60">申购成功后 1 小时</p>
                </li>
                <li>
                  <p className="text-base font-semibold text-white">利息发放</p>
                  <p className="text-sm text-white/60">按规则自动发放至钱包</p>
                </li>
              </ol>
            </section>

            <div className="mt-5 space-y-3">
              <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/75 sm:grid-cols-2 md:text-sm">
                <p>延长：{selectedModel.extendDays} 天</p>
                <p>最长周期：{selectedModel.maxPeriodDays} 天</p>
                <p>提币手续费：{selectedModel.withdrawFee}%</p>
                <p>单台周期：{selectedModel.periodDays} 天</p>
              </div>

              <label className="flex items-start gap-2 text-xs text-white/70 md:text-sm">
                <input
                  className="mt-0.5 h-4 w-4 rounded border border-white/30 bg-transparent accent-[#caff00]"
                  type="checkbox"
                  checked={acceptedAgreement}
                  onChange={(event) => setAcceptedAgreement(event.target.checked)}
                />
                <span>
                  我已阅读并同意
                  <button
                    className="ml-1 font-semibold text-[#caff00] underline decoration-dotted underline-offset-4"
                    type="button"
                    onClick={openAgreementFromPurchase}
                  >
                    NETE 矿机申购协议
                  </button>
                </span>
              </label>
            </div>

            <button
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#caff00] text-base font-semibold text-black transition enabled:hover:shadow-[0_0_30px_rgba(202,255,0,0.45)] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
              type="button"
              disabled={!acceptedAgreement || !isAmountValid}
              onClick={closePurchaseModal}
            >
              申购
            </button>
          </article>
        </div>
      ) : null}

      {agreementOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-2 pb-2 pt-2 backdrop-blur-sm md:bg-black/75 md:px-2 md:py-4 md:items-center"
          onClick={closeAgreementModal}
          role="presentation"
        >
          <article
            className="mobile-drawer-enter max-h-[70dvh] w-full max-w-[1200px] overflow-y-auto rounded-t-[20px] rounded-b-none border border-white/10 bg-[#141419] p-4 text-white shadow-[0_25px_80px_rgba(0,0,0,0.55)] md:max-h-[92vh] md:rounded-[24px] md:p-7"
            role="dialog"
            aria-modal="true"
            aria-label="NETE 矿机申购协议"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <h3 className="font-display text-lg font-bold tracking-tight text-white md:text-xl">NETE 矿机申购协议</h3>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-white/70 transition hover:bg-white/10 hover:text-white"
                type="button"
                onClick={closeAgreementModal}
                aria-label="关闭"
              >
                <Icon icon="solar:close-circle-outline" width="1em" height="1em" />
              </button>
            </div>

            <div className="mt-5 space-y-6 text-xs leading-relaxed text-white/85 md:text-sm">
              <section className="space-y-4">
                <h4 className="text-2xl font-bold text-white md:text-2xl">
                  <span className="text-[#caff00]">1.</span>
                  空投矿机状态说明
                </h4>
                <div className="space-y-1">
                  <p>是否已合成：{airdropMachineStatus.synthesized ? "已合成" : "未合成"}</p>
                  <p>永久矿机状态：{airdropMachineStatus.permanent ? "已转永久" : "未转永久"}</p>
                  <p>有效期剩余：{airdropMachineStatus.validityLeftDays} 天</p>
                  <p>已产出收益：{airdropMachineStatus.produced}</p>
                  <p>买一赠一规则：{airdropMachineStatus.triggerGiftRule}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl">
                  <span className="text-[#caff00]">2.</span>
                  产出与钱包规则
                </h4>
                <div className="space-y-1">
                  {miningWalletRules.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl">
                  <span className="text-[#caff00]">3.</span>
                  减产机制（时间调节阀）
                </h4>
                <div className="space-y-1">
                  {reductionRules.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl">
                  <span className="text-[#caff00]">4.</span>
                  提币手续费分配机制（100% 分配）
                </h4>
                <div className="space-y-1">
                  {withdrawFeeDistributionRules.map((row) => (
                    <p key={row.item}>
                      {row.item}：{row.ratio}，{row.use}
                    </p>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl">
                  <span className="text-[#caff00]">5.</span>
                  机制提示
                </h4>
                <div className="space-y-1">
                  <p>矿机产出与销毁同步进行，确保增长与通缩同向联动。</p>
                  <p>提币手续费按矿机等级动态收取（20%-30%），每日链上自动分配。</p>
                </div>
              </section>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
