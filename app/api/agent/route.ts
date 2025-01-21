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

// app/api/agent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';
import { AgentService } from '../../../domain/services/AgentService';
import { TaskManagerService } from '@/domain/services/TaskManagerService';
import { initializeTasks } from '@/tasks/init';

// Initialize tasks on server startup
initializeTasks();

export async function GET(request: NextRequest) {
  try {
    logger.info('Agent orchestration triggered via GET');
    const taskManager = new TaskManagerService();
    const agentService = new AgentService(taskManager, taskManager);
    const insights = await agentService.runAgentWorkflow();
    return NextResponse.json({ insights });
  } catch (error) {
    logger.error('Error in agent orchestration', error);
    return NextResponse.json({ error: 'Agent orchestration failed' }, { status: 500 });
  }
}