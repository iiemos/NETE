import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import C2CPageFrame from "../../components/c2c/C2CPageFrame";
import { hotCoins, quickGuideSteps } from "../../data/c2cUiData";
import { getRuntimeConfig } from "../../services/neteApi";
import { readMarketConfig } from "../../services/neteContracts";
import { formatTokenAmount, parseTokenInput } from "../../utils/formatters";
import c2cGuideIcon1 from "../../assets/images/c2c-1.svg";
import c2cGuideIcon2 from "../../assets/images/c2c-2.svg";
import c2cGuideIcon3 from "../../assets/images/c2c-3.svg";
import "../styles/c2c.css";

function CoinMark({ type }) {
  return <span className="c2c-token-mark">{type}</span>;
}

const guideIconMap = {
  money: c2cGuideIcon1,
  hourglass: c2cGuideIcon2,
  wallet: c2cGuideIcon3,
};

function toPriceWei(value) {
  if (typeof value === "bigint") return value;
  if (value === null || value === undefined || value === "") return 0n;
  const text = String(value).trim();
  if (!text) return 0n;
  try {
    return text.includes(".") ? parseTokenInput(text) : BigInt(text);
  } catch {
    return 0n;
  }
}

function QuickSellFormCard({ referenceText }) {
  return (
    <article className="c2c-quick-form c2c-surface">
      <div className="c2c-form-tabs">
        <Link className="c2c-form-tab" to="/c2c">购买</Link>
        <Link className="c2c-form-tab is-active" to="/c2c/sell">出售</Link>
      </div>

      <div className="c2c-field-block">
        <div className="c2c-field-title">我要出售</div>
        <div className="c2c-field-input-row right-fixed">
          <button type="button" className="c2c-currency-pill usdt-pill">
            <span className="c2c-currency-mark usdt">₮</span>
            USDT
            <span className="c2c-chevron"><Icon icon="mdi:chevron-down" /></span>
          </button>
        </div>
      </div>

      <p className="c2c-account-tip">资金账户可出售 -- USDT</p>

      <div className="c2c-field-block">
        <div className="c2c-field-title">我将收到</div>
        <div className="c2c-field-input-row">
          <span className="c2c-field-placeholder">0</span>
          <button type="button" className="c2c-currency-pill">
            <span className="c2c-currency-mark cny">¥</span>
            CNY
            <span className="c2c-chevron"><Icon icon="mdi:chevron-down" /></span>
          </button>
        </div>
      </div>

      <p className="c2c-field-tip">10 - 40,000,000 CNY</p>
      <p className="c2c-reference">{referenceText}</p>
      <button type="button" className="c2c-disabled-btn">选择收款方式</button>
    </article>
  );
}

export default function C2CSellPage() {
  const runtimeConfigQuery = useQuery({
    queryKey: ["nete", "runtime-config"],
    queryFn: getRuntimeConfig,
    staleTime: 20_000,
    retry: 1,
  });

  const marketConfigQuery = useQuery({
    queryKey: ["nete", "market-config"],
    queryFn: readMarketConfig,
    staleTime: 20_000,
    retry: 1,
  });

  const guideMin = toPriceWei(runtimeConfigQuery.data?.guide_min_price || marketConfigQuery.data?.guideMinPrice);
  const guideMax = toPriceWei(runtimeConfigQuery.data?.guide_max_price || marketConfigQuery.data?.guideMaxPrice);

  const referenceText = guideMin > 0n && guideMax > 0n
    ? `指导价区间 ${formatTokenAmount(guideMin, 18, 6)} U - ${formatTokenAmount(guideMax, 18, 6)} U`
    : "参考价格加载中...";

  return (
    <C2CPageFrame zone="quick">
      <section className="c2c-hero c2c-surface">
        <div className="c2c-hero-copy">
          <span className="c2c-eyebrow">NETE C2C</span>
          <h1>使用 CNY 快捷出售 USDT</h1>
          <p className="c2c-lead">快捷交易为您自动匹配当前 C2C 市场出售 USDT 的最优价格之选。</p>

          <div className="c2c-mini-metrics">
            <article className="c2c-mini-panel">
              <span>指导价区间</span>
              <strong>{guideMin > 0n && guideMax > 0n ? `${formatTokenAmount(guideMin, 18, 6)} U - ${formatTokenAmount(guideMax, 18, 6)} U` : "--"}</strong>
            </article>
            <article className="c2c-mini-panel">
              <span>单笔限额</span>
              <strong>10 - 40,000,000 CNY</strong>
            </article>
          </div>
        </div>

        <QuickSellFormCard referenceText={referenceText} />
      </section>

      <article className="c2c-hot-coins c2c-surface">
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

      <section className="c2c-guide c2c-surface">
        <h2>如何在 C2C 快捷交易使用 CNY 出售 USDT</h2>
        <div className="c2c-guide-grid">
          {quickGuideSteps.map((item) => (
            <article key={item.title} className="c2c-guide-card">
              <span className="c2c-guide-icon">
                <img src={guideIconMap[item.icon] ?? c2cGuideIcon1} alt="" aria-hidden="true" />
              </span>
              <h3>{item.title.replace("购买", "出售")}</h3>
              <p>{item.desc.replace("购买", "出售")}</p>
            </article>
          ))}
        </div>
      </section>
    </C2CPageFrame>
  );
}
