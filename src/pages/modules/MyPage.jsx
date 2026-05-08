import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useWalletConnector } from "../../hooks/useWalletConnector";
import { getClaimMessage, getIncomeLedger, getIncomeOverview, getReferralInfo } from "../../services/neteApi";
import { claimWithSignature, readNetworkUserData, readTokenMetrics, readUserBalances } from "../../services/neteContracts";
import { formatTokenAmount, formatUnixTime, shortAddress } from "../../utils/formatters";

function toItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

function toBigIntSafe(value) {
  if (typeof value === "bigint") return value;
  if (value === null || value === undefined || value === "") return 0n;
  try {
    return BigInt(String(value));
  } catch {
    return 0n;
  }
}

function normalizeLedgerRow(row, index) {
  const amountRaw = row?.amount ?? row?.delta ?? row?.value ?? "0";
  const amountBigInt = toBigIntSafe(amountRaw);
  const signedText = amountBigInt < 0n ? "-" : "+";
  const amountText = `${signedText}${formatTokenAmount(amountBigInt < 0n ? -amountBigInt : amountBigInt, 18, 6)}`;

  return {
    id: `${row?.id ?? row?.tx_hash ?? row?.txHash ?? "row"}-${index}`,
    createdAt: Number(row?.created_at ?? row?.createdAt ?? row?.timestamp ?? 0),
    type: String(row?.type ?? row?.biz_type ?? row?.category ?? "--"),
    amountText,
    balanceText: formatTokenAmount(row?.balance ?? row?.remain ?? 0n, 18, 6),
    txHash: String(row?.tx_hash ?? row?.txHash ?? row?.tx ?? "--"),
  };
}

const claimActions = [
  { key: "referral", label: "领取推荐奖励" },
  { key: "dividend", label: "领取分红奖励" },
  { key: "v9", label: "领取 V9 奖励" },
];

