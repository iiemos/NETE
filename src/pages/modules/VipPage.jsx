import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoadingState from "../../components/common/LoadingState";
import { leadershipLevels } from "../../data/mockData";
import { useWalletConnector } from "../../hooks/useWalletConnector";
import { getIncomeOverview, getReferralInfo } from "../../services/neteApi";
import { readNetworkUserData } from "../../services/neteContracts";
import { formatTokenAmount } from "../../utils/formatters";

const vipBenefits = [
  { icon: "solar:headphones-round-outline" },
  { icon: "solar:users-group-two-rounded-outline" },
  { icon: "solar:gift-outline" },
  { icon: "solar:document-text-outline" },
  { icon: "solar:balloon-outline" },
  { icon: "solar:shield-check-outline" },
];

export default function VipPage() {
  const { t } = useTranslation();
  const wallet = useWalletConnector();
  const upgradeNotes = t("modules.vip.upgradeNotes", { returnObjects: true });
  const glossary = t("modules.vip.glossary", { returnObjects: true });
  const benefits = t("modules.vip.benefits", { returnObjects: true });
  const levelRequirements = t("modules.vip.levelRequirements", { returnObjects: true });
  const levelBonusRatios = t("modules.vip.levelBonusRatios", { returnObjects: true });

  const incomeOverviewQuery = useQuery({
    queryKey: ["nete", "income-overview", wallet.currentAddress],
    queryFn: () => getIncomeOverview(wallet.currentAddress),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 15_000,
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

  const currentLevel = incomeOverviewQuery.data?.user_level ?? networkDataQuery.data?.userLevel ?? 0;
  const zonePerformance = formatTokenAmount(referralInfoQuery.data?.small_leg_perf ?? 0n, 18, 2);
  const vipLoading = incomeOverviewQuery.isLoading || referralInfoQuery.isLoading || networkDataQuery.isLoading;

  return (
    <section className="module-page space-y-10">
      <header className="module-hero">
        <p className="module-eyebrow">NETE VIP</p>
        <h1 className="mt-3 font-display text-xl font-black tracking-tight text-white md:text-2xl">{t("modules.vip.title")}</h1>

        {!wallet.isConnected ? <p className="mt-4 text-xs text-white/65">{t("modules.vip.connectHint")}</p> : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <span className="text-sm text-white/60">{t("modules.vip.currentLevel")}</span>
            <strong className="mt-2 block font-display text-xl font-bold text-white md:text-2xl">
              {vipLoading ? <LoadingState compact /> : `V${currentLevel}`}
            </strong>
          </div>
          <div>
            <span className="text-sm text-white/60">{t("modules.vip.zonePerformance")}</span>
            <strong className="mt-2 block font-display text-xl font-bold text-white md:text-2xl">
              {vipLoading ? <LoadingState compact /> : `${zonePerformance} NETE`}
            </strong>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="module-stat-card p-3">
            <span className="text-xs text-white/55">{t("modules.vip.pendingDividend")}</span>
            <p className="mt-1 text-sm font-semibold text-[#00ffc2]">
              {vipLoading ? <LoadingState compact /> : `${formatTokenAmount(incomeOverviewQuery.data?.pending_dividend ?? 0n, 18, 4)} NETE`}
            </p>
          </div>
          <div className="module-stat-card p-3">
            <span className="text-xs text-white/55">{t("modules.vip.totalDividend")}</span>
            <p className="mt-1 text-sm font-semibold text-[#00ffc2]">
              {vipLoading ? <LoadingState compact /> : `${formatTokenAmount(incomeOverviewQuery.data?.dividend_income_total ?? 0n, 18, 4)} NETE`}
            </p>
          </div>
          <div className="module-stat-card p-3">
            <span className="text-xs text-white/55">{t("modules.vip.totalV9")}</span>
            <p className="mt-1 text-sm font-semibold text-[#00ffc2]">
              {vipLoading ? <LoadingState compact /> : `${formatTokenAmount(incomeOverviewQuery.data?.v9_income_total ?? 0n, 18, 4)} NETE`}
            </p>
          </div>
        </div>
      </header>

      <section className="vip-level-section">
        <h2 className="vip-level-title">{t("modules.vip.levelIntro")}</h2>
        <div className="vip-level-panel">
          <div className="vip-level-list">
            {leadershipLevels.map((row, index) => (
              <article className="vip-level-card" key={row.level}>
                <div className="vip-level-card-main">
                  <h3>{row.level}</h3>
                  <p>{levelRequirements[index] || row.requirement}</p>
                </div>
                <span className="vip-level-badge">{t("modules.vip.category")}</span>

                <div className="vip-level-grid">
                  <div className="vip-level-tile">
                    <span>{t("modules.vip.requirement")}</span>
                    <strong>{levelRequirements[index] || row.requirement}</strong>
                  </div>
                  <div className="vip-level-tile">
                    <span>{t("modules.vip.bonusRatio")}</span>
                    <strong className="is-accent">{levelBonusRatios[index] || row.bonusRatio}</strong>
                  </div>
                  <div className="vip-level-tile">
                    <span>{t("modules.vip.fixedReward")}</span>
                    <strong>{row.fixedReward.toLocaleString()}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-16 md:space-y-20">
        <article>
          <h3 className="mb-8 font-display text-xl font-bold text-white md:text-2xl">{t("modules.vip.upgradeTitle")}</h3>
          <ul className="list-disc space-y-3 pl-6 text-sm leading-relaxed text-white/65 marker:text-white/65">
            {upgradeNotes.map((item, index) => (
              <li key={item}>
                {item}
                {index === upgradeNotes.length - 1 ? <span className="ml-2 text-[#caff00] underline decoration-dotted underline-offset-4">{t("modules.vip.submit")}</span> : null}
              </li>
            ))}
          </ul>
        </article>

        <article>
          <h3 className="mb-8 font-display text-xl font-bold text-white md:text-2xl">{t("modules.vip.glossaryTitle")}</h3>
          <ul className="list-disc space-y-3 pl-6 text-sm leading-relaxed text-white/65 marker:text-white/65">
            {glossary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3 className="mb-8 font-display text-xl font-bold text-white md:text-2xl">{t("modules.vip.benefitsTitle")}</h3>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {vipBenefits.map((item, index) => (
              <article
                key={item.icon}
                className="module-stat-card flex min-h-[70px] items-center gap-4 px-5 py-3 text-sm text-white md:min-h-[70px] md:gap-4 md:px-6 md:py-3 md:text-sm"
              >
                <span className="shrink-0 text-[1.4rem] text-white/95 md:text-[1.4rem]" aria-hidden="true">
                  <Icon icon={item.icon} width="1em" height="1em" />
                </span>
                <p className="font-medium tracking-wide text-white/92">{benefits[index]}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
