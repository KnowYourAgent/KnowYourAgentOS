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

import { Tool } from '../interfaces/Tool';
import { logger } from '../../lib/logger';

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, Tool> = new Map();

  private constructor() {}

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  registerTool(tool: Tool): void {
    if (this.tools.has(tool.id)) {
      logger.warn(`Tool with ID ${tool.id} already exists. Overwriting...`);
    }
    this.tools.set(tool.id, tool);
    logger.info(`Registered tool: ${tool.id}`);
  }

  getTool(toolId: string): Tool | undefined {
    return this.tools.get(toolId);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  unregisterTool(toolId: string): boolean {
    const removed = this.tools.delete(toolId);
    if (removed) {
      logger.info(`Unregistered tool: ${toolId}`);
    }
    return removed;
  }
} 