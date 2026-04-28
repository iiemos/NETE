import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import C2CPageFrame from "../../components/c2c/C2CPageFrame";
import { orderBookRows, selfBuyFeatured, selfBuyRows, selfSellFeatured, selfSellRows } from "../../data/c2cUiData";
import "../styles/c2c.css";

const tabs = [
  { key: "buy", label: "购买" },
  { key: "sell", label: "出售" },
  { key: "orderbook", label: "盘口模式" },
];

function paymentTone(payment) {
  if (payment.includes("微信")) return "wechat";
  if (payment.includes("银行")) return "bank";
  return "alipay";
}

function ActionButton({ accent, label }) {
  return <button className={accent === "sell" ? "c2c-action-btn sell" : "c2c-action-btn buy"}>{label}</button>;
}

function FilterBar() {
  return (
    <div className="c2c-filter-row">
      <button className="c2c-select-field coin" type="button">
        <span className="c2c-currency-mark usdt">₮</span>
        USDT
        <span className="c2c-chevron"><Icon icon="mdi:chevron-down" /></span>
      </button>

      <button className="c2c-select-field amount" type="button">
        <span className="c2c-placeholder">0.00</span>
        <span className="c2c-cny-inline">
          <span className="c2c-currency-mark cny">¥</span>
          CNY
        </span>
        <span className="c2c-chevron"><Icon icon="mdi:chevron-down" /></span>
      </button>

      <button className="c2c-select-field payment" type="button">
        <span>全部支付方式</span>
        <span className="c2c-clear-dot">
          <Icon icon="mdi:close" />
        </span>
      </button>

      <button className="c2c-filter-trigger" type="button" aria-label="筛选">
        <Icon icon="mdi:filter-variant" aria-hidden="true" />
      </button>
    </div>
  );
}

function FeaturedPanel({ data }) {
  return (
    <section className="c2c-featured-panel">
      <div className="c2c-featured-head">
        <div>
          <h3>{data.title}</h3>
          <p>{data.subtitle}</p>
        </div>
        <button type="button" className="c2c-more-btn">查看更多</button>
      </div>

      <div className="c2c-featured-cards">
        {data.cards.map((item) => (
          <article className="c2c-featured-card" key={item.merchant}>
            <h4>
              {item.merchant}
              <span className="c2c-merchant-badge">{item.badge}</span>
              {item.tags ? <span className="c2c-merchant-tags">{item.tags}</span> : null}
            </h4>
            <p className="c2c-featured-price">{item.price}</p>
            <p><span className="muted">剩余数量:</span> {item.balance}</p>
            <p><span className="muted">限额:</span> {item.limit}</p>
            <div className="c2c-featured-foot">
              <span className={`c2c-payment-tag ${paymentTone(item.payment)}`}>{item.payment}</span>
              <ActionButton accent={data.accent} label={data.action} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MerchantDesktopTable({ rows }) {
  return (
    <section className="c2c-table-wrap desktop-only-table">
      <header className="c2c-table-head c2c-grid-main">
        <span>商家</span>
        <span>单价</span>
        <span>数量/限额</span>
        <span>支付方式</span>
        <span>购买/出售</span>
      </header>

      {rows.map((row) => (
        <article className="c2c-table-row c2c-grid-main" key={`${row.merchant}-${row.price}-${row.amount}`}>
          <div className="c2c-col-merchant">
            <h4>
              {row.merchant}
              <span className="c2c-merchant-badge">★</span>
            </h4>
            <p>{row.stats}</p>
          </div>

          <div className="c2c-col-price">{row.price}</div>

          <div className="c2c-col-amount">
            <p>{row.amount}</p>
            <p>{row.limit}</p>
          </div>

          <div className="c2c-col-payment">
            <span className={`c2c-payment-tag ${paymentTone(row.payment)}`}>{row.payment}</span>
          </div>

          <div className="c2c-col-action">
            <ActionButton accent={row.accent} label={row.action} />
          </div>
        </article>
      ))}
    </section>
  );
}

function MerchantMobileList({ rows }) {
  return (
    <section className="c2c-mobile-list">
      {rows.map((row) => (
        <article className="c2c-mobile-item" key={`mobile-${row.merchant}-${row.price}`}>
          <h4>
            {row.merchant}
            <span className="c2c-merchant-badge">★</span>
          </h4>
          <p className="c2c-mobile-meta">{row.stats}</p>
          <p className="c2c-mobile-price">{row.price}</p>
          <p><span className="muted">剩余数量:</span> {row.amount}</p>
          <p><span className="muted">限额:</span> {row.limit}</p>
          <div className="c2c-mobile-foot">
            <span className={`c2c-payment-tag ${paymentTone(row.payment)}`}>{row.payment}</span>
            <ActionButton accent={row.accent} label={row.action} />
          </div>
        </article>
      ))}
    </section>
  );
}

function OrderBookTable() {
  return (
    <section className="c2c-table-wrap c2c-orderbook-wrap">
      <header className="c2c-table-head c2c-grid-book">
        <span>单价</span>
        <span>剩余数量</span>
        <span>限额</span>
        <span>商家</span>
        <span>支付方式</span>
        <span>购买/出售</span>
      </header>

      <div className="c2c-orderbook-body">
        {orderBookRows.map((row) => (
          <article className="c2c-table-row c2c-grid-book" key={`book-${row.rank}-${row.merchant}`}>
            <div className="c2c-book-price">
              <span className="c2c-book-rank">{row.rank}</span>
              <span>{row.price}</span>
            </div>
            <span>{row.amount}</span>
            <span>{row.limit}</span>
            <span>{row.merchant} ({row.stats})</span>
            <span className={`c2c-payment-tag ${paymentTone(row.payment)}`}>{row.payment}</span>
            <ActionButton accent="buy" label={row.action} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default function C2CMarketPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const activeMode = mode === "sell" || mode === "orderbook" ? mode : "buy";

  const featured = activeMode === "sell" ? selfSellFeatured : selfBuyFeatured;
  const rows = useMemo(() => (activeMode === "sell" ? selfSellRows : selfBuyRows), [activeMode]);

  const switchMode = (next) => {
    if (next === "buy") {
      setSearchParams({});
      return;
    }
    setSearchParams({ mode: next });
  };

  return (
    <C2CPageFrame zone="self">
      <section className="c2c-self-panel">
        <div className="c2c-self-tabs" role="tablist" aria-label="trade mode">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              className={activeMode === tab.key ? "c2c-self-tab is-active" : "c2c-self-tab"}
              onClick={() => switchMode(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <FilterBar />

        {activeMode === "orderbook" ? (
          <OrderBookTable />
        ) : (
          <>
            <FeaturedPanel data={featured} />
            <MerchantDesktopTable rows={rows} />
            <MerchantMobileList rows={rows} />
          </>
        )}
      </section>
    </C2CPageFrame>
  );
}
