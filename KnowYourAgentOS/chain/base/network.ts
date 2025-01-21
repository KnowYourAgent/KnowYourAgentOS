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
import { logger } from '../../lib/logger';
import { BaseConfig, NetworkStats } from './types';

export class BaseNetworkService {
  private provider: ethers.providers.JsonRpcProvider;
  private wsProvider?: ethers.providers.WebSocketProvider;
  private readonly config: BaseConfig;

  constructor(config?: Partial<BaseConfig>) {
    this.config = {
      rpcUrl: config?.rpcUrl || process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      wsUrl: config?.wsUrl || process.env.BASE_WS_URL,
      chainId: config?.chainId || 8453,
      networkName: config?.networkName || 'mainnet'
    };

    this.provider = new ethers.providers.JsonRpcProvider(this.config.rpcUrl);

    if (this.config.wsUrl) {
      this.wsProvider = new ethers.providers.WebSocketProvider(this.config.wsUrl);
    }
  }

  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const [blockNumber, gasPrice, block] = await Promise.all([
        this.provider.getBlockNumber(),
        this.provider.getGasPrice(),
        this.provider.getBlock('latest')
      ]);

      return {
        blockNumber,
        gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
        blockTime: block.timestamp,
        tps: 0 // TODO: Calculate TPS from recent blocks
      };
    } catch (error) {
      logger.error('Error fetching Base network stats:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber > 0;
    } catch (error) {
      logger.error('Base node health check failed:', error);
      return false;
    }
  }

  getProvider(): ethers.providers.JsonRpcProvider {
    return this.provider;
  }

  getWsProvider(): ethers.providers.WebSocketProvider | undefined {
    return this.wsProvider;
  }
} 