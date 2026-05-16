import { useCallback, useEffect, useRef } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { NETE_CHAIN_ID } from "../config/neteRuntime";
import { shortAddress } from "../utils/formatters";

function createNoProviderError() {
  const error = new Error("暂无可用钱包连接方式");
  error.code = "NO_PROVIDER";
  return error;
}

export function useWalletConnector() {
  const account = useAccount();
  const {
    connectors,
    connectAsync,
    isPending: connectPending,
    variables: connectVariables,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const latestAddressRef = useRef(account.address || "");

  const currentAddress = account.address;
  const isConnected = account.isConnected;
  const isWrongChain = isConnected && account.chainId !== NETE_CHAIN_ID;
  const isConnecting = connectPending || account.status === "connecting" || account.status === "reconnecting";

  useEffect(() => {
    latestAddressRef.current = currentAddress || "";
  }, [currentAddress]);

  const waitForConnectedAddress = useCallback(async () => {
    if (typeof window === "undefined") return "";

    return new Promise((resolve) => {
      const startedAt = Date.now();
      const timeoutMs = 20_000;
      const timer = window.setInterval(() => {
        const current = latestAddressRef.current;
        if (current) {
          window.clearInterval(timer);
          resolve(current);
          return;
        }

        if (Date.now() - startedAt >= timeoutMs) {
          window.clearInterval(timer);
          resolve("");
        }
      }, 200);
    });
  }, []);

  async function connectWallet(connector) {
    if (latestAddressRef.current) {
      return latestAddressRef.current;
    }

    const targetConnector = connector || connectors[0];
    if (!targetConnector) {
      throw createNoProviderError();
    }

    const result = await connectAsync({ connector: targetConnector, chainId: NETE_CHAIN_ID });
    const connectedAccount = result.accounts?.[0];
    if (typeof connectedAccount === "string") return connectedAccount;
    if (connectedAccount?.address) return connectedAccount.address;

    return waitForConnectedAddress();
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
    connectors,
    connectingConnectorUid: connectVariables?.connector?.uid || "",
    connectWallet,
    disconnectWallet,
    ensureCorrectChain,
    connectorName: account.connector?.name || "",
    chainId: account.chainId,
  };
}
