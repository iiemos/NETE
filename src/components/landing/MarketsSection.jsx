import { Icon } from "@iconify/react";

export default function MarketsSection() {
  return (
  <section className="section tokens-section" id="tokens" aria-labelledby="tokens-heading">
    <div className="glow-orb glow-orb--purple glow-orb--tokens-center" aria-hidden="true"></div>
    <div className="container">
      <div className="section__header">
        <span className="section__eyebrow" aria-hidden="true">// Tokenomics</span>
        <h2 className="section__title" id="tokens-heading">核心经济参数<br />一览</h2>
      </div>
    </div>
    <div className="container container--bleed">
      
      <div className="token-scroll-container" role="region" aria-label="Token cards, scroll horizontally">
        <div className="token-scroll-track">

          <article className="token-card" tabIndex={0}>
            <div className="token-card__header">
              <div>
                <div className="token-card__name">发行总量</div>
                <div className="token-card__ticker">SUPPLY</div>
              </div>
              <div className="token-card__icon token-icon--btc">
                <Icon className="token-card__icon-svg" icon="mdi:cube-outline" />
              </div>
            </div>
            <div className="token-card__price">30 亿 NETE</div>
            <span className="token-card__change token-card__change--up">恒定不增发</span>
            <div className="sparkline" aria-hidden="true">
              <svg viewBox="0 0 180 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CAFF00" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#CAFF00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,30 L20,25 L40,28 L60,18 L80,22 L100,12 L120,15 L140,8 L160,5 L180,2" fill="none" stroke="#CAFF00" strokeWidth="1.5" />
                <path d="M0,30 L20,25 L40,28 L60,18 L80,22 L100,12 L120,15 L140,8 L160,5 L180,2 V40 H0Z" fill="url(#g1)" />
              </svg>
            </div>
          </article>

          <article className="token-card" tabIndex={0}>
            <div className="token-card__header">
              <div>
                <div className="token-card__name">极限通缩目标</div>
                <div className="token-card__ticker">DEFLATION</div>
              </div>
              <div className="token-card__icon token-icon--eth">
                <Icon className="token-card__icon-svg" icon="mdi:chart-line-variant" />
              </div>
            </div>
            <div className="token-card__price">2100 万 NETE</div>
            <span className="token-card__change token-card__change--down">提币/激活触发销毁</span>
            <div className="sparkline" aria-hidden="true">
              <svg viewBox="0 0 180 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF2D78" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF2D78" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,5 L20,8 L40,6 L60,12 L80,9 L100,18 L120,15 L140,22 L160,25 L180,30" fill="none" stroke="#FF2D78" strokeWidth="1.5" />
                <path d="M0,5 L20,8 L40,6 L60,12 L80,9 L100,18 L120,15 L140,22 L160,25 L180,30 V40 H0Z" fill="url(#g2)" />
              </svg>
            </div>
          </article>

          <article className="token-card" tabIndex={0}>
            <div className="token-card__header">
              <div>
                <div className="token-card__name">启动分配结构</div>
                <div className="token-card__ticker">BOOTSTRAP</div>
              </div>
              <div className="token-card__icon token-icon--sol">
                <Icon className="token-card__icon-svg" icon="mdi:rocket-launch-outline" />
              </div>
            </div>
            <div className="token-card__price">500 万 + 500 万</div>
            <span className="token-card__change token-card__change--up">种子轮 0.5 USDT / NETE</span>
            <div className="sparkline" aria-hidden="true">
              <svg viewBox="0 0 180 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CAFF00" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#CAFF00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 L20,28 L40,30 L60,20 L80,15 L100,18 L120,10 L140,6 L160,4 L180,2" fill="none" stroke="#CAFF00" strokeWidth="1.5" />
                <path d="M0,35 L20,28 L40,30 L60,20 L80,15 L100,18 L120,10 L140,6 L160,4 L180,2 V40 H0Z" fill="url(#g3)" />
              </svg>
            </div>
          </article>

          <article className="token-card" tabIndex={0}>
            <div className="token-card__header">
              <div>
                <div className="token-card__name">提币手续费分配</div>
                <div className="token-card__ticker">FEE SPLIT</div>
              </div>
              <div className="token-card__icon token-icon--bnb">
                <Icon className="token-card__icon-svg" icon="mdi:percent-outline" />
              </div>
            </div>
            <div className="token-card__price">20% / 30% / 50%</div>
            <span className="token-card__change token-card__change--up">销毁 / 项目方 / 社区</span>
            <div className="sparkline" aria-hidden="true">
              <svg viewBox="0 0 180 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F3BA2F" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F3BA2F" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,28 L20,22 L40,26 L60,20 L80,16 L100,12 L120,14 L140,8 L160,6 L180,3" fill="none" stroke="#F3BA2F" strokeWidth="1.5" />
                <path d="M0,28 L20,22 L40,26 L60,20 L80,16 L100,12 L120,14 L140,8 L160,6 L180,3 V40 H0Z" fill="url(#g4)" />
              </svg>
            </div>
          </article>

          <article className="token-card" tabIndex={0}>
            <div className="token-card__header">
              <div>
                <div className="token-card__name">C2C 流通机制</div>
                <div className="token-card__ticker">C2C</div>
              </div>
              <div className="token-card__icon token-icon--avax">
                <Icon className="token-card__icon-svg" icon="mdi:swap-horizontal-circle-outline" />
              </div>
            </div>
            <div className="token-card__price">卖方手续费 10%</div>
            <span className="token-card__change token-card__change--up">V4+ 做市商可申请免手续费</span>
            <div className="sparkline" aria-hidden="true">
              <svg viewBox="0 0 180 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CAFF00" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#CAFF00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,32 L30,26 L60,28 L90,16 L120,10 L150,7 L180,3" fill="none" stroke="#CAFF00" strokeWidth="1.5" />
                <path d="M0,32 L30,26 L60,28 L90,16 L120,10 L150,7 L180,3 V40 H0Z" fill="url(#g5)" />
              </svg>
            </div>
          </article>

        </div>
      </div>
    </div>
  </section>
  );
}
