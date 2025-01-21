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

import { BaseTask, TaskContext, TaskResult } from '../types';
import { logger } from '../../lib/logger';
import { withRetry } from '../utils/retry';
import { validateTaskResult, commonSchemas } from '../utils/validation';
import { Anomaly, AnomalyType } from '../../domain/interfaces/InsightGenerator';
import { Insight } from '../../domain/entities/Insight';
import { z } from 'zod';

export class InsightGeneratorTask implements BaseTask<Insight[]> {
  id = 'insight-generation';
  name = 'Blockchain Insight Generator';
  description = 'Generates structured insights from blockchain anomalies';

  async execute(context: TaskContext): Promise<TaskResult<Insight[]>> {
    try {
      const anomalies = context.metadata?.anomalies as Anomaly[];
      if (!anomalies?.length) {
        return {
          success: false,
          error: 'No anomalies provided'
        };
      }

      const result = await withRetry(async () => {
        // Implement actual insight generation logic
        const insights: Insight[] = anomalies.map(anomaly => ({
          id: `insight-${Date.now()}`,
          type: 'blockchain-anomaly',
          content: anomaly,
          timestamp: Date.now(),
          source: 'blockchain-analyzer'
        }));

        return {
          success: true,
          data: insights
        };
      });

      return validateTaskResult(result, z.array(commonSchemas.insight));
    } catch (error) {
      logger.error('InsightGenerator task failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 