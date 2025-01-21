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

export interface TaskResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TaskContext {
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface BaseTask<T = any> {
  id: string;
  name: string;
  description: string;
  execute(context: TaskContext): Promise<TaskResult<T>>;
} 