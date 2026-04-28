import { Icon } from "@iconify/react";
import { globalOverview, leadershipLevels, leadershipRuleNotes } from "../../data/mockData";
import vipImage from "../../assets/images/vip.png";

const vipGlossary = [
  "小区业绩：用于判定 VIP 等级的核心业绩口径，链上实时可核验。",
  "分红比例：按等级对应的社区分红权重，系统每日自动结算。",
  "固定奖励：达到等级后按累计口径释放的 NETE 奖励。",
];

const vipBenefits = [
  { icon: "solar:headphones-round-outline", title: "专属客服服务" },
  { icon: "solar:users-group-two-rounded-outline", title: "线下活动邀请" },
  { icon: "solar:gift-outline", title: "定制节日礼物" },
  { icon: "solar:document-text-outline", title: "行业报告优享" },
  { icon: "solar:balloon-outline", title: "月度空投福利" },
  { icon: "solar:shield-check-outline", title: "VIP 专属活动激励" },
];

export default function VipPage() {
  return (
    <section className="space-y-10">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] lg:items-center">
        <div className="max-w-3xl">
          <p className="font-display text-base font-bold uppercase tracking-[0.12em] text-[#caff00] md:text-lg">NETE VIP</p>
          <h1 className="mt-3 font-display text-xl font-black tracking-tight text-white md:text-2xl">解锁专属权益</h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <span className="text-sm text-white/60">当前等级</span>
              <strong className="mt-2 block font-display text-xl font-bold text-white md:text-2xl">{globalOverview.memberLevel}</strong>
            </div>
            <div>
              <span className="text-sm text-white/60">当前小区业绩</span>
              <strong className="mt-2 block font-display text-xl font-bold text-white md:text-2xl">{globalOverview.zonePerformance} NETE</strong>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition hover:shadow-[0_0_30px_rgba(202,255,0,0.45)]" type="button">
              成为 VIP
            </button>
            <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/5" type="button">
              申请 VIP 体验
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[520px] lg:mx-0" aria-hidden="true">
          <img className="max-h-[220px] w-full object-contain" src={vipImage} alt="" />
        </div>
      </header>

      <section>
        <h2 className="mb-6 mt-20 text-center font-display text-xl font-black tracking-tight text-[#caff00] md:text-2xl">VIP 等级及费率介绍</h2>
        <div className="rounded-2xl border border-white/10 bg-transparent">
          <div className="flex flex-wrap gap-6 border-b border-white/10 px-5 py-5 text-white/55 md:px-10" role="tablist" aria-label="VIP 费率分类">
            <button
              className="relative pb-2 text-sm font-semibold text-white transition after:absolute after:-bottom-[21px] after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-white after:content-[''] md:text-sm"
              role="tab"
              type="button"
              aria-selected="true"
            >
              等级权益
            </button>
          </div>

          <div className="hidden overflow-x-auto p-5 md:block md:p-10">
            <ul className="min-w-[980px] overflow-hidden rounded-2xl border border-white/10">
              <li className="grid grid-cols-[170px_1fr_190px_220px_120px] bg-white/5 px-6 py-4 text-sm font-semibold text-white/80">
                <span>VIP 等级</span>
                <span>小区业绩要求</span>
                <span>分红比例</span>
                <span>固定奖励（NETE）</span>
                <span>操作</span>
              </li>
              {leadershipLevels.map((row) => (
                <li key={row.level} className="grid grid-cols-[170px_1fr_190px_220px_120px] border-t border-white/10 px-6 py-4 text-sm text-white/85">
                  <span>
                    <span className="inline-flex min-w-[62px] items-center justify-center rounded-full border border-[#caff00]/45 bg-[#caff00]/10 px-3 py-1 text-sm font-semibold text-[#caff00]">
                      {row.level}
                    </span>
                  </span>
                  <span>{row.requirement}</span>
                  <span className="font-semibold text-[#00ffc2]">{row.bonusRatio}</span>
                  <span>{row.fixedReward.toLocaleString()}</span>
                  <span>
                    <button className="inline-flex min-h-10 min-w-[92px] items-center justify-center rounded-full bg-[#caff00] px-4 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(202,255,0,0.45)]" type="button">
                      查看
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="space-y-2 p-4 md:hidden">
            {leadershipLevels.map((row) => (
              <li key={`mobile-${row.level}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex min-w-[56px] items-center justify-center rounded-full border border-[#caff00]/45 bg-[#caff00]/10 px-3 py-1 text-xs font-semibold text-[#caff00]">
                    {row.level}
                  </span>
                  <button className="inline-flex min-h-8 min-w-[74px] items-center justify-center rounded-full bg-[#caff00] px-3 text-xs font-semibold text-black" type="button">
                    查看
                  </button>
                </div>
                <div className="mt-3 space-y-1.5 text-[11px] text-white/75">
                  <p>
                    <span className="text-white/55">小区业绩：</span>
                    {row.requirement}
                  </p>
                  <p>
                    <span className="text-white/55">分红比例：</span>
                    <span className="font-semibold text-[#00ffc2]">{row.bonusRatio}</span>
                  </p>
                  <p>
                    <span className="text-white/55">固定奖励：</span>
                    {row.fixedReward.toLocaleString()} NETE
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-16 md:space-y-20">
        <article>
          <h3 className="mb-8 font-display text-xl font-bold text-white md:text-2xl">升级说明</h3>
          <ul className="list-disc space-y-3 pl-6 text-sm leading-relaxed text-white/65 marker:text-white/65">
            <li>在满足等级要求后，系统根据链上数据自动判定并升级。</li>
            <li>分红比例说明：{leadershipRuleNotes.bonus}</li>
            <li>固定奖励说明：{leadershipRuleNotes.fixedReward}</li>
            <li>
              等级权益围绕分红比例、固定奖励与治理能力持续提升。
              <span className="ml-2 text-[#caff00] underline decoration-dotted underline-offset-4">提交申请</span>
            </li>
          </ul>
        </article>

        <article>
          <h3 className="mb-8 font-display text-xl font-bold text-white md:text-2xl">名词解释</h3>
          <ul className="list-disc space-y-3 pl-6 text-sm leading-relaxed text-white/65 marker:text-white/65">
            {vipGlossary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3 className="mb-8 font-display text-xl font-bold text-white md:text-2xl">VIP 其它福利</h3>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vipBenefits.map((item) => (
            <article
              key={item.title}
              className="flex min-h-[70px] items-center gap-4 rounded-[22px] bg-[#14141b] px-5 py-3 text-sm text-white md:min-h-[70px] md:gap-4 md:px-6 md:py-3 md:text-sm"
            >
              <span className="shrink-0 text-[1.4rem] text-white/95 md:text-[1.4rem]" aria-hidden="true">
                <Icon icon={item.icon} width="1em" height="1em" />
              </span>
              <p className="font-medium tracking-wide text-white/92">{item.title}</p>
            </article>
          ))}
          </div>
        </article>
      </section>
    </section>
  );
}
