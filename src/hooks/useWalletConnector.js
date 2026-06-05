import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { NETE_CHAIN_ID } from "../config/neteRuntime";
import { shortAddress } from "../utils/formatters";

const CONNECT_TIMEOUT_MS = 15_000;
const RECONNECT_VISIBLE_MS = 4_500;
const SWITCH_TIMEOUT_MS = 12_000;

function createNoProviderError() {
  const error = new Error("暂无可用钱包连接方式");
  error.code = "NO_PROVIDER";
  return error;
}

function createWalletTimeoutError(message) {
  const error = new Error(message);
  error.code = "WALLET_TIMEOUT";
  return error;
}

function withTimeout(promise, timeoutMs, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = window.setTimeout(() => reject(createWalletTimeoutError(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
}

export function useWalletConnector() {
  const account = useAccount();
  const {
    connectors,
    connectAsync,
    isPending: connectPending,
    variables: connectVariables,
    reset: resetConnect,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: switchPending, reset: resetSwitchChain } = useSwitchChain();
  const latestAddressRef = useRef(account.address || "");
  const [connectTimedOut, setConnectTimedOut] = useState(false);
  const [reconnectTimedOut, setReconnectTimedOut] = useState(false);
  const [switchTimedOut, setSwitchTimedOut] = useState(false);

  const currentAddress = account.address;
  const isConnected = account.isConnected;
  const isWrongChain = isConnected && account.chainId !== NETE_CHAIN_ID;
  const connectBusy = connectPending || account.status === "connecting";
  const reconnectBusy = account.status === "reconnecting";
  const isConnecting = (connectBusy && !connectTimedOut) || (reconnectBusy && !reconnectTimedOut);
  const isSwitching = switchPending && !switchTimedOut;

  useEffect(() => {
    if (!connectBusy) {
      setConnectTimedOut(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setConnectTimedOut(true);
      resetConnect?.();
    }, CONNECT_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [connectBusy, resetConnect]);

  useEffect(() => {
    if (!reconnectBusy) {
      setReconnectTimedOut(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setReconnectTimedOut(true), RECONNECT_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [reconnectBusy]);

  useEffect(() => {
    if (!switchPending) {
      setSwitchTimedOut(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSwitchTimedOut(true);
      resetSwitchChain?.();
    }, SWITCH_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [resetSwitchChain, switchPending]);

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

    setConnectTimedOut(false);
    const result = await withTimeout(
      connectAsync({ connector: targetConnector, chainId: NETE_CHAIN_ID }),
      CONNECT_TIMEOUT_MS,
      "Wallet connection timeout",
    ).catch((error) => {
      if (error?.code === "WALLET_TIMEOUT") {
        resetConnect?.();
      }
      throw error;
    });
    const connectedAccount = result.accounts?.[0];
    if (typeof connectedAccount === "string") return connectedAccount;
    if (connectedAccount?.address) return connectedAccount.address;

    return waitForConnectedAddress();
  }

  async function ensureCorrectChain() {
    if (isConnected && account.chainId !== NETE_CHAIN_ID) {
      setSwitchTimedOut(false);
      await withTimeout(
        switchChainAsync({ chainId: NETE_CHAIN_ID }),
        SWITCH_TIMEOUT_MS,
        "Wallet switch chain timeout",
      ).catch((error) => {
        if (error?.code === "WALLET_TIMEOUT") {
          resetSwitchChain?.();
        }
        throw error;
      });
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
