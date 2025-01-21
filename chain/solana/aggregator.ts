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

import { PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { logger } from '../../lib/logger';
import { SolanaNetworkService } from './network';
import { TransactionData, TokenTransfer, ProgramActivity } from './types';

export class SolanaDataAggregator {
  constructor(private readonly networkService: SolanaNetworkService) {}

  async getRecentTransactions(limit = 100): Promise<TransactionData[]> {
    try {
      const connection = this.networkService.getConnection();
      const signatures = await connection.getSignaturesForAddress(
        new PublicKey('11111111111111111111111111111111'), // System Program
        { limit }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });
          
          if (!tx) return null;

          return {
            signature: sig.signature,
            slot: sig.slot,
            timestamp: sig.blockTime || 0,
            success: tx.meta?.err === null,
            fee: tx.meta?.fee || 0,
            logs: tx.meta?.logMessages || [],
            rawTransaction: tx
          };
        })
      );

      return transactions.filter((tx): tx is TransactionData => tx !== null);
    } catch (error) {
      logger.error('Error fetching recent transactions:', error);
      throw error;
    }
  }

  async getProgramActivity(programId: string, timeWindow = 3600): Promise<ProgramActivity> {
    try {
      const connection = this.networkService.getConnection();
      const pubkey = new PublicKey(programId);
      
      const signatures = await connection.getSignaturesForAddress(
        pubkey,
        { limit: 1000 }
      );

      const uniqueUsers = new Set<string>();
      let instructionCount = 0;

      signatures.forEach(sig => {
        if (sig.memo) uniqueUsers.add(sig.memo);
      });

      return {
        programId,
        instructionCount: signatures.length,
        uniqueUsers: Array.from(uniqueUsers),
        timestamp: Date.now()
      };
    } catch (error) {
      logger.error('Error fetching program activity:', error);
      throw error;
    }
  }

  private parseTokenTransfers(transaction: ParsedTransactionWithMeta): TokenTransfer[] {
    // TODO: Implement token transfer parsing logic
    return [];
  }
} 