import { Icon } from "@iconify/react";

export default function FeaturesSection() {
  return (
  <section className="section" id="discover" aria-labelledby="features-heading">
    <div className="container">
      <div className="section__header">
        <span className="section__eyebrow" aria-hidden="true">// Core Mechanisms</span>
        
        <h2 className="section__title" id="features-heading">
          链上规则驱动的<br />可持续增长模型
        </h2>
        <p className="section__desc">
          以公开可验证的合约规则替代中心化口径，围绕发行、产出、分配、销毁与治理构建完整闭环，
          提升生态的透明度、稳定性与长期价值承载能力。
        </p>
      </div>

      <div className="features-grid">

        <article className="feature-card feature-card--highlight" tabIndex={0}>
          <div className="feature-card__icon feature-card__icon--acid" role="img" aria-label="Shield icon">
            <Icon className="feature-card__icon-svg" icon="mdi:recycle-variant" />
          </div>
          
          <h3 className="feature-card__title">三重通缩机制</h3>
          <p className="feature-card__desc">
            每次链上提币与激活矿机均触发销毁，结合产出节奏调节阀控制通胀速度，
            通过机制化收缩推动总量从 30 亿向 2100 万持续收敛。
          </p>
          <span className="feature-card__tag">30 亿 → 2100 万</span>
        </article>

        <article className="feature-card" tabIndex={0}>
          <div className="feature-card__icon feature-card__icon--purple" role="img" aria-label="Chain links">
            <Icon className="feature-card__icon-svg" icon="mdi:pickaxe" />
          </div>
          <h3 className="feature-card__title">POS 质押销毁挖矿</h3>
          <p className="feature-card__desc">
            约 99.66% 代币通过质押销毁挖矿释放，空投矿机作为转化入口并受有效期与转正规则约束，
            产出路径清晰且可审计。
          </p>
          <span className="feature-card__tag">约 29.9 亿 POS 释放</span>
        </article>

        <article className="feature-card" tabIndex={0}>
          <div className="feature-card__icon feature-card__icon--pink" role="img" aria-label="Diamond">
            <Icon className="feature-card__icon-svg" icon="mdi:puzzle-outline" />
          </div>
          <h3 className="feature-card__title">社区治理 V1-V9</h3>
          <p className="feature-card__desc">
            提币手续费社区分红中，50% 按等级平分、50% 按当日新增业绩加权，
            并叠加固定奖励与分享加速机制，形成可持续的增长激励网络。
          </p>
          <span className="feature-card__tag">双轨分红 + 固定奖励</span>
        </article>

        <article className="feature-card" tabIndex={0}>
          <div className="feature-card__icon feature-card__icon--teal" role="img" aria-label="Chart">
            <Icon className="feature-card__icon-svg" icon="mdi:shield-lock-outline" />
          </div>
          <h3 className="feature-card__title">链上安全与可追溯</h3>
          <p className="feature-card__desc">
            无中心资金池，所有资金锁定在合约与用户钱包；合约自动执行、权限可放弃，
            交易、分红、销毁全链上公开可查。
          </p>
          <span className="feature-card__tag">公开透明 · 可验证</span>
        </article>

      </div>
    </div>
  </section>
  );
}
