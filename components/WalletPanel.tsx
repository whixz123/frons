"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import clsx from "clsx";

export function WalletPanel() {
  const { connected, publicKey } = useWallet();

  return (
    <section
      className={clsx(
        "border border-slate-800/60 bg-slate-900/60 backdrop-blur rounded-2xl p-6 flex flex-col md:flex-row",
        "md:items-center md:justify-between gap-4"
      )}
    >
      <div>
        <p className="text-sm text-slate-300">
          {connected
            ? "Wallet connected. Start a session to log productivity on-chain."
            : "Connect your wallet to start logging focus and rest pods."}
        </p>
        {publicKey && (
          <p className="mt-2 text-xs text-emerald-300/80 break-all">{publicKey.toBase58()}</p>
        )}
      </div>
      <WalletMultiButton className="wallet-adapter-button !bg-emerald-500 !text-slate-950 hover:!bg-emerald-400" />
    </section>
  );
}
