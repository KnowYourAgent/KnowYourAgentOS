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

import { TaskResult } from '../types';
import { z } from 'zod';

export function validateTaskResult<T>(result: TaskResult<T>, schema: z.ZodType<T>): TaskResult<T> {
  if (!result.success || !result.data) {
    return result;
  }

  try {
    const validatedData = schema.parse(result.data);
    return { ...result, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: `Validation failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export const commonSchemas = {
  blockchainData: z.object({
    chain: z.string(),
    blockNumber: z.number(),
    timestamp: z.number(),
    transactions: z.array(z.any())
  }),
  
  anomaly: z.object({
    id: z.string(),
    type: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    timestamp: z.number(),
    description: z.string()
  }),

  insight: z.object({
    id: z.string(),
    type: z.string(),
    content: z.any().optional(),
    timestamp: z.number(),
    source: z.string()
  })
}; 