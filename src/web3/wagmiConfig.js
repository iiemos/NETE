import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});
