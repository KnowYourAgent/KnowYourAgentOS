/**
 * KnowYourAgentOS - AI Agent Playground For Web3
 * An open-source platform for building agents and community of versatile agents.
 * Helps developers and researchers assess agent capabilities, safety, and performance through
 * their on-chain and off-chain activities.
 * https://knowyouragent.xyz | https://x.com/know_your_agent
 * 
 * Copyright (c) 2025 KnowYourAgent
 * MIT License - Feel free to hack and share!
 * 
 * 
 * The full MIT license text can be found in the LICENSE file
 * in the root directory of this source tree.
 */

import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

export interface SolanaConfig {
  endpoint: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
  wsEndpoint?: string;
}

export interface NetworkStats {
  currentSlot: number;
  blockTime: number;
  blockHeight: number;
  tps: number;
}

export interface TransactionData {
  signature: string;
  slot: number;
  timestamp: number;
  success: boolean;
  fee: number;
  logs: string[];
  rawTransaction: ParsedTransactionWithMeta;
}

export interface TokenTransfer {
  tokenMint: string;
  from: string;
  to: string;
  amount: bigint;
  decimals: number;
}

export interface ProgramActivity {
  programId: string;
  instructionCount: number;
  uniqueUsers: string[];
  timestamp: number;
} 