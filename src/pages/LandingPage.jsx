import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import GlobalHeader from "../components/common/GlobalHeader";
import FeaturesSection from "../components/landing/FeaturesSection";
import FooterSection from "../components/landing/FooterSection";
import HeroSection from "../components/landing/HeroSection";
import MarketsSection from "../components/landing/MarketsSection";

const modelMechanisms = [
  "初始总量 30 亿枚，恒定不增发。",
  "终极通缩目标：流通量压缩至 2100 万枚。",
  "每次链上提币与激活矿机触发销毁，形成强制通缩。",
  "提币手续费按矿机等级收取 20%-30%，每日链上自动分配。",
];

const roadmapItems = [
  "提币手续费分配：20% 销毁、30% 项目方、50% 社区分红。",
  "社区分红中 50% 按 V1-V9 平分，50% 按当日新增业绩加权。",
  "C2C 交易卖方手续费 10%（USDT），用于流动性支持与生态建设。",
  "V4 及以上可申请做市商账户，免手续费并赚取 5% 市场差价。",
];

const contractItems = [
  { name: "启动分配结构", detail: "种子轮 500 万（0.17%）+ 阶段空投 500 万（0.17%），其余由质押销毁挖矿释放" },
  { name: "POS 产出配比", detail: "约 29.9 亿（99.66%）通过 POS 质押销毁挖矿产生，确保产出与通缩协同" },
  { name: "安全与透明性", detail: "无中心资金池、合约自动执行、权限可放弃、交易与分配数据全链上可追溯" },
];

