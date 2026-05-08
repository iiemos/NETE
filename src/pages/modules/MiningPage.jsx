import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { miningWalletRules, reductionRules, withdrawFeeDistributionRules } from "../../data/mockData";
import { useWalletConnector } from "../../hooks/useWalletConnector";
import { getRuntimeConfig } from "../../services/neteApi";
import { activateMiner, approveNeteToCore, claimReward, readTierConfigs, readUserMiningData, withdrawProfit } from "../../services/neteContracts";
import { formatTokenAmount } from "../../utils/formatters";

const MINING_VIEWS = [
  { key: "my-miners", label: "我的矿机" },
  { key: "buy-miners", label: "购买矿机" },
  { key: "rules", label: "规则说明" },
];

function parsePercent(rateText) {
  const parsed = Number(String(rateText || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDaysByEpoch(endAt) {
  if (!endAt) return 0;
  const nowSec = Math.floor(Date.now() / 1000);
  const diff = Number(endAt) - nowSec;
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86400);
}

export default function MiningPage() {
  const wallet = useWalletConnector();
  const queryClient = useQueryClient();

  const [activeView, setActiveView] = useState("my-miners");
  const [selectedModel, setSelectedModel] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState("1");
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [txMessage, setTxMessage] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [claimingId, setClaimingId] = useState("");
  const [withdrawingId, setWithdrawingId] = useState("");

  const tiersQuery = useQuery({
    queryKey: ["nete", "miner-tiers"],
    queryFn: () => readTierConfigs(20),
    staleTime: 15_000,
    retry: 1,
  });

  const miningDataQuery = useQuery({
    queryKey: ["nete", "mining", wallet.currentAddress],
    queryFn: () => readUserMiningData(wallet.currentAddress),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 10_000,
    retry: 1,
  });

  const runtimeConfigQuery = useQuery({
    queryKey: ["nete", "runtime-config"],
    queryFn: getRuntimeConfig,
    staleTime: 20_000,
    retry: 1,
  });

  const machineModels = useMemo(
    () =>
      (tiersQuery.data || []).map((tier) => ({
        model: `${formatTokenAmount(tier.principal, 18, 0)} 型`,
        price: Number(tier.principalText),
        principalWei: tier.principal,
        unitCount: tier.maxSlots,
        periodDays: tier.cycleDays,
        returnRate: tier.returnRateText,
        extendDays: tier.extendDays,
        maxPeriodDays: tier.maxDays,
        withdrawFee: Number((tier.feeBps / 100).toFixed(2)),
        remaining: tier.maxSlots,
        tierIndex: tier.tierIndex,
      })),
    [tiersQuery.data],
  );

  const purchasedMachines = useMemo(() => {
    const tiersMap = new Map(machineModels.map((model) => [model.tierIndex, model]));
    const positions = miningDataQuery.data?.positions || [];

    return positions.map((position) => {
      const tier = tiersMap.get(position.tierIndex);
      const cycleTotal = position.cycleTotalDays > 0 ? position.cycleTotalDays : 1;
      const cycleCurrent = Math.max(0, Math.min(position.cyclePassedDays, cycleTotal));

      return {
        model: tier?.model || `T${position.tierIndex}`,
        quantity: 1,
        cycleProgress: `${cycleCurrent} / ${cycleTotal} 天`,
        output: `${formatTokenAmount(position.grossClaimed, 18, 4)} NETE`,
        pending: `${formatTokenAmount(position.pendingReward, 18, 4)} NETE`,
        profit: `${formatTokenAmount(position.profit, 18, 4)} NETE`,
        profitWei: position.profit,
        remainingDays: formatDaysByEpoch(position.endAt),
        positionId: position.positionId,
        cycleCurrent,
        cycleTotal,
      };
    });
  }, [machineModels, miningDataQuery.data]);

  const airdropMachineStatus = useMemo(() => {
    const info = miningDataQuery.data?.airdropInfo;
    const related = (miningDataQuery.data?.positions || []).find((item) => item.positionId === String(info?.positionId || ""));

    return {
      synthesized: Boolean(info?.composed),
      permanent: Boolean(info?.promoted),
      validityLeftDays: info?.expireAt ? formatDaysByEpoch(Number(info.expireAt)) : 0,
      produced: related ? `${formatTokenAmount(related.grossClaimed, 18, 4)} NETE` : "0 NETE",
      triggerGiftRule: "按合约规则达标后可转永久矿机",
    };
  }, [miningDataQuery.data]);

  const amountValue = Number(purchaseAmount);
  const isAmountValid = Number.isInteger(amountValue) && amountValue >= 1;

  const projectedCost = useMemo(() => {
    if (!selectedModel || !isAmountValid) return 0;
    return selectedModel.price * amountValue;
  }, [amountValue, isAmountValid, selectedModel]);

  const projectedOutput = useMemo(() => {
    if (!selectedModel || !isAmountValid) return 0;
    return projectedCost * (parsePercent(selectedModel.returnRate) / 100);
  }, [isAmountValid, projectedCost, selectedModel]);

  const summaryCards = useMemo(() => {
    const holdings = purchasedMachines.length;
    const totalOutputValue = purchasedMachines.reduce((sum, item) => {
      const raw = Number(item.output.replace(/[^\d.]/g, ""));
      return sum + (Number.isFinite(raw) ? raw : 0);
    }, 0);

    const avgProgress = purchasedMachines.length
      ? Math.round(
          purchasedMachines.reduce((sum, item) => sum + Math.round((item.cycleCurrent / item.cycleTotal) * 100), 0) / purchasedMachines.length,
        )
      : 0;

    const avgRemaining = purchasedMachines.length
      ? Math.round(purchasedMachines.reduce((sum, item) => sum + item.remainingDays, 0) / purchasedMachines.length)
      : 0;

    return [
      { label: "持仓矿机", value: `${holdings} 台` },
      { label: "链上仓位", value: `${holdings} 条` },
      { label: "已产出收益", value: `${totalOutputValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} NETE`, accent: true },
      { label: "平均进度", value: `${avgProgress}%` },
      { label: "平均剩余周期", value: `${avgRemaining} 天` },
      { label: "空投矿机状态", value: airdropMachineStatus.permanent ? "已转永久" : "未转永久" },
    ];
  }, [airdropMachineStatus.permanent, purchasedMachines]);

  const planStats = useMemo(() => {
    const maxRate = machineModels.reduce((max, item) => Math.max(max, parsePercent(item.returnRate)), 0);
    const minDays = machineModels.reduce((min, item) => Math.min(min, item.periodDays), Number.POSITIVE_INFINITY);
    const maxDays = machineModels.reduce((max, item) => Math.max(max, item.periodDays), 0);

    return {
      modelCount: machineModels.length,
      maxRate,
      cycleRange: machineModels.length ? `${minDays} - ${maxDays} 天` : "--",
    };
  }, [machineModels]);

  const portfolioRows = useMemo(
    () =>
      purchasedMachines.map((item, index) => {
        const progressPercent = Math.round((item.cycleCurrent / item.cycleTotal) * 100);
        return {
          ...item,
          recordId: `POS-${String(index + 1).padStart(3, "0")}`,
          progressPercent,
        };
      }),
    [purchasedMachines],
  );

  function openPurchaseModal(model = machineModels[0]) {
    if (!model) return;
    setSelectedModel(model);
    setPurchaseAmount("1");
    setAcceptedAgreement(false);
    setModelPickerOpen(false);
    setTxMessage("");
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

  const repurchasePaused = Boolean(runtimeConfigQuery.data?.repurchase_paused);
  const canSubmitPurchase = Boolean(selectedModel) && isAmountValid && acceptedAgreement && wallet.isConnected && !purchasing && !repurchasePaused;

  const handlePurchase = async () => {
    if (!canSubmitPurchase || !selectedModel) return;

    try {
      setPurchasing(true);
      setTxMessage("");
      await wallet.ensureCorrectChain();

      const totalApprove = selectedModel.principalWei * BigInt(amountValue);
      await approveNeteToCore(wallet.currentAddress, totalApprove);

      let latestHash = "";
      for (let index = 0; index < amountValue; index += 1) {
        const tx = await activateMiner(wallet.currentAddress, selectedModel.tierIndex);
        latestHash = tx.hash;
      }

      setTxMessage(`申购成功，交易哈希：${latestHash}`);
      await queryClient.invalidateQueries({ queryKey: ["nete", "mining", wallet.currentAddress] });
      closePurchaseModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : "申购失败，请稍后重试";
      setTxMessage(message);
    } finally {
      setPurchasing(false);
    }
  };

  const handleClaim = async (positionId) => {
    if (!wallet.isConnected || !positionId || claimingId || withdrawingId) return;

    try {
      setClaimingId(positionId);
      setTxMessage("");
      await wallet.ensureCorrectChain();
      const tx = await claimReward(wallet.currentAddress, positionId);
      setTxMessage(`领取成功，交易哈希：${tx.hash}`);
      await queryClient.invalidateQueries({ queryKey: ["nete", "mining", wallet.currentAddress] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "领取失败，请稍后重试";
      setTxMessage(message);
    } finally {
      setClaimingId("");
    }
  };

  const handleWithdraw = async (positionId, amount) => {
    if (!wallet.isConnected || !positionId || amount <= 0n || withdrawingId || claimingId) return;

    try {
      setWithdrawingId(positionId);
      setTxMessage("");
      await wallet.ensureCorrectChain();
      const tx = await withdrawProfit(wallet.currentAddress, positionId, amount);
      setTxMessage(`提现成功，交易哈希：${tx.hash}`);
      await queryClient.invalidateQueries({ queryKey: ["nete", "mining", wallet.currentAddress] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "提现失败，请稍后重试";
      setTxMessage(message);
    } finally {
      setWithdrawingId("");
    }
  };

  return (
    <section className="mining-page">
      <header className="mining-view-tabs" role="tablist" aria-label="矿机页面视图">
        {MINING_VIEWS.map((tab) => (
          <button
            key={tab.key}
            className={activeView === tab.key ? "mining-view-tab is-active" : "mining-view-tab"}
            type="button"
            role="tab"
            aria-selected={activeView === tab.key}
            onClick={() => setActiveView(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </header>

      {txMessage ? <p className="mt-3 text-xs text-white/75 break-all">{txMessage}</p> : null}
      {wallet.isConnected ? null : <p className="mt-2 text-xs text-white/65">请先连接钱包后再进行矿机申购与收益领取。</p>}

      {activeView === "my-miners" ? (
        <div className="mining-view-panel">
          <div className="mining-hero mining-hero--portfolio">
            <div className="mining-hero__inner">
              <div className="mining-hero__main">
                <p className="mining-eyebrow">MY MINERS</p>
                <h1>我的矿机单独成页，先看持仓，再做操作</h1>
                <p>链上读取当前地址矿机仓位，按周期进度与收益状态展示，并支持直接领取收益。</p>
                <div className="mining-hero__actions">
                  <button type="button" className="mining-btn mining-btn--primary" onClick={() => setActiveView("buy-miners")}>去购买矿机</button>
                  <button type="button" className="mining-btn mining-btn--ghost" onClick={openAgreementModal}>查看规则说明</button>
                </div>
              </div>
              <aside className="mining-side-card">
                <p className="mining-eyebrow">ON-CHAIN</p>
                <h2>地址状态</h2>
                <div className="mining-side-grid">
                  <div><span>钱包地址</span><strong>{wallet.shortAddress}</strong></div>
                  <div><span>仓位数量</span><strong>{portfolioRows.length} 条</strong></div>
                  <div><span>空投状态</span><strong>{airdropMachineStatus.synthesized ? "已合成" : "未合成"}</strong></div>
                  <div><span>网络状态</span><strong>{wallet.isWrongChain ? "待切链" : "正常"}</strong></div>
                </div>
              </aside>
            </div>
          </div>

          <section className="mining-section">
            <div className="mining-section__head">
              <div>
                <h3>Portfolio Overview</h3>
                <p>顶部概览与下方持仓列表拆分展示，桌面和移动端都保持一致信息层级。</p>
              </div>
            </div>
            <div className="mining-summary-strip">
              {summaryCards.map((card) => (
                <article key={card.label} className="mining-summary-card">
                  <span>{card.label}</span>
                  <strong className={card.accent ? "is-accent" : ""}>{card.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="mining-section">
            <div className="mining-section__head">
              <div>
                <h3>已购买矿机</h3>
                <p>每条持仓记录展示进度、已产出、待领取和剩余周期。</p>
              </div>
            </div>
            <div className="mining-panel-card">
              <div className="mining-portfolio-list">
                {portfolioRows.length === 0 ? (
                  <article className="mining-portfolio-item">
                    <div className="mining-portfolio-item__top">
                      <div>
                        <div className="mining-portfolio-item__title"><h4>暂无持仓</h4></div>
                        <div className="mining-portfolio-item__meta"><span>连接钱包并购买矿机后会显示在这里</span></div>
                      </div>
                    </div>
                  </article>
                ) : (
                  portfolioRows.map((machine) => (
                    <article key={machine.positionId} className="mining-portfolio-item">
                      <div className="mining-portfolio-item__top">
                        <div>
                          <div className="mining-portfolio-item__title">
                            <h4>{machine.model}</h4>
                            <span className="mining-chip">{machine.recordId}</span>
                          </div>
                          <div className="mining-portfolio-item__meta">
                            <span>已产出 {machine.output}</span>
                            <span>待领取 {machine.pending}</span>
                            <span>可提利润 {machine.profit}</span>
                          </div>
                        </div>
                        <span className="mining-chip mining-chip--status">运行中</span>
                      </div>

                      <div className="mining-progress">
                        <div className="mining-progress__track">
                          <span className="mining-progress__fill" style={{ width: `${machine.progressPercent}%` }}></span>
                        </div>
                      </div>

                      <div className="mining-portfolio-grid">
                        <div className="mining-info-tile">
                          <span>周期进度</span>
                          <strong>{machine.cycleCurrent} / {machine.cycleTotal} 天</strong>
                        </div>
                        <div className="mining-info-tile">
                          <span>剩余周期</span>
                          <strong>{machine.remainingDays} 天</strong>
                        </div>
                        <div className="mining-info-tile">
                          <span>仓位 ID</span>
                          <strong className="is-accent">#{machine.positionId}</strong>
                        </div>
                        <div className="mining-info-tile mining-info-tile--action">
                          <button
                            className="mining-btn mining-btn--inline"
                            type="button"
                            disabled={claimingId === machine.positionId || !wallet.isConnected || Boolean(withdrawingId)}
                            onClick={() => handleClaim(machine.positionId)}
                          >
                            {claimingId === machine.positionId ? "领取中..." : "领取收益"}
                          </button>
                        </div>
                        <div className="mining-info-tile mining-info-tile--action">
                          <button
                            className="mining-btn mining-btn--inline"
                            type="button"
                            disabled={withdrawingId === machine.positionId || !wallet.isConnected || machine.profitWei <= 0n || Boolean(claimingId)}
                            onClick={() => handleWithdraw(machine.positionId, machine.profitWei)}
                          >
                            {withdrawingId === machine.positionId ? "提现中..." : "提现利润"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {activeView === "buy-miners" ? (
        <div className="mining-view-panel">
          <div className="mining-hero mining-hero--buy">
            <div className="mining-hero__inner">
              <div className="mining-hero__main">
                <p className="mining-eyebrow">BUY MINERS</p>
                <h1>购买页单独展示，保留决策需要的信息</h1>
                <p>链上实时读取 tierConfigs，展示价格、收益率、周期和手续费。</p>
              </div>

              <div className="mining-stats-strip">
                <article className="mining-stat-card"><span>矿机型号</span><strong>{planStats.modelCount} 款</strong></article>
                <article className="mining-stat-card"><span>最高收益率</span><strong className="is-accent">{planStats.maxRate}%</strong></article>
                <article className="mining-stat-card"><span>周期范围</span><strong>{planStats.cycleRange}</strong></article>
                <article className="mining-stat-card"><span>交互动作</span><strong>申购矿机</strong></article>
              </div>
            </div>
          </div>

          <section className="mining-section">
            <div className="mining-section__head">
              <div>
                <h3>购买矿机列表</h3>
                <p>桌面与移动端统一为列表式展示，保留周期和剩余可购，避免额外滚动条。</p>
              </div>
            </div>
            <div className="mining-panel-card">
              <div className="mining-plan-list">
                {machineModels.length === 0 ? (
                  <article className="mining-plan-item"><div><h4>暂无矿机配置</h4><p>请检查合约地址与链网络配置</p></div></article>
                ) : (
                  machineModels.map((model) => (
                    <article key={model.tierIndex} className="mining-plan-item">
                      <div>
                        <h4>{model.model}</h4>
                        <p>{model.price} NETE</p>
                      </div>

                      <div className="mining-plan-grid">
                        <div className="mining-info-tile"><span>总收益率</span><strong className="is-accent">{model.returnRate}</strong></div>
                        <div className="mining-info-tile"><span>单人限购</span><strong>{model.unitCount} 台</strong></div>
                        <div className="mining-info-tile"><span>周期</span><strong>{model.periodDays} 天</strong></div>
                        <div className="mining-info-tile"><span>提币手续费</span><strong>{model.withdrawFee}%</strong></div>
                      </div>

                      <div className="mining-plan-action">
                        <button
                          className="mining-btn mining-btn--primary"
                          type="button"
                          onClick={() => openPurchaseModal(model)}
                          disabled={!wallet.isConnected || repurchasePaused}
                        >
                          申购矿机
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {activeView === "rules" ? (
        <div className="mining-view-panel">
          <div className="mining-hero mining-hero--rules">
            <div className="mining-hero__inner">
              <div className="mining-hero__main">
                <p className="mining-eyebrow">RULES</p>
                <h1>矿机页按功能拆分，信息路径更干净</h1>
                <p>持仓、申购、规则分视图承载，进入当前视图时只看当前任务，降低阅读压力。</p>
                <div className="mining-hero__actions">
                  <button type="button" className="mining-btn mining-btn--primary" onClick={openAgreementModal}>查看完整协议</button>
                </div>
              </div>

              <div className="mining-stats-strip">
                <article className="mining-stat-card"><span>页面方式</span><strong>分视图</strong></article>
                <article className="mining-stat-card"><span>持仓模式</span><strong>逐条记录</strong></article>
                <article className="mining-stat-card"><span>购买列表</span><strong>链上配置</strong></article>
                <article className="mining-stat-card"><span>周期字段</span><strong>保留展示</strong></article>
              </div>
            </div>
          </div>

          <section className="mining-section">
            <div className="mining-section__head">
              <div>
                <h3>规则说明</h3>
                <p>保留给产品机制与执行说明，后续可继续扩展合约细则与风控策略。</p>
              </div>
            </div>

            <div className="mining-rules-grid">
              <article className="mining-rule-card">
                <span className="mining-rule-card__index">01</span>
                <h4>空投矿机状态</h4>
                <p>是否已合成：{airdropMachineStatus.synthesized ? "已合成" : "未合成"}</p>
                <p>永久矿机状态：{airdropMachineStatus.permanent ? "已转永久" : "未转永久"}</p>
                <p>有效期剩余：{airdropMachineStatus.validityLeftDays} 天</p>
                <p>已产出收益：{airdropMachineStatus.produced}</p>
                <p>买一赠一规则：{airdropMachineStatus.triggerGiftRule}</p>
              </article>

              <article className="mining-rule-card">
                <span className="mining-rule-card__index">02</span>
                <h4>产出与钱包规则</h4>
                <ul>
                  {miningWalletRules.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="mining-rule-card">
                <span className="mining-rule-card__index">03</span>
                <h4>减产与手续费分配</h4>
                <ul>
                  {reductionRules.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <ul>
                  {withdrawFeeDistributionRules.map((row) => (
                    <li key={row.item}>{row.item}：{row.ratio}（{row.use}）</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        </div>
      ) : null}

      {selectedModel ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-2 pb-2 pt-2 backdrop-blur-sm md:items-center md:bg-black/75 md:px-2 md:py-4" onClick={closePurchaseModal} role="presentation">
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
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xl leading-none text-white/70 transition hover:bg-white/10 hover:text-white" type="button" onClick={closePurchaseModal} aria-label="关闭">
                <Icon icon="solar:close-circle-outline" width="1em" height="1em" />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-white/90">矿机型号</label>
              <div className="relative mt-2">
                <button
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-white/20 bg-black/35 px-3 text-left text-sm font-semibold text-white transition hover:border-white/35"
                  type="button"
                  onClick={() => setModelPickerOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={modelPickerOpen}
                >
                  <span className="truncate">{selectedModel.model} - {selectedModel.price} NETE</span>
                  <span className={`ml-3 shrink-0 text-base text-white/70 transition-transform ${modelPickerOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    <Icon icon="solar:alt-arrow-down-outline" width="1em" height="1em" />
                  </span>
                </button>

                {modelPickerOpen ? (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-[#1a1a22] shadow-[0_16px_50px_rgba(0,0,0,0.55)]">
                    <div className="max-h-56 overflow-y-auto py-1.5" role="listbox" aria-label="矿机型号选择">
                      {machineModels.map((model) => {
                        const active = selectedModel.tierIndex === model.tierIndex;
                        return (
                          <button
                            key={model.tierIndex}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${active ? "bg-[#caff00]/12 text-[#dcff64]" : "text-white/90 hover:bg-white/5"}`}
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
                            <span className="truncate">{model.model} - {model.price} NETE</span>
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
              <div className="mt-1.5 inline-flex items-center rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white/85">链上规则</div>
              <p className="mt-1.5 font-display text-2xl font-black text-[#caff00]">{selectedModel.returnRate}</p>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-white/90" htmlFor="mining-purchase-input">申购数量</label>
              <div className="mt-2 flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4">
                <input
                  id="mining-purchase-input"
                  className="w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/45"
                  type="number"
                  min="1"
                  step="1"
                  value={purchaseAmount}
                  onChange={(event) => setPurchaseAmount(event.target.value)}
                  placeholder="最小 1"
                />
                <span className="shrink-0 text-sm font-semibold text-white/65">台</span>
              </div>
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

            <div className="mt-5 space-y-3">
              <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/75 sm:grid-cols-2 md:text-sm">
                <p>延长：{selectedModel.extendDays} 天</p>
                <p>最长周期：{selectedModel.maxPeriodDays} 天</p>
                <p>提币手续费：{selectedModel.withdrawFee}%</p>
                <p>单台周期：{selectedModel.periodDays} 天</p>
              </div>

              <label className="flex items-start gap-2 text-xs text-white/70 md:text-sm">
                <input className="mt-0.5 h-4 w-4 rounded border border-white/30 bg-transparent accent-[#caff00]" type="checkbox" checked={acceptedAgreement} onChange={(event) => setAcceptedAgreement(event.target.checked)} />
                <span>
                  我已阅读并同意
                  <button className="ml-1 font-semibold text-[#caff00] underline decoration-dotted underline-offset-4" type="button" onClick={openAgreementFromPurchase}>
                    NETE 矿机申购协议
                  </button>
                </span>
              </label>
            </div>

            <button
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#caff00] text-base font-semibold text-black transition enabled:hover:shadow-[0_0_30px_rgba(202,255,0,0.45)] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
              type="button"
              disabled={!canSubmitPurchase}
              onClick={handlePurchase}
            >
              {purchasing ? "提交中..." : "申购"}
            </button>
            {repurchasePaused ? <p className="mt-2 text-center text-xs text-white/65">系统当前暂停复投/申购，请稍后再试。</p> : null}
          </article>
        </div>
      ) : null}

      {agreementOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-2 pb-2 pt-2 backdrop-blur-sm md:items-center md:bg-black/75 md:px-2 md:py-4" onClick={closeAgreementModal} role="presentation">
          <article
            className="mobile-drawer-enter max-h-[70dvh] w-full max-w-[1200px] overflow-y-auto rounded-t-[20px] rounded-b-none border border-white/10 bg-[#141419] p-4 text-white shadow-[0_25px_80px_rgba(0,0,0,0.55)] md:max-h-[92vh] md:rounded-[24px] md:p-7"
            role="dialog"
            aria-modal="true"
            aria-label="NETE 矿机申购协议"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <h3 className="font-display text-lg font-bold tracking-tight text-white md:text-xl">NETE 矿机申购协议</h3>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-white/70 transition hover:bg-white/10 hover:text-white" type="button" onClick={closeAgreementModal} aria-label="关闭">
                <Icon icon="solar:close-circle-outline" width="1em" height="1em" />
              </button>
            </div>

            <div className="mt-5 space-y-6 text-xs leading-relaxed text-white/85 md:text-sm">
              <section className="space-y-4">
                <h4 className="text-2xl font-bold text-white md:text-2xl"><span className="text-[#caff00]">1.</span> 空投矿机状态说明</h4>
                <div className="space-y-1">
                  <p>是否已合成：{airdropMachineStatus.synthesized ? "已合成" : "未合成"}</p>
                  <p>永久矿机状态：{airdropMachineStatus.permanent ? "已转永久" : "未转永久"}</p>
                  <p>有效期剩余：{airdropMachineStatus.validityLeftDays} 天</p>
                  <p>已产出收益：{airdropMachineStatus.produced}</p>
                  <p>买一赠一规则：{airdropMachineStatus.triggerGiftRule}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl"><span className="text-[#caff00]">2.</span> 产出与钱包规则</h4>
                <div className="space-y-1">{miningWalletRules.map((item) => <p key={item}>{item}</p>)}</div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl"><span className="text-[#caff00]">3.</span> 减产机制（时间调节阀）</h4>
                <div className="space-y-1">{reductionRules.map((item) => <p key={item}>{item}</p>)}</div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white md:text-2xl"><span className="text-[#caff00]">4.</span> 提币手续费分配机制（100% 分配）</h4>
                <div className="space-y-1">
                  {withdrawFeeDistributionRules.map((row) => (
                    <p key={row.item}>{row.item}：{row.ratio}，{row.use}</p>
                  ))}
                </div>
              </section>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
