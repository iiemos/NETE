import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import C2CPageFrame from "../../components/c2c/C2CPageFrame";
import { hotCoins, quickGuideSteps } from "../../data/c2cUiData";
import "../styles/c2c.css";

function CoinMark({ type }) {
  return <span className="c2c-token-mark">{type}</span>;
}

function GuideIcon({ kind }) {
  if (kind === "hourglass") {
    return <Icon icon="mdi:timer-sand" />;
  }
  if (kind === "wallet") {
    return <Icon icon="mdi:wallet-outline" />;
  }
  return <Icon icon="mdi:file-document-outline" />;
}

function QuickFormCard() {
  return (
    <article className="c2c-quick-form">
      <div className="c2c-form-tabs">
        <Link className="c2c-form-tab is-active" to="/c2c">购买</Link>
        <Link className="c2c-form-tab" to="/c2c/sell">出售</Link>
      </div>

      <div className="c2c-field-block">
        <div className="c2c-field-title">我要支付</div>
        <div className="c2c-field-input-row">
          <span className="c2c-field-placeholder">0</span>
          <button type="button" className="c2c-currency-pill">
            <span className="c2c-currency-mark cny">¥</span>
            CNY
            <span className="c2c-chevron"><Icon icon="mdi:chevron-down" /></span>
          </button>
        </div>
      </div>

      <p className="c2c-field-tip">10 - 5,000,000 CNY</p>

      <div className="c2c-field-block">
        <div className="c2c-field-title">我将收到</div>
        <div className="c2c-field-input-row right-fixed">
          <button type="button" className="c2c-currency-pill usdt-pill">
            <span className="c2c-currency-mark usdt">₮</span>
            USDT
            <span className="c2c-chevron"><Icon icon="mdi:chevron-down" /></span>
          </button>
        </div>
      </div>

      <div className="c2c-switch-row">
        <span className="c2c-switch" aria-hidden="true"></span>
        <span>排除验证单</span>
      </div>

      <p className="c2c-reference">参考价格 1 USDT = 6.82 CNY</p>
      <button type="button" className="c2c-disabled-btn">选择付款方式</button>
    </article>
  );
}

export default function C2COverviewPage() {
  return (
    <C2CPageFrame zone="quick">
      <section className="c2c-quick-hero-wrap">
        <div className="c2c-quick-hero-text">
          <h1>C2C 快捷交易<br />使用 CNY 购买 USDT</h1>
          <p>快捷交易为您自动匹配当前 C2C 市场购买 USDT 的最优价格之选。</p>

          <article className="c2c-hot-coins">
            <h2>热门币种</h2>
            <p>近期市场热议、交易最活跃的币种，尽在 C2C。</p>
            <div className="c2c-hot-list">
              {hotCoins.map((coin) => (
                <div className="c2c-hot-item" key={coin.symbol}>
                  <div className="c2c-hot-head">
                    <span className="c2c-hot-symbol">{coin.symbol}</span>
                    <CoinMark type={coin.tokenMark} />
                  </div>
                  <p className="c2c-hot-price">{coin.price}</p>
                  <p className={coin.trend === "up" ? "c2c-hot-change up" : "c2c-hot-change down"}>{coin.change}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <QuickFormCard />
      </section>

      <section className="c2c-guide">
        <h2>如何在 C2C 快捷交易使用 CNY 购买 USDT</h2>
        <div className="c2c-guide-grid">
          {quickGuideSteps.map((item) => (
            <article key={item.title} className="c2c-guide-card">
              <span className="c2c-guide-icon"><GuideIcon kind={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </C2CPageFrame>
  );
}
