import { useMemo } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect, useSwitchChain } from "wagmi";
import { NETE_CHAIN_ID } from "../config/neteRuntime";
import { shortAddress } from "../utils/formatters";

export function useWalletConnector() {
  const account = useAccount();
  const connectors = useConnectors();
  const { connectAsync, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const currentAddress = account.address;
  const isConnected = account.isConnected;
  const isWrongChain = isConnected && account.chainId !== NETE_CHAIN_ID;

  const preferredConnector = useMemo(() => connectors.find((item) => item.type !== "safe") || connectors[0], [connectors]);

  async function connectWallet() {
    if (!preferredConnector) {
      throw new Error("未检测到可用钱包插件");
    }
    await connectAsync({ connector: preferredConnector });
  }

  async function ensureCorrectChain() {
    if (isConnected && account.chainId !== NETE_CHAIN_ID) {
      await switchChainAsync({ chainId: NETE_CHAIN_ID });
    }
  }

  function disconnectWallet() {
    disconnect();
  }

  return {
    currentAddress,
    shortAddress: shortAddress(currentAddress),
    isConnected,
    isWrongChain,
    isConnecting,
    isSwitching,
    connectWallet,
    disconnectWallet,
    ensureCorrectChain,
    connectorName: account.connector?.name || "",
    chainId: account.chainId,
  };
}
