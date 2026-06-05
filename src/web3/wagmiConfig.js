import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { NETE_CHAIN } from "../config/neteRuntime";

const chains = NETE_CHAIN.id === bsc.id ? [bsc, bscTestnet] : [bscTestnet, bsc];
const bscRpcUrl = import.meta.env.VITE_BSC_RPC_URL || "https://lingering-red-shard.bsc.quiknode.pro/be546097a87e94aefe6cc7a5672f3128438f9bf0/";
const bscTestnetRpcUrl = import.meta.env.VITE_BSC_TESTNET_RPC_URL;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const appName = "NETE";
const metadata = {
  name: appName,
  description: "NETE",
  url: typeof window === "undefined" ? "https://nete.io" : window.location.origin,
  icons: [],
};

function isTokenPocketRuntime() {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator?.userAgent?.toLowerCase() || "";
  const ethereum = window.ethereum;
  const providers = [
    ethereum,
    ...(Array.isArray(ethereum?.providers) ? ethereum.providers : []),
  ].filter(Boolean);

  return userAgent.includes("tokenpocket")
    || Boolean(window.tokenpocket || window.tp)
    || providers.some((provider) => provider.isTokenPocket || provider.isTokenPocketEthereum || provider.isTp);
}

const injectedConnectors = isTokenPocketRuntime()
  ? [injected({ shimDisconnect: true, unstable_shimAsyncInject: 1000 })]
  : [
      injected({ target: "metaMask", shimDisconnect: true, unstable_shimAsyncInject: 1000 }),
      injected({ shimDisconnect: true, unstable_shimAsyncInject: 1000 }),
    ];

const connectors = [
  ...injectedConnectors,
  coinbaseWallet({ appName }),
  ...(walletConnectProjectId
    ? [walletConnect({ projectId: walletConnectProjectId, metadata, showQrModal: true })]
    : []),
];

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [bsc.id]: http(bscRpcUrl || undefined),
    [bscTestnet.id]: http(bscTestnetRpcUrl || undefined),
  },
});
