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

// domain/services/AgentService.ts
import { logger } from '../../lib/logger';
import { InsightGenerator } from '../interfaces/InsightGenerator';
import { WorkflowEngine } from './WorkflowEngine';
import { Insight } from '../entities/Insight';
import { Anomaly } from '../interfaces/InsightGenerator';
import workflowConfig from '../../config/workflow-design.json';
import { WorkflowConfig } from '../interfaces/WorkflowConfig';
import { TaskManagerService } from './TaskManagerService';

export class AgentService {
  private readonly workflowEngine: WorkflowEngine;
  private readonly taskManager: TaskManagerService;

  constructor(
    private readonly insightGenerator: InsightGenerator,
    taskManager: TaskManagerService
  ) {
    this.workflowEngine = new WorkflowEngine(workflowConfig as WorkflowConfig);
    this.taskManager = taskManager;
  }

  public async runAgentWorkflow(): Promise<any> {
    logger.info('Running agent workflow...');
    
    try {
      // Use taskManager for executing tasks
      const blockchainData = await this.taskManager.pullBlockchainData();
      const anomalies = await this.taskManager.detectAnomalies(blockchainData);
      
      const enrichedAnomalies = await Promise.all(
        anomalies.map(async (anomaly) => {
          const contextData = await this.gatherContext(anomaly);
          return { ...anomaly, context: contextData };
        })
      );

      // Generate insights using task-based approach
      const insights = await this.taskManager.generateStructuredInsights(enrichedAnomalies);
      
      // Execute any follow-up tasks (like messaging)
      if (insights.length > 0) {
        await this.taskManager.executeTask('messaging', {
          message: {
            content: JSON.stringify(insights),
            platform: 'discord',
            recipient: 'alerts-channel'
          }
        });
      }

      return insights;
    } catch (error) {
      logger.error('Error in agent workflow:', error);
      throw error;
    }
  }

  private async gatherContext(anomaly: Anomaly): Promise<Record<string, any>> {
    return this.workflowEngine.processAnomaly(anomaly);
  }
}