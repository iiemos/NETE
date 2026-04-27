import { Icon } from "@iconify/react";

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
                    <Icon className="phone-screen__logo-icon phone-screen__logo-icon--acid" icon="mdi:hexagon" />
                  </div>
                  NETE
                </div>
                <div className="phone-illus">
                  <div className="phone-illus__card"></div>
                  <div className="phone-illus__cube"></div>
                </div>
                <div className="phone-screen__title">Transparent<br />Value Engine</div>
                <div className="phone-screen__btn-stack">
                  <div className="phone-screen__btn">
                    <div className="phone-screen__btn-icon">
                      <Icon className="phone-screen__btn-icon-svg" icon="mdi:plus" />
                    </div>
                    进入 NETE 生态
                  </div>
                  <div className="phone-screen__btn phone-screen__btn--outline">
                    <Icon className="phone-screen__btn-outline-icon" icon="mdi:refresh" />
                    查看经济模型
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
                      <Icon className="phone-screen__logo-icon phone-screen__logo-icon--purple" icon="mdi:hexagon" />
                    </div>
                    NETE
                  </div>
                  <div className="phone-screen__status">
                    <Icon className="phone-screen__status-icon" icon="mdi:wifi-strength-2" />
                    <Icon className="phone-screen__status-icon" icon="mdi:battery-medium" />
                  </div>
                </div>
                <div className="phone-screen__greeting">Hey, Samuel Hawking</div>
                <div className="wallet-card">
                  <div className="wallet-card__dot"></div>
                  <div className="wallet-card__label">Total Assets</div>
                  <div className="wallet-card__amount">$3,187.99</div>
                  <div className="wallet-card__currency">
                    USD
                    <Icon className="wallet-card__currency-icon" icon="mdi:currency-usd" />
                  </div>
                </div>
                <div className="wallet-assets">
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--add">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:plus" />
                    </div>
                    <div className="wallet-asset__label">Add</div>
                  </div>
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--eth">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:ethereum" />
                    </div>
                    <div className="wallet-asset__label">ETH</div>
                  </div>
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--bnb">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:currency-btc" />
                    </div>
                    <div className="wallet-asset__label">BNB</div>
                  </div>
                  <div className="wallet-asset">
                    <div className="wallet-asset__icon wallet-asset__icon--usdt">
                      <Icon className="wallet-asset__icon-svg" icon="mdi:currency-usd" />
                    </div>
                    <div className="wallet-asset__label">USDT</div>
                  </div>
                </div>
                <div className="wallet-network-label">Ethereum Mainnet</div>
                <div className="wallet-row">
                  <div className="wallet-row__info">
                    <div className="wallet-row__avatar wallet-row__avatar--square"></div>
                    <div>
                      <div className="wallet-row__name">NETE Onchain Wallet</div>
                      <div className="wallet-row__addr">0xc213...34dr</div>
                    </div>
                  </div>
                </div>
                <div className="wallet-row">
                  <div className="wallet-row__info">
                    <div className="wallet-row__avatar wallet-row__avatar--eth"></div>
                    <div className="wallet-row__name">ETH</div>
                  </div>
                  <div className="wallet-row__val">0.54</div>
                </div>
                <div className="wallet-row">
                  <div className="wallet-row__info">
                    <div className="wallet-row__avatar wallet-row__avatar--dai"></div>
                    <div className="wallet-row__name">DAI</div>
                  </div>
                  <div className="wallet-row__val">594.23</div>
                </div>
                <div className="phone-nav">
                  <div className="phone-nav__item phone-nav__item--active">
                    <Icon className="phone-nav__icon" icon="mdi:view-grid-outline" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--dim">
                    <Icon className="phone-nav__icon" icon="mdi:compass-outline" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--dim">
                    <Icon className="phone-nav__icon" icon="mdi:swap-horizontal" />
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
                <div className="discover__title">Discover</div>
                <div className="discover__banner">
                  <div className="discover__banner-eyebrow">NEXT-GEN</div>
                  <div className="discover__banner-title">YOUR SMART<br />WALLET</div>
                </div>
                <div className="discover__caps">
                  <div className="discover__cap-card">
                    <div className="discover__cap-label">Market Cap</div>
                    <div className="discover__cap-value">$1.3T</div>
                    <div className="discover__cap-change--up">▲ 9.3%</div>
                  </div>
                  <div className="discover__cap-card">
                    <div className="discover__cap-label">NFT Cap</div>
                    <div className="discover__cap-value">$2.1B</div>
                    <div className="discover__cap-change--down">▼ 2.9%</div>
                  </div>
                </div>
                <div className="discover__cats">
                  <div className="discover__cat">
                    <div className="discover__cat-icon">
                      <Icon className="discover__cat-icon-svg" icon="mdi:gamepad-variant-outline" />
                    </div>
                    Games
                  </div>
                  <div className="discover__cat">
                    <div className="discover__cat-icon">
                      <Icon className="discover__cat-icon-svg" icon="mdi:storefront-outline" />
                    </div>
                    Market
                  </div>
                  <div className="discover__cat">
                    <div className="discover__cat-icon">
                      <Icon className="discover__cat-icon-svg" icon="mdi:chart-line" />
                    </div>
                    DeFi
                  </div>
                </div>
                <div className="discover__nft-grid">
                  <div className="discover__nft-thumb discover__nft-thumb--pink"></div>
                  <div className="discover__nft-thumb discover__nft-thumb--acid"></div>
                </div>
                <div className="phone-nav phone-nav--purple">
                  <div className="phone-nav__item">
                    <Icon className="phone-nav__icon" icon="mdi:view-grid-outline" />
                  </div>
                  <div className="phone-nav__item phone-nav__item--active">
                    <Icon className="phone-nav__icon" icon="mdi:compass-outline" />
                  </div>
                  <div className="phone-nav__item">
                    <Icon className="phone-nav__icon" icon="mdi:swap-horizontal" />
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
