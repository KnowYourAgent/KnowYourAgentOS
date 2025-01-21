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

import { TaskRegistry } from '../../tasks/registry';
import { TaskContext, TaskResult } from '../../tasks/types';
import { logger } from '../../lib/logger';
import { InsightGenerator, BlockchainData, Anomaly } from '../interfaces/InsightGenerator';
import { Insight } from '../entities/Insight';

export class TaskManagerService implements InsightGenerator {
  private taskRegistry: TaskRegistry;

  constructor() {
    this.taskRegistry = TaskRegistry.getInstance();
  }

  async pullBlockchainData(): Promise<BlockchainData> {
    const context: TaskContext = {
      timestamp: Date.now(),
      metadata: {
        chain: 'all',
        timeWindow: 3600
      }
    };

    const result = await this.taskRegistry.executeTask<BlockchainData>('blockchain-data', context);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to pull blockchain data');
    }
    return result.data;
  }

  async detectAnomalies(data: BlockchainData): Promise<Anomaly[]> {
    const context: TaskContext = {
      timestamp: Date.now(),
      metadata: {
        data,
        thresholds: {
          // Configure anomaly detection parameters
        }
      }
    };

    const result = await this.taskRegistry.executeTask<Anomaly[]>('anomaly-detection', context);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to detect anomalies');
    }
    return result.data;
  }

  async generateStructuredInsights(anomalies: Anomaly[]): Promise<Insight[]> {
    const context: TaskContext = {
      timestamp: Date.now(),
      metadata: {
        anomalies,
        format: 'structured'
      }
    };

    const result = await this.taskRegistry.executeTask<Insight[]>('insight-generation', context);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to generate insights');
    }
    return result.data;
  }

  async executeTask<T>(taskId: string, metadata: Record<string, any> = {}): Promise<TaskResult<T>> {
    const context: TaskContext = {
      timestamp: Date.now(),
      metadata
    };

    return this.taskRegistry.executeTask<T>(taskId, context);
  }
} 