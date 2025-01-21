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

import { BaseTask, TaskContext, TaskResult } from './types';
import { logger } from '../lib/logger';

export class TaskRegistry {
  private static instance: TaskRegistry;
  private tasks: Map<string, BaseTask> = new Map();

  private constructor() {}

  static getInstance(): TaskRegistry {
    if (!TaskRegistry.instance) {
      TaskRegistry.instance = new TaskRegistry();
    }
    return TaskRegistry.instance;
  }

  registerTask(task: BaseTask): void {
    if (this.tasks.has(task.id)) {
      logger.warn(`Task with ID ${task.id} already exists. Overwriting...`);
    }
    this.tasks.set(task.id, task);
    logger.info(`Registered task: ${task.id}`);
  }

  async executeTask<T>(taskId: string, context: TaskContext): Promise<TaskResult<T>> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: `Task ${taskId} not found`
      };
    }

    try {
      return await task.execute(context) as TaskResult<T>;
    } catch (error) {
      logger.error(`Task ${taskId} execution failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getTask(taskId: string): BaseTask | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): BaseTask[] {
    return Array.from(this.tasks.values());
  }
} 