import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { formatUnits } from "viem";
import C2CPageFrame from "../../components/c2c/C2CPageFrame";
import { useWalletConnector } from "../../hooks/useWalletConnector";
import { getMySellOrders, getMyTakenOrders, getPublicOrders, getRuntimeConfig } from "../../services/neteApi";
import { approveNeteToMarket, approveUsdtToMarket, cancelSellOrder, createSellOrder, fillOrder, readMarketConfig } from "../../services/neteContracts";
import { formatTokenAmount, parseTokenInput, shortAddress } from "../../utils/formatters";
import "../styles/c2c.css";

const marketTabs = [
  { key: "market", label: "订单列表" },
  { key: "mine", label: "我的订单" },
];

const ONE_18 = 10n ** 18n;

function toItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

function toBigIntSafe(value) {
  if (typeof value === "bigint") return value;
  if (value === null || value === undefined || value === "") return 0n;
  try {
    const text = String(value).trim();
    if (!text) return 0n;
    if (text.includes(".")) {
      return parseTokenInput(text);
    }
    return BigInt(text);
  } catch {
    return 0n;
  }
}

function formatDateTime(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "--";
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("zh-CN", { hour12: false });
}

function formatUnitPrice(value) {
  return `${formatTokenAmount(value, 18, 6)} U`;
}

function formatQuantity(value) {
  return `${formatTokenAmount(value, 18, 4)} NETE`;
}

function formatTotal(value) {
  return `${formatTokenAmount(value, 18, 4)} USDT`;
}

function isOrderOpen(status) {
  const text = String(status || "").toLowerCase();
  return text === "open" || text === "0";
}

function normalizeOrder(raw) {
  const neteAmount = toBigIntSafe(raw?.nete_amount ?? raw?.neteAmount ?? raw?.amount);
  const priceUsdt = toBigIntSafe(raw?.price_usdt ?? raw?.priceUsdt ?? raw?.price_per_nete ?? raw?.price);
  const givenTotal = toBigIntSafe(raw?.total_usdt ?? raw?.totalUsdt ?? raw?.total);
  const totalUsdt = givenTotal > 0n
    ? givenTotal
    : neteAmount > 0n && priceUsdt > 0n
      ? (neteAmount * priceUsdt) / ONE_18
      : 0n;

  return {
    orderId: String(raw?.order_id ?? raw?.orderId ?? raw?.id ?? ""),
    orderNo: String(raw?.order_no ?? raw?.orderNo ?? ""),
    seller: String(raw?.seller ?? ""),
    buyer: String(raw?.buyer ?? ""),
    neteAmount,
    priceUsdt,
    totalUsdt,
    status: String(raw?.status ?? raw?.status_code ?? "Open"),
    isPublic: Boolean(raw?.is_public ?? raw?.isPublic ?? true),
    createdAt: Number(raw?.created_at ?? raw?.createdAt ?? 0),
    filledAt: Number(raw?.filled_at ?? raw?.filledAt ?? 0),
  };
}

function toLower(value) {
  return String(value || "").toLowerCase();
}

