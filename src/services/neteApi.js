import { NETE_API_BASE } from "../config/neteRuntime";

function normalizePath(path) {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

function toApiUrl(path, query) {
  const normalizedPath = normalizePath(path).replace(/^\//, "");
  const base = NETE_API_BASE.startsWith("http")
    ? NETE_API_BASE
    : `${window.location.origin}${NETE_API_BASE}/`;
  const baseUrl = new URL(base.endsWith("/") ? base : `${base}/`);
  const url = new URL(normalizedPath, baseUrl);

  if (query && typeof query === "object") {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return NETE_API_BASE.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`;
}

function toBigIntValue(value) {
  if (typeof value === "bigint") return value;
  if (value === undefined || value === null || value === "") return 0n;
  try {
    return BigInt(String(value));
  } catch {
    return 0n;
  }
}

function toUnixSeconds(value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric > 1_000_000_000_000 ? Math.floor(numeric / 1000) : Math.floor(numeric);
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : 0;
}

async function request(path, { method = "GET", query, body } = {}) {
  const response = await fetch(toApiUrl(path, query), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const detail = data?.message || data?.error || `HTTP ${response.status}`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.prototype.hasOwnProperty.call(data, "data") &&
    data.data !== null &&
    data.data !== undefined
  ) {
    return data.data;
  }

  return data;
}

export async function getRuntimeConfig() {
  return request("/v1/config/runtime");
}

export async function getPublicOrders({ page = 1, pageSize = 20 } = {}) {
  return request("/v1/orders/public", {
    query: { page, page_size: pageSize },
  });
}

export async function getMySellOrders(user, { page = 1, pageSize = 20 } = {}) {
  return request(`/v1/orders/public/${user}`, {
    query: { page, page_size: pageSize },
  });
}

export async function getMyTakenOrders(user, { page = 1, pageSize = 20 } = {}) {
  return request(`/v1/orders/taken/${user}`, {
    query: { page, page_size: pageSize },
  });
}

export async function getOrderDetail(orderId) {
  return request(`/v1/orders/${orderId}`);
}

export async function getOrderByShortNo(shortNo) {
  return request(`/v1/orders/by-short/${shortNo}`);
}

export async function getReferralInfo(user) {
  return request("/v1/referral/info", { query: { user } });
}

export async function getReferralDirects(user, { page = 1, pageSize = 50, type } = {}) {
  return request("/v1/referral/directs", {
    query: { user, page, page_size: pageSize, type },
  });
}

export async function getReferralDownlines(user) {
  return request("/v1/referral/downlines", { query: { user } });
}

export async function getPersonalPerformance(user) {
  return request("/v1/performance/personal", { query: { user } });
}

export async function getPerformanceLegs(user) {
  return request("/v1/performance/legs", { query: { user } });
}

export async function getPresaleRecords(user, { page = 1, pageSize = 20 } = {}) {
  const path = user ? `/v1/presale/records/${user}` : "/v1/presale/records";
  return request(path, {
    query: { page, page_size: pageSize },
  });
}

export async function getCheckInRecords(user, { page = 1, pageSize = 500 } = {}) {
  const data = await request("/v1/checkin/records", {
    query: { user, page, page_size: pageSize },
  });
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  return items
    .map((item, index) => {
      const transactionHash = String(item.tx_hash ?? item.txHash ?? item.transactionHash ?? "");
      const logIndex = item.log_index ?? item.logIndex ?? index;

      return {
        id: `${transactionHash || "checkin"}-${logIndex}`,
        amount: toBigIntValue(item.amount),
        checkinAt: toUnixSeconds(item.checkin_at ?? item.checkinAt ?? item.created_at ?? item.createdAt),
        transactionHash,
      };
    })
    .filter((item) => item.checkinAt > 0)
    .sort((a, b) => b.checkinAt - a.checkinAt);
}

export async function getIncomeOverview(user) {
  return request("/v1/income/overview", { query: { user } });
}

export async function getIncomeLedger(user, { page = 1, pageSize = 20 } = {}) {
  return request("/v1/income/ledger", {
    query: { user, page, page_size: pageSize },
  });
}

export async function getClaimMessage(type, payload) {
  if (!["referral", "dividend", "v9"].includes(type)) {
    throw new Error("Invalid claim type");
  }
  return request(`/v1/${type}/claim-message`, {
    method: "POST",
    body: payload,
  });
}
