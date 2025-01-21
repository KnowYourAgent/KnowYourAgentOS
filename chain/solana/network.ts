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

import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js';
import { logger } from '../../lib/logger';
import { SolanaConfig, NetworkStats } from './types';

export class SolanaNetworkService {
  private connection: Connection;
  private wsConnection?: Connection;
  private readonly config: SolanaConfig;

  constructor(config?: Partial<SolanaConfig>) {
    this.config = {
      endpoint: config?.endpoint || process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'),
      commitment: config?.commitment || 'confirmed',
      wsEndpoint: config?.wsEndpoint
    };
    
    this.connection = new Connection(this.config.endpoint, {
      commitment: this.config.commitment,
      confirmTransactionInitialTimeout: 60000
    });

    if (this.config.wsEndpoint) {
      this.wsConnection = new Connection(this.config.wsEndpoint, {
        commitment: this.config.commitment,
        wsEndpoint: this.config.wsEndpoint
      });
    }
  }

  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const [slot, blockTime, blockHeight] = await Promise.all([
        this.connection.getSlot(),
        this.connection.getBlockTime(await this.connection.getSlot()),
        this.connection.getBlockHeight()
      ]);

      const recentPerformanceSamples = await this.connection.getRecentPerformanceSamples(1);
      const tps = recentPerformanceSamples[0]?.numTransactions || 0;

      return {
        currentSlot: slot,
        blockTime: blockTime || 0,
        blockHeight,
        tps
      };
    } catch (error) {
      logger.error('Error fetching Solana network stats:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const health = await this.connection.getBlockHeight();
      return health > 0;
    } catch (error) {
      logger.error('Solana node health check failed:', error);
      return false;
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWsConnection(): Connection | undefined {
    return this.wsConnection;
  }
} 