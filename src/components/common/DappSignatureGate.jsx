import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useSignMessage } from "wagmi";
import { NETE_CHAIN_ID } from "../../config/neteRuntime";
import { useWalletConnector } from "../../hooks/useWalletConnector";
import { getWalletErrorMessage } from "../../utils/walletErrors";
import { useGlobalMessage } from "./GlobalMessage";

const SIGNATURE_STORAGE_PREFIX = "nete-dapp-signature";
const PUBLIC_PATHS = new Set(["/", "/landing"]);

function getSignatureKey(address) {
  return `${SIGNATURE_STORAGE_PREFIX}:${NETE_CHAIN_ID}:${String(address || "").toLowerCase()}`;
}

function readSigned(address) {
  if (!address || typeof window === "undefined") return false;
  return window.sessionStorage.getItem(getSignatureKey(address)) === "1";
}

function writeSigned(address) {
  if (!address || typeof window === "undefined") return;
  window.sessionStorage.setItem(getSignatureKey(address), "1");
}

export default function DappSignatureGate() {
  const { t } = useTranslation();
  const location = useLocation();
  const wallet = useWalletConnector();
  const message = useGlobalMessage();
  const { signMessageAsync, isPending } = useSignMessage();
  const [signed, setSigned] = useState(() => readSigned(wallet.currentAddress));
  const isDappPath = !PUBLIC_PATHS.has(location.pathname);

  const signatureText = useMemo(() => [
    "NETE DApp Access",
    `Address: ${wallet.currentAddress || ""}`,
    `Chain ID: ${NETE_CHAIN_ID}`,
    "Sign this message to enter NETE DApp.",
  ].join("\n"), [wallet.currentAddress]);

  useEffect(() => {
    setSigned(readSigned(wallet.currentAddress));
  }, [wallet.currentAddress]);

  const handleSign = async () => {
    try {
      await wallet.ensureCorrectChain();
      await signMessageAsync({ message: signatureText });
      writeSigned(wallet.currentAddress);
      setSigned(true);
      message.success(t("common.dappSignature.success"));
    } catch (error) {
      message.error(getWalletErrorMessage(error, t, "common.dappSignature.failed"));
    }
  };

  if (!isDappPath || !wallet.isConnected || signed) return null;

  return (
    <div className="fixed inset-0 z-[660] flex items-center justify-center bg-black/[0.78] p-4 backdrop-blur-sm" role="presentation">
      <article className="w-full max-w-[420px] rounded-[20px] border border-white/10 bg-[#111713] p-5 text-white shadow-[0_26px_80px_rgba(0,0,0,0.58)]" role="dialog" aria-modal="true" aria-label={t("common.dappSignature.title")}>
        <p className="module-eyebrow">NETE ACCESS</p>
        <h2 className="mt-3 font-display text-xl font-black text-white">{t("common.dappSignature.title")}</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">{t("common.dappSignature.desc")}</p>
        <div className="mt-5 grid gap-3">
          <button
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#caff00] px-5 text-sm font-semibold tracking-wide text-black transition disabled:cursor-not-allowed disabled:opacity-45"
            type="button"
            disabled={isPending || wallet.isSwitching}
            onClick={handleSign}
          >
            {isPending || wallet.isSwitching ? t("common.dappSignature.signing") : t("common.dappSignature.action")}
          </button>
          <button className="text-sm font-semibold text-white/[0.62] transition hover:text-white" type="button" onClick={wallet.disconnectWallet}>
            {t("nav.wallet.disconnect")}
          </button>
        </div>
      </article>
    </div>
  );
}
