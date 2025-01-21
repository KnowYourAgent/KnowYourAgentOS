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

import { Tool, ToolResult } from '../interfaces/Tool';
import { WorkflowConfig, WorkflowToolConfig } from '../interfaces/WorkflowConfig';
import { logger } from '../../lib/logger';
import { Anomaly, AnomalyType } from '../interfaces/InsightGenerator';
import { ToolRegistry } from './ToolRegistry';

export class WorkflowEngine {
  private toolRegistry: ToolRegistry;
  private invocationCounts: Map<string, { count: number; resetTime: number }>;

  constructor(private readonly config: WorkflowConfig) {
    this.toolRegistry = ToolRegistry.getInstance();
    this.invocationCounts = new Map();
  }

  async processAnomaly(anomaly: Anomaly): Promise<Record<string, any>> {
    try {
      const eligibleTools = this.getEligibleTools(anomaly);
      const context: Record<string, any> = {};

      if (this.config.parallelExecution) {
        const results = await Promise.all(
          eligibleTools.map(toolConfig => this.executeToolWithConfig(toolConfig, anomaly))
        );
        results.forEach((result, index) => {
          if (result?.success) context[eligibleTools[index].id] = result.data;
        });
      } else {
        for (const toolConfig of eligibleTools) {
          const result = await this.executeToolWithConfig(toolConfig, anomaly);
          if (result?.success) context[toolConfig.id] = result.data;
        }
      }

      return context;
    } catch (error) {
      logger.error('Error processing anomaly:', error);
      throw error;
    }
  }

  private getEligibleTools(anomaly: Anomaly): WorkflowToolConfig[] {
    return this.config.tools
      .filter(tool => {
        if (!tool.enabled) return false;
        
        return tool.conditions.anomalyTypes.includes(anomaly.type) &&
          this.checkSeverity(tool, anomaly.severity) &&
          this.checkRequiredFields(tool, anomaly);
      })
      .sort((a, b) => a.priority - b.priority)
      .slice(0, this.config.maxToolsPerAnomaly);
  }

  private async executeToolWithConfig(toolConfig: WorkflowToolConfig, anomaly: Anomaly): Promise<ToolResult> {
    const tool = this.toolRegistry.getTool(toolConfig.id);
    if (!tool || !this.checkRateLimit(toolConfig)) {
      return { success: false, error: 'Tool not available or rate limited' };
    }

    try {
      const params = this.buildToolParams(anomaly, toolConfig);
      const result = await tool.execute(params);
      this.updateInvocationCount(toolConfig);
      return result;
    } catch (error) {
      logger.error(`Error executing tool ${toolConfig.id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private checkRateLimit(toolConfig: WorkflowToolConfig): boolean {
    if (!toolConfig.rateLimit) return true;

    const counts = this.invocationCounts.get(toolConfig.id);
    if (!counts) return true;

    const now = Date.now();
    if (now > counts.resetTime) {
      this.invocationCounts.delete(toolConfig.id);
      return true;
    }

    return counts.count < toolConfig.rateLimit.maxInvocations;
  }

  private updateInvocationCount(toolConfig: WorkflowToolConfig): void {
    if (!toolConfig.rateLimit) return;

    const now = Date.now();
    const counts = this.invocationCounts.get(toolConfig.id) || {
      count: 0,
      resetTime: now + toolConfig.rateLimit.periodInMinutes * 60 * 1000
    };

    counts.count++;
    this.invocationCounts.set(toolConfig.id, counts);
  }

  private checkSeverity(tool: WorkflowToolConfig, severity: Anomaly['severity']): boolean {
    if (!tool.conditions.minSeverity) return true;
    const values = { low: 0, medium: 1, high: 2 };
    return values[severity] >= values[tool.conditions.minSeverity];
  }

  private checkRequiredFields(tool: WorkflowToolConfig, obj: any): boolean {
    if (!tool.conditions.requiredFields) return true;
    return tool.conditions.requiredFields.every(field => 
      field.split('.').reduce((o, i) => o && o[i], obj) !== undefined
    );
  }

  private buildToolParams(anomaly: Anomaly, toolConfig: WorkflowToolConfig): Record<string, any> {
    return {
      ...anomaly, // Include all anomaly fields first
      anomalyId: anomaly.id,
      anomalyType: anomaly.type,
    };
  }
} 