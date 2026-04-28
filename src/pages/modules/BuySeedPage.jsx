import { bootstrapDistribution, globalOverview, seedModelPlan, seedPurchaseRecords } from "../../data/mockData";

export default function BuySeedPage() {
  const currentSeedPrice = 0.5;

  return (
    <section className="space-y-6">
      <header className="rounded-[28px] bg-transparent">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-2xl font-black tracking-tight text-white md:text-3xl">购买种子 NETE</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">种子轮发行价 0.5 USDT/NETE，发行期 60 天，总量 500 万枚；未售完部分在发行期结束后打入黑洞地址。</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-transparent p-5 xl:col-span-2">
          <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">购买输入</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/75">
              当前 NETE 价格（USDT）
              <input className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#caff00]/60" value={currentSeedPrice} disabled />
            </label>
            <label className="space-y-2 text-sm text-white/75">
              购买数量（NETE）
              <input className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#caff00]/60" type="number" placeholder="例如 3000" />
            </label>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/75">
              链上 USDT 余额
              <input className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#caff00]/60" value={globalOverview.wallet.usdtBalance} disabled />
            </label>
            <label className="space-y-2 text-sm text-white/75">
              预计扣除 USDT
              <input className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#caff00]/60" placeholder="自动计算：购买数量 × 价格" disabled />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition hover:shadow-[0_0_30px_rgba(202,255,0,0.45)]">确认购买</button>
            <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5">清空</button>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-transparent p-5 space-y-4">
          <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">发行规则</h2>
          <div className="rounded-xl border border-white/10 bg-transparent p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-white/55">发行总量</div>
            <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">5,000,000 NETE</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-transparent p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-white/55">发行价格</div>
            <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">0.5 USDT/NETE</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-transparent p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-white/55">发行期</div>
            <div className="mt-2 font-display text-base font-bold text-[#caff00] md:text-lg">60 天</div>
          </div>
        </article>
      </div>



      <article className="rounded-2xl border border-white/10 bg-transparent p-5">
        <h2 className="font-display text-base font-bold tracking-wide text-white md:text-xl">购买记录</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full border-collapse text-left text-xs md:text-sm [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-white/65 [&_td]:border-t [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-white/85">
            <thead>
              <tr>
                <th>时间</th>
                <th>购买数量（NETE）</th>
                <th>支付 USDT</th>
                <th>交易状态</th>
              </tr>
            </thead>
            <tbody>
              {seedPurchaseRecords.map((record) => (
                <tr key={`${record.time}-${record.amount}`}>
                  <td>{record.time}</td>
                  <td>{record.amount}</td>
                  <td>{record.paidUsdt}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
