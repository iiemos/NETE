import { bsc, bscTestnet } from "wagmi/chains";

const SUPPORTED_CHAINS = {
  [bsc.id]: bsc,
  [bscTestnet.id]: bscTestnet,
};

function normalizeBasePath(path) {
  if (!path) return "/nete";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

function normalizeAddress(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim();
}

const configuredChainId = Number(import.meta.env.VITE_NETE_CHAIN_ID || bscTestnet.id);

export const NETE_CHAIN = SUPPORTED_CHAINS[configuredChainId] ?? bscTestnet;
export const NETE_CHAIN_ID = NETE_CHAIN.id;

export const NETE_API_BASE = normalizeBasePath(import.meta.env.VITE_NETE_API_BASE || "/nete");

export const NETE_CONTRACTS = {
  neteToken: normalizeAddress(import.meta.env.VITE_NETE_TOKEN_ADDRESS),
  neteCore: normalizeAddress(import.meta.env.VITE_NETE_CORE_ADDRESS),
  neteNetwork: normalizeAddress(import.meta.env.VITE_NETE_NETWORK_ADDRESS),
  neteMarket: normalizeAddress(import.meta.env.VITE_NETE_MARKET_ADDRESS),
  usdt: normalizeAddress(import.meta.env.VITE_NETE_USDT_ADDRESS),
};

const CONTRACT_ENV_KEYS = {
  neteToken: "VITE_NETE_TOKEN_ADDRESS",
  neteCore: "VITE_NETE_CORE_ADDRESS",
  neteNetwork: "VITE_NETE_NETWORK_ADDRESS",
  neteMarket: "VITE_NETE_MARKET_ADDRESS",
  usdt: "VITE_NETE_USDT_ADDRESS",
};

export function getContractAddress(name) {
  return NETE_CONTRACTS[name] || "";
}

export function assertContractAddress(name) {
  const address = getContractAddress(name);
  if (!address) {
    const envKey = CONTRACT_ENV_KEYS[name] || name;
    throw new Error(`Missing contract address: ${name}. Please set ${envKey}.`);
  }
  return address;
}

export function isContractConfigReady() {
  return Object.values(NETE_CONTRACTS).every(Boolean);
}

export function getContractConfigMissingKeys() {
  return Object.entries(NETE_CONTRACTS)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}
