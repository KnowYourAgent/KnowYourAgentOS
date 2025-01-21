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

import { PublicKey } from '@solana/web3.js';
import { logger } from '../../lib/logger';
import { SolanaNetworkService } from './network';

export class SolanaSubscriber {
  private subscriptionIds: Map<string, number> = new Map();

  constructor(private readonly networkService: SolanaNetworkService) {}

  async subscribeToProgram(programId: string, callback: (logs: any) => void): Promise<void> {
    try {
      const wsConnection = this.networkService.getWsConnection();
      if (!wsConnection) {
        throw new Error('WebSocket connection not available');
      }

      const pubkey = new PublicKey(programId);
      const id = wsConnection.onLogs(
        pubkey,
        (logs) => {
          logger.info(`Received logs from program ${programId}`, logs);
          callback(logs);
        },
        'confirmed'
      );

      this.subscriptionIds.set(programId, id);
      logger.info(`Subscribed to program ${programId} with ID ${id}`);
    } catch (error) {
      logger.error(`Error subscribing to program ${programId}:`, error);
      throw error;
    }
  }

  unsubscribeFromProgram(programId: string): void {
    const id = this.subscriptionIds.get(programId);
    if (id !== undefined) {
      const wsConnection = this.networkService.getWsConnection();
      if (wsConnection) {
        wsConnection.removeOnLogsListener(id);
        this.subscriptionIds.delete(programId);
        logger.info(`Unsubscribed from program ${programId}`);
      }
    }
  }

  unsubscribeAll(): void {
    const wsConnection = this.networkService.getWsConnection();
    if (wsConnection) {
      this.subscriptionIds.forEach((id, programId) => {
        wsConnection.removeOnLogsListener(id);
        logger.info(`Unsubscribed from program ${programId}`);
      });
      this.subscriptionIds.clear();
    }
  }
} 