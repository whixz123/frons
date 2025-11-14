"use client";

import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import fronsIdl from "../idl/frons.json";

export type FronsIdl = typeof fronsIdl & Idl;

export const FRONS_PROGRAM_ID = new PublicKey(fronsIdl.metadata.address);
export const USER_PROFILE_SEED = "user_profile";
export const SESSION_SEED = "session";

export type SessionKind = "focus" | "rest" | "cancelled";

type AnchorCompatibleWallet = {
  publicKey: PublicKey;
  signAllTransactions: WalletContextState["signAllTransactions"];
  signTransaction: WalletContextState["signTransaction"];
};

export function isAnchorWallet(wallet: WalletContextState): wallet is WalletContextState & AnchorCompatibleWallet {
  return Boolean(wallet.publicKey && wallet.signAllTransactions && wallet.signTransaction);
}

export function buildProvider(connection: Connection, wallet: WalletContextState | null): AnchorProvider | null {
  if (!wallet || !isAnchorWallet(wallet)) {
    return null;
  }
  return new AnchorProvider(
    connection,
    wallet as unknown as AnchorProvider["wallet"],
    AnchorProvider.defaultOptions()
  );
}

export function getFronsProgram(connection: Connection, wallet: WalletContextState | null): Program<FronsIdl> | null {
  const provider = buildProvider(connection, wallet);
  if (!provider) {
    return null;
  }
  return new Program(fronsIdl as FronsIdl, FRONS_PROGRAM_ID, provider);
}

export function deriveUserProfilePda(authority: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(USER_PROFILE_SEED), authority.toBuffer()],
    FRONS_PROGRAM_ID
  );
}

export function deriveSessionPda(authority: PublicKey, index: bigint): [PublicKey, number] {
  const indexBuffer = Buffer.alloc(8);
  indexBuffer.writeBigInt64LE(index);
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SESSION_SEED), authority.toBuffer(), indexBuffer],
    FRONS_PROGRAM_ID
  );
}

export async function initializeUserIfNeeded(program: Program<FronsIdl>): Promise<void> {
  const authority = program.provider.publicKey;
  if (!authority) {
    throw new Error("Wallet not connected");
  }
  const [userProfile] = deriveUserProfilePda(authority);
  try {
    await program.account.userProfile.fetch(userProfile);
  } catch (error) {
    await program.methods
      .initializeUser()
      .accounts({
        authority,
        userProfile,
        systemProgram: SystemProgram.programId
      })
      .rpc();
  }
}

export async function recordSession(
  program: Program<FronsIdl>,
  params: {
    kind: SessionKind;
    startTs: number;
    endTs: number | null;
    plannedDurationSeconds: number;
    fronTokenAccount?: PublicKey | null;
  }
): Promise<void> {
  const authority = program.provider.publicKey;
  if (!authority) {
    throw new Error("Wallet not connected");
  }
  const userProfileAccount = await program.account.userProfile.fetchNullable(
    deriveUserProfilePda(authority)[0]
  );
  if (!userProfileAccount) {
    throw new Error("User profile not initialized");
  }
  const sessionIndex = BigInt(userProfileAccount.sessionCount);
  const [sessionPda] = deriveSessionPda(authority, sessionIndex);
  const remainingAccounts = params.fronTokenAccount
    ? [
        {
          pubkey: params.fronTokenAccount,
          isSigner: false,
          isWritable: false
        }
      ]
    : [];

  const kindStruct = toSessionKindStruct(params.kind);

  await program.methods
    .recordSession(
      kindStruct,
      new BN(params.startTs),
      params.endTs ? new BN(params.endTs) : null,
      new BN(params.plannedDurationSeconds)
    )
    .accounts({
      authority,
      userProfile: deriveUserProfilePda(authority)[0],
      session: sessionPda,
      systemProgram: SystemProgram.programId
    })
    .remainingAccounts(remainingAccounts)
    .rpc();
}

function toSessionKindStruct(kind: SessionKind) {
  switch (kind) {
    case "focus":
      return { focus: {} };
    case "rest":
      return { rest: {} };
    case "cancelled":
    default:
      return { cancelled: {} };
  }
}
