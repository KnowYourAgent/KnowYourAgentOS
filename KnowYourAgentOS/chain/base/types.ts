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

import { ethers } from 'ethers';

export interface BaseConfig {
  rpcUrl: string;
  wsUrl?: string;
  chainId: number;
  networkName: 'mainnet' | 'goerli' | 'local';
}

export interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  blockTime: number;
  tps: number;
}

export interface TransactionData {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasLimit: string;
  gasUsed: string;
  input: string;
  status: boolean;
  logs: ethers.providers.Log[];
  rawTransaction: ethers.providers.TransactionResponse;
  rawReceipt: ethers.providers.TransactionReceipt;
}

export interface TokenTransfer {
  tokenAddress: string;
  from: string;
  to: string;
  amount: string;
  decimals: number;
  symbol: string;
}

export interface ContractActivity {
  address: string;
  methodCalls: {
    signature: string;
    count: number;
  }[];
  uniqueUsers: string[];
  timestamp: number;
} 