export default function MyPage() {
  const wallet = useWalletConnector();
  const queryClient = useQueryClient();
  const [claimingType, setClaimingType] = useState("");
  const [notice, setNotice] = useState("");
  const [lastClaimInfo, setLastClaimInfo] = useState(null);

  const incomeOverviewQuery = useQuery({
    queryKey: ["nete", "income-overview", wallet.currentAddress],
    queryFn: () => getIncomeOverview(wallet.currentAddress),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 10_000,
    retry: 1,
  });

  const incomeLedgerQuery = useQuery({
    queryKey: ["nete", "income-ledger", wallet.currentAddress],
    queryFn: () => getIncomeLedger(wallet.currentAddress, { page: 1, pageSize: 30 }),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 10_000,
    retry: 1,
  });

  const referralInfoQuery = useQuery({
    queryKey: ["nete", "referral-info", wallet.currentAddress],
    queryFn: () => getReferralInfo(wallet.currentAddress),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 15_000,
    retry: 1,
  });

  const networkDataQuery = useQuery({
    queryKey: ["nete", "network-data", wallet.currentAddress],
    queryFn: () => readNetworkUserData(wallet.currentAddress),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 15_000,
    retry: 1,
  });

  const balancesQuery = useQuery({
    queryKey: ["nete", "balances", wallet.currentAddress],
    queryFn: () => readUserBalances(wallet.currentAddress),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 10_000,
    retry: 1,
  });

  const tokenMetricsQuery = useQuery({
    queryKey: ["nete", "token-metrics"],
    queryFn: readTokenMetrics,
    staleTime: 20_000,
    retry: 1,
  });

  const ledgerRows = useMemo(
    () => toItems(incomeLedgerQuery.data).map(normalizeLedgerRow),
    [incomeLedgerQuery.data],
  );

  const summaryItems = useMemo(() => {
    const overview = incomeOverviewQuery.data || {};
    const referral = referralInfoQuery.data || {};
    const balances = balancesQuery.data || {};
    const tokenMetrics = tokenMetricsQuery.data || {};
    const network = networkDataQuery.data || {};

    return [
      { label: "钱包地址", value: wallet.isConnected ? shortAddress(wallet.currentAddress) : "未连接" },
      { label: "会员等级", value: `V${overview.user_level ?? network.userLevel ?? 0}` },
      { label: "NETE 余额", value: `${formatTokenAmount(balances.neteBalance ?? 0n, 18, 4)} NETE` },
      { label: "USDT 余额", value: `${formatTokenAmount(balances.usdtBalance ?? 0n, 18, 4)} USDT` },
      { label: "推荐待领取", value: `${formatTokenAmount(overview.pending_referral ?? 0n, 18, 4)} NETE` },
      { label: "分红待领取", value: `${formatTokenAmount(overview.pending_dividend ?? 0n, 18, 4)} NETE` },
      { label: "V9 待领取", value: `${formatTokenAmount(overview.pending_v9 ?? 0n, 18, 4)} NETE` },
      { label: "直推人数", value: `${referral.direct_count ?? 0}` },
      { label: "团队业绩", value: `${formatTokenAmount(referral.subtree_perf ?? 0n, 18, 2)} NETE` },
      { label: "当前流通总量", value: `${formatTokenAmount(tokenMetrics.circulatingSupply ?? 0n, tokenMetrics.decimals ?? 18, 2)} NETE` },
    ];
  }, [balancesQuery.data, incomeOverviewQuery.data, networkDataQuery.data, referralInfoQuery.data, tokenMetricsQuery.data, wallet.currentAddress, wallet.isConnected]);

  const loading = incomeOverviewQuery.isLoading || referralInfoQuery.isLoading || balancesQuery.isLoading;

  const handleClaim = async (type) => {
    if (!wallet.isConnected) {
      setNotice("请先连接钱包");
      return;
    }

    try {
      setClaimingType(type);
      setNotice("");
      await wallet.ensureCorrectChain();

      const claimMessage = await getClaimMessage(type, { user: wallet.currentAddress });
      const tx = await claimWithSignature(wallet.currentAddress, claimMessage);
      setLastClaimInfo({
        type,
        amount: claimMessage.amount,
        deadline: Number(claimMessage.deadline || 0),
      });
      setNotice(`领取提交成功，交易哈希：${tx.hash}`);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["nete", "income-overview", wallet.currentAddress] }),
        queryClient.invalidateQueries({ queryKey: ["nete", "income-ledger", wallet.currentAddress] }),
        queryClient.invalidateQueries({ queryKey: ["nete", "network-data", wallet.currentAddress] }),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "签名领取失败，请稍后重试";
      if (message.includes("claim signature disabled")) {
        setNotice("当前环境未开启签名领取");
      } else {
        setNotice(message);
      }
    } finally {
      setClaimingType("");
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-[28px] bg-transparent">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl font-black tracking-tight text-white md:text-3xl">我的</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">汇总链上资产、收益与推荐信息，并支持推荐/分红/V9 签名领取。</p>
          </div>
        </div>
      </header>

      {!wallet.isConnected ? <p className="text-xs text-white/70">当前未连接钱包，连接后可查看完整资产与收益信息。</p> : null}

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="mb-4 font-display text-base font-bold tracking-wide text-white md:text-xl">全局资产概览</h2>
        {loading ? (
          <div className="rounded-xl border border-white/10 px-4 py-8 text-center text-sm text-white/65">数据加载中...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => (
              <article key={item.label} className="rounded-xl border border-white/10 bg-transparent p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-white/55">{item.label}</div>
                <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{item.value}</div>
              </article>
            ))}
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">签名领取</h2>
        <p className="mt-2 text-xs text-white/65">流程：服务端生成 claim-message，前端发起链上 claimWithSignature。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {claimActions.map((action) => (
            <button
              key={action.key}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition enabled:hover:shadow-[0_0_30px_rgba(202,255,0,0.45)] disabled:cursor-not-allowed disabled:opacity-45"
              type="button"
              disabled={claimingType === action.key || Boolean(claimingType) || !wallet.isConnected}
              onClick={() => handleClaim(action.key)}
            >
              {claimingType === action.key ? "处理中..." : action.label}
            </button>
          ))}
        </div>
        {lastClaimInfo ? (
          <p className="mt-3 text-xs text-white/70">
            最近一次签名：{lastClaimInfo.type} · 金额 {formatTokenAmount(lastClaimInfo.amount ?? 0n, 18, 4)} NETE · 截止时间 {formatUnixTime(lastClaimInfo.deadline)}
          </p>
        ) : null}
        {notice ? <p className="mt-3 break-all text-xs text-white/75">{notice}</p> : null}
      </article>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">收益流水</h2>
          <span className="text-xs text-white/50">最近 {ledgerRows.length} 条</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full border-collapse text-left text-xs md:text-sm [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-white/65 [&_td]:border-t [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-white/85">
            <thead>
              <tr>
                <th>时间</th>
                <th>类型</th>
                <th>数量（NETE）</th>
                <th>余额（NETE）</th>
                <th>交易 Hash</th>
              </tr>
            </thead>
            <tbody>
              {incomeLedgerQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center text-white/65">加载中...</td>
                </tr>
              ) : ledgerRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-white/65">暂无收益流水</td>
                </tr>
              ) : (
                ledgerRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.createdAt ? formatUnixTime(row.createdAt) : "--"}</td>
                    <td>{row.type}</td>
                    <td className={row.amountText.startsWith("-") ? "text-rose-300" : "text-emerald-300"}>{row.amountText}</td>
                    <td>{row.balanceText}</td>
                    <td className="font-mono text-xs text-[#caff00]">{row.txHash}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">快捷入口</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/account/team" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition hover:shadow-[0_0_30px_rgba(202,255,0,0.45)]">
            进入团队
          </Link>
          <Link to="/finance/buy-seed" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5">
            购买种子 NETE
          </Link>
          <Link to="/mining" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5">
            查看矿机
          </Link>
        </div>
      </article>
    </section>
  );
}
