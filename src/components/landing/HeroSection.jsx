import { Icon } from "@iconify/react";
import logoIcon from "../../assets/images/logo-icon.svg";

export default function HeroSection() {
  return (
  <section className="hero stacking-root" id="hero" aria-labelledby="hero-title">
    <div className="hero__bg" aria-hidden="true"></div>
    <div className="hero__grid" aria-hidden="true"></div>
    <div className="glow-orb glow-orb--purple glow-orb--hero-purple" aria-hidden="true"></div>
    <div className="glow-orb glow-orb--acid glow-orb--hero-acid" aria-hidden="true"></div>

    <div className="container">

      <div className="hero__inner">

        <div className="hero__content">
          <div className="hero__badge" aria-label="Now live">
            <span className="hero__badge-dot" aria-hidden="true"></span>
            Onchain Live · Community Governed
          </div>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-line--acid">透明通缩。</span><br />
            <span>社区共治的</span><br />
            <span className="hero__title-line--muted">链上时间价值引擎。</span>
          </h1>

          <p className="hero__subtitle">
            NETE 以智能合约驱动“质押销毁挖矿 + 多级社区激励 + 三重通缩机制”，
            构建透明、可持续、可审计的链上经济模型。发行总量恒定 30 亿枚，终极通缩目标为 2100 万枚。
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" id="get-started-btn">
              查看核心模型
              <Icon className="hero__action-icon" icon="mdi:arrow-right" aria-hidden="true" />
            </button>
            <button className="btn btn--ghost btn--lg">
              了解机制细节
            </button>
          </div>
        </div>


        <div className="hero__phones float-anim" aria-hidden="true">


          <div className="phone phone--left">
            <div className="phone__screen">
              <div className="phone__notch"></div>
              <div className="phone-screen phone-screen--onboard">
                <div className="phone-screen__logo">
                  <div className="phone-screen__logo-mark">
                    <img className="phone-screen__logo-icon" src={logoIcon} alt="" />
                  </div>
                  NETE
                </div>
                <div className="phone-illus phone-illus--modules">
                  <div className="phone-illus__module">
                    <Icon className="phone-illus__module-icon" icon="solar:cpu-bolt-outline" />
                    矿机
                  </div>
                  <div className="phone-illus__module">
                    <Icon className="phone-illus__module-icon" icon="mdi:swap-horizontal" />
                    C2C
                  </div>
                  <div className="phone-illus__module">
                    <Icon className="phone-illus__module-icon" icon="mdi:star-four-points-outline" />
                    VIP
                  </div>
                  <div className="phone-illus__module">
                    <Icon className="phone-illus__module-icon" icon="mdi:account-group-outline" />
                    团队
                  </div>
                </div>
                <div className="phone-screen__title">一屏直达<br />核心模块</div>
                <div className="phone-screen__btn-stack">
                  <div className="phone-screen__btn">
                    <div className="phone-screen__btn-icon">
                      <Icon className="phone-screen__btn-icon-svg" icon="mdi:view-grid-outline" />
                    </div>
                    矿机 / C2C / VIP
                  </div>
                  <div className="phone-screen__btn phone-screen__btn--outline">
                    <Icon className="phone-screen__btn-outline-icon" icon="mdi:account-circle-outline" />
                    团队 · 我的
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="phone phone--main">
            <div className="phone__screen">
              <div className="phone__notch"></div>
              <div className="phone-screen phone-screen--wallet">
                <div className="wallet-header">
                  <div className="phone-screen__logo phone-screen__logo--light">
                    <div className="phone-screen__logo-mark phone-screen__logo-mark--light">
                      <img className="phone-screen__logo-icon" src={logoIcon} alt="" />
                    </div>
                    NETE
                  </div>
                  <div className="phone-screen__status">
                    <Icon className="phone-screen__status-icon" icon="mdi:wifi-strength-2" />
                    <Icon className="phone-screen__status-icon" icon="mdi:battery-medium" />
                  </div>
                </div>
                <div className="phone-screen__greeting">我的链上账户</div>
                <div className="wallet-card">
                  <div className="wallet-card__dot"></div>
                  <div className="wallet-card__label">NETE 总资产</div>
                  <div className="wallet-card__amount">128,640</div>
                  <div className="wallet-card__currency">
                    NETE
                    <Icon className="wallet-card__currency-icon" icon="mdi:chart-line" />
                  </div>
                </div>
                <div className="wallet-assets">
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--add">
                      <Icon className="wallet-asset__icon-svg" icon="solar:cpu-bolt-outline" />
                    </div>
                    <div className="wallet-asset__label">矿机</div>
                  </div>
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--eth">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:swap-horizontal" />
                    </div>
                    <div className="wallet-asset__label">C2C</div>
                  </div>
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--bnb">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:star-four-points-outline" />
                    </div>
                    <div className="wallet-asset__label">VIP</div>
                  </div>
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--usdt">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:account-group-outline" />
                    </div>
                    <div className="wallet-asset__label">团队</div>
                  </div>
                </div>
                <div className="wallet-network-label">今日关键数据</div>
                <div className="wallet-row">
                  <div className="wallet-row__info">
                    <div className="wallet-row__avatar wallet-row__avatar--square"></div>
                    <div>
                      <div className="wallet-row__name">本金钱包</div>
                      <div className="wallet-row__addr">可提余额</div>
                    </div>
                  </div>
                </div>
                <div className="wallet-row">
                  <div className="wallet-row__info">
                    <div className="wallet-row__avatar wallet-row__avatar--eth"></div>
                    <div className="wallet-row__name">流通钱包</div>
                  </div>
                  <div className="wallet-row__val">56,120</div>
                </div>
                <div className="wallet-row">
                  <div className="wallet-row__info">
                    <div className="wallet-row__avatar wallet-row__avatar--dai"></div>
                    <div className="wallet-row__name">团队业绩</div>
                  </div>
                  <div className="wallet-row__val">268,000</div>
                </div>
                <div className="phone-nav">
                  <div className="phone-nav__item phone-nav__item--active">
                    <Icon className="phone-nav__icon" icon="mdi:view-grid-outline" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--dim">
                    <Icon className="phone-nav__icon" icon="mdi:swap-horizontal" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--dim">
                    <Icon className="phone-nav__icon" icon="mdi:star-outline" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--dim">
                    <Icon className="phone-nav__icon" icon="mdi:account-circle-outline" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="phone phone--right">
            <div className="phone__screen">
              <div className="phone__notch"></div>
              <div className="phone-screen phone-screen--discover">
                <div className="discover__title">C2C 自选区</div>
                <div className="discover__banner">
                  <div className="discover__banner-eyebrow">REALTIME</div>
                  <div className="discover__banner-title">实时优选<br />委托商家</div>
                </div>
                <div className="discover__caps">
                  <div className="discover__cap-card">
                    <div className="discover__cap-label">快捷区价格</div>
                    <div className="discover__cap-value">6.82 CNY</div>
                    <div className="discover__cap-change--up">最优撮合</div>
                  </div>
                  <div className="discover__cap-card">
                    <div className="discover__cap-label">卖方手续费</div>
                    <div className="discover__cap-value">10%</div>
                    <div className="discover__cap-change--down">链上透明</div>
                  </div>
                </div>
                <div className="discover__cats">
                  <div className="discover__cat">
                    <div className="discover__cat-icon">
                      <Icon className="discover__cat-icon-svg" icon="mdi:lightning-bolt-outline" />
                    </div>
                    快捷区
                  </div>
                  <div className="discover__cat">
                    <div className="discover__cat-icon">
                      <Icon className="discover__cat-icon-svg" icon="mdi:playlist-check" />
                    </div>
                    自选区
                  </div>
                  <div className="discover__cat">
                    <div className="discover__cat-icon">
                      <Icon className="discover__cat-icon-svg" icon="mdi:file-document-outline" />
                    </div>
                    订单
                  </div>
                </div>
                <div className="discover__nft-grid">
                  <div className="discover__nft-thumb discover__nft-thumb--pink">
                    <div className="discover__nft-meta">VIP 加速</div>
                    <div className="discover__nft-value">最高 45%</div>
                  </div>
                  <div className="discover__nft-thumb discover__nft-thumb--acid">
                    <div className="discover__nft-meta">矿机收益</div>
                    <div className="discover__nft-value">每日结算</div>
                  </div>
                </div>
                <div className="phone-nav phone-nav--purple">
                  <div className="phone-nav__item">
                    <Icon className="phone-nav__icon" icon="mdi:view-grid-outline" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--active">
                    <Icon className="phone-nav__icon" icon="mdi:swap-horizontal" />
                  </div>
                  <div className="phone-nav__item">
                    <Icon className="phone-nav__icon" icon="mdi:file-document-outline" />
                  </div>
                  <div className="phone-nav__item">
                    <Icon className="phone-nav__icon" icon="mdi:account-circle-outline" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
  );
}