export default function LandingPage() {
  useEffect(() => {
    document.title = "NETE";

    const scrollTopBtn = document.getElementById("scroll-top-btn");
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");

    if (!scrollTopBtn || !toast || !toastMsg) {
      return undefined;
    }

    let toastTimer;

    const handleScroll = () => {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
    };

    const handleScrollTopClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollTopBtn.addEventListener("click", handleScrollTopClick);

    const showToast = (message, duration = 3000) => {
      clearTimeout(toastTimer);
      toastMsg.textContent = message;
      toast.classList.add("is-visible");
      toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
      }, duration);
    };

    const getStartedBtn = document.getElementById("get-started-btn");
    const launchBtn = document.getElementById("launch-btn");
    const ctaPrimaryBtn = document.getElementById("cta-primary-btn");

    const handleGetStarted = () => showToast("🚀 正在加载 NETE 核心模型…");
    const handleLaunch = () => showToast("✅ 正在进入 NETE 应用生态…");
    const handleCreateWallet = () => showToast("🛡 正在初始化你的链上参与账户…");

    getStartedBtn?.addEventListener("click", handleGetStarted);
    launchBtn?.addEventListener("click", handleLaunch);
    ctaPrimaryBtn?.addEventListener("click", handleCreateWallet);
    handleScroll();

    return () => {
      clearTimeout(toastTimer);

      window.removeEventListener("scroll", handleScroll);
      scrollTopBtn.removeEventListener("click", handleScrollTopClick);

      getStartedBtn?.removeEventListener("click", handleGetStarted);
      launchBtn?.removeEventListener("click", handleLaunch);
      ctaPrimaryBtn?.removeEventListener("click", handleCreateWallet);
    };
  }, []);

  return (
    <>
      <GlobalHeader />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        <div className="stats-bar" role="marquee" aria-label="Live market data" aria-live="off">
          <div className="stats-bar__track" aria-hidden="true">
            <div className="stats-bar__item">
              <span className="stats-bar__label">BTC</span>
              <span className="stats-bar__value">$67,234.50</span>
              <span className="stats-bar__change--up">▲ 3.24%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">ETH</span>
              <span className="stats-bar__value">$2,321.79</span>
              <span className="stats-bar__change--down">▼ 1.18%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">BNB</span>
              <span className="stats-bar__value">$416.32</span>
              <span className="stats-bar__change--up">▲ 5.67%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">SOL</span>
              <span className="stats-bar__value">$183.44</span>
              <span className="stats-bar__change--up">▲ 8.91%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">MATIC</span>
              <span className="stats-bar__value">$0.987</span>
              <span className="stats-bar__change--down">▼ 2.33%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">AVAX</span>
              <span className="stats-bar__value">$38.12</span>
              <span className="stats-bar__change--up">▲ 4.55%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">NFT Cap</span>
              <span className="stats-bar__value">$2.16B</span>
              <span className="stats-bar__change--up">▲ 2.91%</span>
            </div>
            <div className="stats-bar__dot"></div>

            <div className="stats-bar__item">
              <span className="stats-bar__label">BTC</span>
              <span className="stats-bar__value">$67,234.50</span>
              <span className="stats-bar__change--up">▲ 3.24%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">ETH</span>
              <span className="stats-bar__value">$2,321.79</span>
              <span className="stats-bar__change--down">▼ 1.18%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">BNB</span>
              <span className="stats-bar__value">$416.32</span>
              <span className="stats-bar__change--down">▼ 0.45%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">SOL</span>
              <span className="stats-bar__value">$183.44</span>
              <span className="stats-bar__change--up">▲ 8.91%</span>
            </div>
            <div className="stats-bar__dot"></div>
            <div className="stats-bar__item">
              <span className="stats-bar__label">NFT Cap</span>
              <span className="stats-bar__value">$2.16B</span>
              <span className="stats-bar__change--up">▲ 2.91%</span>
            </div>
          </div>
        </div>

        <FeaturesSection />

        <section className="section section--alt" aria-labelledby="project-heading">
          <div className="container">
            <div className="section__header">
              <span className="section__eyebrow" aria-hidden="true">
                // Project Overview
              </span>
              <h2 className="section__title" id="project-heading">
                NETE 项目介绍
              </h2>
              <p className="section__desc">
                NETE 定位为“透明、可持续、社区共治”的链上时间价值生态，通过规则可验证、过程可追踪、分配可审计的机制设计，
                系统性解决传统卷轴模型中“黑箱操作、不可持续、信任脆弱”的结构性问题。
              </p>
            </div>

            <div className="features-grid">
              <article className="feature-card feature-card--highlight" tabIndex={0}>
                <div className="feature-card__icon feature-card__icon--acid" role="img" aria-label="model mechanism">
                  <Icon className="feature-card__icon-svg" icon="mdi:cog-outline" />
                </div>
                <h3 className="feature-card__title">经济模型关键机制</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  {modelMechanisms.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="feature-card" tabIndex={0}>
                <div className="feature-card__icon feature-card__icon--purple" role="img" aria-label="roadmap">
                  <Icon className="feature-card__icon-svg" icon="mdi:compass-outline" />
                </div>
                <h3 className="feature-card__title">分配与流通规则</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  {roadmapItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {contractItems.map((item) => (
                <article key={item.name} className="feature-card" tabIndex={0}>
                  <h3 className="feature-card__title">{item.name}</h3>
                  <p className="text-sm text-white/80">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <MarketsSection />

        <section className="cta-section" aria-labelledby="cta-heading">
          <div className="cta-section__bg" aria-hidden="true"></div>
          <div className="container">
            <div className="cta-section__inner">
              <h2 className="cta-section__title" id="cta-heading">
                准备加入 NETE 链上经济生态？
              </h2>
              <p className="cta-section__subtitle">
                从矿机产出、社区治理到 C2C 流通，所有关键行为由合约自动执行并全链路可审计，
                为长期参与者提供可验证、可持续的价值增长路径。
              </p>
              <div className="cta-section__actions">
                <button className="btn btn--primary btn--lg" id="cta-primary-btn">
                  立即参与 NETE
                </button>
              </div>
              <div className="download-badges">
                <NavLink className="download-badge" to="/mining" aria-label="Open mining module">
                  <span className="download-badge__icon" aria-hidden="true">
                    <Icon className="download-badge__icon-svg" icon="mdi:pickaxe" />
                  </span>
                  <div className="download-badge__text">
                    <div className="download-badge__sub">立即进入</div>
                    <div className="download-badge__name">矿机模块</div>
                  </div>
                </NavLink>
                <NavLink className="download-badge" to="/c2c" aria-label="Open c2c market module">
                  <span className="download-badge__icon" aria-hidden="true">
                    <Icon className="download-badge__icon-svg" icon="mdi:swap-horizontal" />
                  </span>
                  <div className="download-badge__text">
                    <div className="download-badge__sub">快速前往</div>
                    <div className="download-badge__name">C2C 市场</div>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />

      <button className="scroll-top" id="scroll-top-btn" aria-label="Scroll back to top">
        <Icon className="scroll-top__icon" icon="mdi:arrow-up" aria-hidden="true" />
      </button>

      <div className="toast" id="toast" role="status" aria-live="polite" aria-atomic="true">
        <span className="toast__dot" aria-hidden="true"></span>
        <span id="toast-msg">NETE 操作已成功提交</span>
      </div>
    </>
  );
}
