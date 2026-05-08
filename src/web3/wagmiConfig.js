import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { NETE_CHAIN } from "../config/neteRuntime";

const chains = NETE_CHAIN.id === bsc.id ? [bsc, bscTestnet] : [bscTestnet, bsc];
const bscRpcUrl = import.meta.env.VITE_BSC_RPC_URL;
const bscTestnetRpcUrl = import.meta.env.VITE_BSC_TESTNET_RPC_URL;

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [bsc.id]: http(bscRpcUrl || undefined),
    [bscTestnet.id]: http(bscTestnetRpcUrl || undefined),
  },
});