export default function C2CMarketPage() {
  const wallet = useWalletConnector();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view");
  const activeView = view === "mine" ? "mine" : "market";

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [actionKey, setActionKey] = useState("");

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

  const publicOrdersQuery = useQuery({
    queryKey: ["nete", "orders", "public"],
    queryFn: () => getPublicOrders({ page: 1, pageSize: 80 }),
    staleTime: 8_000,
    retry: 1,
  });

  const mySellOrdersQuery = useQuery({
    queryKey: ["nete", "orders", "my-sell", wallet.currentAddress],
    queryFn: () => getMySellOrders(wallet.currentAddress, { page: 1, pageSize: 80 }),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 8_000,
    retry: 1,
  });

  const myTakenOrdersQuery = useQuery({
    queryKey: ["nete", "orders", "my-taken", wallet.currentAddress],
    queryFn: () => getMyTakenOrders(wallet.currentAddress, { page: 1, pageSize: 80 }),
    enabled: Boolean(wallet.currentAddress),
    staleTime: 8_000,
    retry: 1,
  });

  const publicOrders = useMemo(
    () => toItems(publicOrdersQuery.data).map(normalizeOrder),
    [publicOrdersQuery.data],
  );

  const mySellOrders = useMemo(
    () => toItems(mySellOrdersQuery.data).map(normalizeOrder),
    [mySellOrdersQuery.data],
  );

  const myTakenOrders = useMemo(
    () => toItems(myTakenOrdersQuery.data).map(normalizeOrder),
    [myTakenOrdersQuery.data],
  );

  const guideMinPrice = useMemo(() => {
    const fromApi = runtimeConfigQuery.data?.guide_min_price;
    if (fromApi) return toBigIntSafe(fromApi);
    return marketConfigQuery.data?.guideMinPrice ?? 0n;
  }, [marketConfigQuery.data?.guideMinPrice, runtimeConfigQuery.data?.guide_min_price]);

  const guideMaxPrice = useMemo(() => {
    const fromApi = runtimeConfigQuery.data?.guide_max_price;
    if (fromApi) return toBigIntSafe(fromApi);
    return marketConfigQuery.data?.guideMaxPrice ?? 0n;
  }, [marketConfigQuery.data?.guideMaxPrice, runtimeConfigQuery.data?.guide_max_price]);

  const filteredMarketOrders = useMemo(() => {
    const term = toLower(searchKeyword);
    return publicOrders
      .filter((item) => isOrderOpen(item.status))
      .filter((item) => {
        if (!term) return true;
        return toLower(item.orderId).includes(term) || toLower(item.seller).includes(term) || toLower(item.orderNo).includes(term);
      });
  }, [publicOrders, searchKeyword]);

  const currentOrders = useMemo(
    () => mySellOrders.filter((item) => isOrderOpen(item.status)),
    [mySellOrders],
  );

  const historyOrders = useMemo(() => {
    const sellHistory = mySellOrders
      .filter((item) => !isOrderOpen(item.status))
      .map((item) => ({
        ...item,
        type: "出售",
        completedAt: item.filledAt || item.createdAt,
      }));

    const buyHistory = myTakenOrders.map((item) => ({
      ...item,
      type: "购买",
      completedAt: item.filledAt || item.createdAt,
    }));

    return [...buyHistory, ...sellHistory]
      .sort((a, b) => Number(b.completedAt || 0) - Number(a.completedAt || 0))
      .slice(0, 80);
  }, [mySellOrders, myTakenOrders]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const switchTab = (next) => {
    if (next === "market") {
      setSearchParams({});
      return;
    }
    setSearchParams({ view: next });
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim().toLowerCase());
  };

  async function refreshOrders() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["nete", "orders", "public"] }),
      queryClient.invalidateQueries({ queryKey: ["nete", "orders", "my-sell", wallet.currentAddress] }),
      queryClient.invalidateQueries({ queryKey: ["nete", "orders", "my-taken", wallet.currentAddress] }),
    ]);
  }

  const handlePurchase = async (order) => {
    if (!wallet.isConnected) {
      setToastMessage("请先连接钱包");
      return;
    }
    if (!order?.orderId) return;
    if (toLower(order.seller) === toLower(wallet.currentAddress)) {
      setToastMessage("这是你自己的挂单，请到“我的订单”里管理。");
      return;
    }

    try {
      setActionKey(`fill-${order.orderId}`);
      await wallet.ensureCorrectChain();
      await approveUsdtToMarket(wallet.currentAddress, order.totalUsdt);
      const tx = await fillOrder(wallet.currentAddress, order.orderId);
      await refreshOrders();
      setToastMessage(`购买成功，交易哈希：${tx.hash}`);
      switchTab("mine");
    } catch (error) {
      const message = error instanceof Error ? error.message : "购买失败，请稍后重试";
      setToastMessage(message);
    } finally {
      setActionKey("");
    }
  };

  const handleCancelOrder = async (order) => {
    if (!wallet.isConnected || !order?.orderId) {
      setToastMessage("请先连接钱包");
      return;
    }

    try {
      setActionKey(`cancel-${order.orderId}`);
      await wallet.ensureCorrectChain();
      const tx = await cancelSellOrder(wallet.currentAddress, order.orderId);
      await refreshOrders();
      setToastMessage(`取消成功，交易哈希：${tx.hash}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "取消失败，请稍后重试";
      setToastMessage(message);
    } finally {
      setActionKey("");
    }
  };

  const handleCreateListing = async (event) => {
    event.preventDefault();

    if (!wallet.isConnected) {
      setToastMessage("请先连接钱包");
      return;
    }

    let neteAmount = 0n;
    let pricePerNete = 0n;

    try {
      neteAmount = parseTokenInput(sellQuantity || "0");
      pricePerNete = parseTokenInput(sellPrice || "0");
    } catch {
      setToastMessage("输入格式不正确，请检查数量与单价");
      return;
    }

    if (neteAmount <= 0n) {
      setToastMessage("请输入正确的出售数量");
      return;
    }
    if (pricePerNete <= 0n) {
      setToastMessage("请输入正确的出售单价");
      return;
    }

    if (guideMinPrice > 0n && pricePerNete < guideMinPrice) {
      setToastMessage(`出售单价不能低于 ${formatTokenAmount(guideMinPrice, 18, 6)} U`);
      return;
    }
    if (guideMaxPrice > 0n && pricePerNete > guideMaxPrice) {
      setToastMessage(`出售单价不能高于 ${formatTokenAmount(guideMaxPrice, 18, 6)} U`);
      return;
    }

    try {
      setActionKey("create-order");
      await wallet.ensureCorrectChain();
      await approveNeteToMarket(wallet.currentAddress, neteAmount);
      const tx = await createSellOrder(wallet.currentAddress, neteAmount, pricePerNete);
      setSellQuantity("");
      setSellPrice("");
      setIsModalOpen(false);
      await refreshOrders();
      switchTab("mine");
      setToastMessage(`挂单成功，交易哈希：${tx.hash}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "挂单失败，请稍后重试";
      setToastMessage(message);
    } finally {
      setActionKey("");
    }
  };

  return (
    <C2CPageFrame zone="self">
      <section className="c2c-market-shell">
        <div className="c2c-market-tabs" role="tablist" aria-label="订单视图切换">
          {marketTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeView === tab.key}
              className={activeView === tab.key ? "c2c-market-tab is-active" : "c2c-market-tab"}
              onClick={() => switchTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {wallet.isConnected ? null : <p className="mb-3 text-xs text-white/70">当前未连接钱包，连接后可查看我的订单并执行挂单/吃单交易。</p>}

        {activeView === "market" ? (
          <section className="c2c-surface c2c-market-panel">
            <div className="c2c-toolbar">
              <label className="c2c-search-field" aria-label="搜索订单编号">
                <Icon icon="mdi:magnify" aria-hidden="true" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="搜索订单编号 / 卖家地址"
                />
              </label>
              <button type="button" className="c2c-btn c2c-btn-primary" onClick={handleSearch}>搜索</button>
              <button type="button" className="c2c-btn c2c-btn-secondary" onClick={() => setIsModalOpen(true)}>
                我要挂单
              </button>
            </div>

            <div className="px-4 py-3 text-xs text-white/65">
              指导价区间：
              {guideMinPrice > 0n ? `${formatTokenAmount(guideMinPrice, 18, 6)} U` : "--"}
              {" - "}
              {guideMaxPrice > 0n ? `${formatTokenAmount(guideMaxPrice, 18, 6)} U` : "--"}
            </div>

            <div className="c2c-order-table">
              <header className="c2c-order-table-head">
                <span>订单编号</span>
                <span>单价</span>
                <span>数量</span>
                <span>总价</span>
                <span>购买</span>
              </header>

              <div className="c2c-order-table-body">
                {publicOrdersQuery.isLoading ? (
                  <div className="c2c-empty-state">订单加载中...</div>
                ) : publicOrdersQuery.isError ? (
                  <div className="c2c-empty-state">
                    {publicOrdersQuery.error instanceof Error ? publicOrdersQuery.error.message : "订单拉取失败，请稍后重试"}
                  </div>
                ) : filteredMarketOrders.length === 0 ? (
                  <div className="c2c-empty-state">没有找到可交易的订单。</div>
                ) : (
                  filteredMarketOrders.map((order) => (
                    <article className="c2c-order-row" key={order.orderId || order.orderNo}>
                      <div className="c2c-order-cell c2c-order-main-cell">
                        <div className="c2c-order-id-block">
                          <span className="c2c-mobile-key">订单编号</span>
                          <strong className="c2c-order-id">{order.orderId || order.orderNo || "--"}</strong>
                          <p className="c2c-sub-meta">卖家 {shortAddress(order.seller)} · 挂单时间 {formatDateTime(order.createdAt)}</p>
                        </div>
                        <button
                          type="button"
                          className="c2c-btn c2c-btn-primary c2c-mobile-inline"
                          disabled={actionKey === `fill-${order.orderId}`}
                          onClick={() => handlePurchase(order)}
                        >
                          {actionKey === `fill-${order.orderId}` ? "购买中..." : "购买"}
                        </button>
                      </div>

                      <div className="c2c-order-cell">
                        <span className="c2c-mobile-key">单价</span>
                        <strong className="c2c-order-price">{formatUnitPrice(order.priceUsdt)}</strong>
                      </div>

                      <div className="c2c-order-cell">
                        <span className="c2c-mobile-key">数量</span>
                        <span>{formatQuantity(order.neteAmount)}</span>
                      </div>

                      <div className="c2c-order-cell">
                        <span className="c2c-mobile-key">总价</span>
                        <span>{formatTotal(order.totalUsdt)}</span>
                      </div>

                      <div className="c2c-order-cell c2c-order-action-cell">
                        <button
                          type="button"
                          className="c2c-btn c2c-btn-primary c2c-desktop-action"
                          disabled={actionKey === `fill-${order.orderId}`}
                          onClick={() => handlePurchase(order)}
                        >
                          {actionKey === `fill-${order.orderId}` ? "购买中..." : "购买"}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="c2c-mine-layout">
            <section className="c2c-surface c2c-card-section">
              <header className="c2c-section-heading">
                <div>
                  <h2>当前挂单</h2>
                  <p>仅展示你当前处于 Open 状态的卖单，可直接取消。</p>
                </div>
              </header>

              <div className="c2c-list-stack">
                {mySellOrdersQuery.isLoading ? (
                  <div className="c2c-empty-state">加载中...</div>
                ) : mySellOrdersQuery.isError ? (
                  <div className="c2c-empty-state">
                    {mySellOrdersQuery.error instanceof Error ? mySellOrdersQuery.error.message : "我的挂单加载失败"}
                  </div>
                ) : currentOrders.length === 0 ? (
                  <div className="c2c-empty-state">当前没有挂单，点击“我要挂单”即可新增出售订单。</div>
                ) : (
                  currentOrders.map((order) => (
                    <article className="c2c-order-card" key={order.orderId || order.orderNo}>
                      <div className="c2c-order-card-top">
                        <div>
                          <h3 className="c2c-order-card-title">{order.orderId || order.orderNo || "--"}</h3>
                          <p className="c2c-sub-meta">创建时间 {formatDateTime(order.createdAt)}</p>
                        </div>
                        <button
                          type="button"
                          className="c2c-btn c2c-btn-danger"
                          disabled={actionKey === `cancel-${order.orderId}`}
                          onClick={() => handleCancelOrder(order)}
                        >
                          {actionKey === `cancel-${order.orderId}` ? "取消中..." : "取消订单"}
                        </button>
                      </div>

                      <div className="c2c-order-card-grid">
                        <div className="c2c-metric">
                          <span>出售单价</span>
                          <strong>{formatUnitPrice(order.priceUsdt)}</strong>
                        </div>
                        <div className="c2c-metric">
                          <span>出售数量</span>
                          <strong>{formatQuantity(order.neteAmount)}</strong>
                        </div>
                        <div className="c2c-metric">
                          <span>总价</span>
                          <strong>{formatTotal(order.totalUsdt)}</strong>
                        </div>
                        <div className="c2c-metric">
                          <span>状态</span>
                          <strong>{order.status}</strong>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="c2c-surface c2c-card-section">
              <header className="c2c-section-heading">
                <div>
                  <h2>历史成交</h2>
                  <p>包含我的吃单和已结束卖单，按时间倒序展示。</p>
                </div>
              </header>

              <div className="c2c-list-stack">
                {myTakenOrdersQuery.isLoading || mySellOrdersQuery.isLoading ? (
                  <div className="c2c-empty-state">加载中...</div>
                ) : myTakenOrdersQuery.isError ? (
                  <div className="c2c-empty-state">
                    {myTakenOrdersQuery.error instanceof Error ? myTakenOrdersQuery.error.message : "我的吃单加载失败"}
                  </div>
                ) : historyOrders.length === 0 ? (
                  <div className="c2c-empty-state">历史成交还没有记录。</div>
                ) : (
                  historyOrders.map((item) => (
                    <article className="c2c-history-item" key={`${item.orderId || item.orderNo}-${item.completedAt}`}>
                      <div className="c2c-history-top">
                        <h3 className="c2c-order-card-title">{item.orderId || item.orderNo || "--"}</h3>
                        <span className={item.type === "购买" ? "c2c-type-chip buy" : "c2c-type-chip sell"}>{item.type}</span>
                      </div>

                      <div className="c2c-history-meta">
                        <div>
                          <span>成交单价</span>
                          <strong>{formatUnitPrice(item.priceUsdt)}</strong>
                        </div>
                        <div>
                          <span>成交量</span>
                          <strong>{formatQuantity(item.neteAmount)}</strong>
                        </div>
                        <div>
                          <span>成交总价</span>
                          <strong>{formatTotal(item.totalUsdt)}</strong>
                        </div>
                        <div>
                          <span>成交时间</span>
                          <strong>{formatDateTime(item.completedAt)}</strong>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </section>
        )}
      </section>

      <div className={isModalOpen ? "c2c-modal-backdrop is-open" : "c2c-modal-backdrop"} onClick={() => setIsModalOpen(false)}>
        <div className="c2c-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="c2cListingTitle">
          <h3 id="c2cListingTitle">我要挂单</h3>
          <p>
            当前指导价区间：
            {guideMinPrice > 0n ? `${formatTokenAmount(guideMinPrice, 18, 6)} U` : "--"}
            {" - "}
            {guideMaxPrice > 0n ? `${formatTokenAmount(guideMaxPrice, 18, 6)} U` : "--"}
          </p>

          <form className="c2c-modal-form" onSubmit={handleCreateListing}>
            <label className="c2c-modal-field">
              <span>出售数量（NETE）</span>
              <input
                type="number"
                min="0.0001"
                step="0.0001"
                value={sellQuantity}
                onChange={(event) => setSellQuantity(event.target.value)}
                placeholder="请输入出售数量"
              />
            </label>
            <label className="c2c-modal-field">
              <span>出售单价（USDT）</span>
              <input
                type="number"
                min={guideMinPrice > 0n ? formatUnits(guideMinPrice, 18) : "0"}
                max={guideMaxPrice > 0n ? formatUnits(guideMaxPrice, 18) : undefined}
                step="0.000001"
                value={sellPrice}
                onChange={(event) => setSellPrice(event.target.value)}
                placeholder="请输入出售单价"
              />
            </label>

            <div className="c2c-modal-actions">
              <button type="button" className="c2c-btn c2c-btn-ghost" onClick={() => setIsModalOpen(false)}>取消</button>
              <button type="submit" className="c2c-btn c2c-btn-primary" disabled={actionKey === "create-order"}>
                {actionKey === "create-order" ? "提交中..." : "确定"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={toastMessage ? "c2c-toast is-show" : "c2c-toast"}>{toastMessage}</div>
    </C2CPageFrame>
  );
}
