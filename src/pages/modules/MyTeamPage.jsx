import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { shareAccelerationNote, shareAccelerationRules, teamMembers } from "../../data/mockData";
import { useWalletConnector } from "../../hooks/useWalletConnector";
import { getReferralInfo } from "../../services/neteApi";
import { bindReferrer, readNetworkUserData } from "../../services/neteContracts";
import { formatTokenAmount, isValidAddress, shortAddress } from "../../utils/formatters";

export default function MyTeamPage() {
  const wallet = useWalletConnector();
  const queryClient = useQueryClient();

  const [referrerInput, setReferrerInput] = useState("");
  const [binding, setBinding] = useState(false);
  const [notice, setNotice] = useState("");

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

  const referralInfo = referralInfoQuery.data || {};

  const directCount = Number(referralInfo.direct_count ?? 0);
  const totalPerformance = formatTokenAmount(referralInfo.subtree_perf ?? 0n, 18, 2);
  const ownPerformance = formatTokenAmount(referralInfo.own_perf ?? 0n, 18, 2);
  const smallLegPerformance = formatTokenAmount(referralInfo.small_leg_perf ?? 0n, 18, 2);
  const maxDepth = Number(referralInfo.max_depth ?? 0);

  const currentLayers = useMemo(() => {
    if (!directCount) return "0 层";
    return directCount >= 8 ? "8-20 层" : `${Math.min(directCount, maxDepth || directCount)} 层`;
  }, [directCount, maxDepth]);

  const bindDisabled = !wallet.isConnected || binding || Boolean(referralInfo.referrer);

  const handleBindReferrer = async () => {
    const referrer = referrerInput.trim();

    if (!wallet.isConnected) {
      setNotice("请先连接钱包");
      return;
    }
    if (!isValidAddress(referrer)) {
      setNotice("推荐人地址格式不正确");
      return;
    }
    if (referrer.toLowerCase() === String(wallet.currentAddress || "").toLowerCase()) {
      setNotice("推荐人地址不能与当前钱包地址相同");
      return;
    }

    try {
      setBinding(true);
      setNotice("");
      await wallet.ensureCorrectChain();
      const tx = await bindReferrer(wallet.currentAddress, referrer);
      setNotice(`绑定成功，交易哈希：${tx.hash}`);
      setReferrerInput("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["nete", "referral-info", wallet.currentAddress] }),
        queryClient.invalidateQueries({ queryKey: ["nete", "network-data", wallet.currentAddress] }),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "绑定失败，请稍后重试";
      setNotice(message);
    } finally {
      setBinding(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-[28px] bg-transparent">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl font-black tracking-tight text-white md:text-3xl">团队模块</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">展示团队结构、分享加速机制与推荐关系数据，激励分配遵循链上规则执行。</p>
          </div>
        </div>
      </header>

      {!wallet.isConnected ? <p className="text-xs text-white/70">当前未连接钱包，连接后可查看推荐关系和团队业绩。</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">当前直推成员数</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{directCount}</div>
        </article>
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">团队累计业绩（NETE）</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{totalPerformance}</div>
        </article>
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">当前享受层数</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">{currentLayers}</div>
        </article>
        <article className="rounded-xl border border-white/10 bg-transparent p-4">
          <div className="text-xs uppercase tracking-[0.12em] text-white/55">当前链上等级</div>
          <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">V{networkDataQuery.data?.userLevel ?? 0}</div>
        </article>
      </div>

      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">推荐关系</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-transparent p-4 text-sm text-white/85">
            <p>当前推荐人：{referralInfo.referrer ? shortAddress(referralInfo.referrer) : "未绑定"}</p>
            <p className="mt-2">个人业绩：{ownPerformance} NETE</p>
            <p className="mt-2">小区业绩：{smallLegPerformance} NETE</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-transparent p-4">
            <p className="text-sm text-white/75">绑定推荐人（仅一次）</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                className="h-11 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/40"
                placeholder="输入推荐人地址 0x..."
                value={referrerInput}
                onChange={(event) => setReferrerInput(event.target.value)}
                disabled={Boolean(referralInfo.referrer)}
              />
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition enabled:hover:shadow-[0_0_30px_rgba(202,255,0,0.45)] disabled:cursor-not-allowed disabled:opacity-45"
                type="button"
                onClick={handleBindReferrer}
                disabled={bindDisabled}
              >
                {binding ? "提交中..." : referralInfo.referrer ? "已绑定" : "绑定"}
              </button>
            </div>
            {notice ? <p className="mt-2 break-all text-xs text-white/70">{notice}</p> : null}
          </div>
        </div>
      </article>

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
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">直推列表（示例）</h2>
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
                    <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5" type="button">
                      查看下级
                    </button>
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
