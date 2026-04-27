import { createConfig, http } from "wagmi";
import { bsc, bscTestnet, mainnet } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, bscTestnet],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});
