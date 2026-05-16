import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { coinbaseWallet, injected, metaMask, walletConnect } from "wagmi/connectors";
import { NETE_CHAIN } from "../config/neteRuntime";

const chains = NETE_CHAIN.id === bsc.id ? [bsc, bscTestnet] : [bscTestnet, bsc];
const bscRpcUrl = import.meta.env.VITE_BSC_RPC_URL;
const bscTestnetRpcUrl = import.meta.env.VITE_BSC_TESTNET_RPC_URL;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const appName = "NETE";
const metadata = {
  name: appName,
  description: "NETE",
  url: typeof window === "undefined" ? "https://nete.io" : window.location.origin,
  icons: [],
};

const connectors = [
  injected({ shimDisconnect: true }),
  metaMask({ dappMetadata: { name: appName } }),
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
