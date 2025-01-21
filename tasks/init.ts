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

import { TaskRegistry } from './registry';
import { Text2ImageTask } from './text2image';
import { WebSearchTask } from './web-search';
import { MessagingTask } from './messaging';
import { BlockchainDataFetcherTask } from './blockchain/data-fetcher';
import { AnomalyDetectorTask } from './blockchain/anomaly-detector';
import { InsightGeneratorTask } from './blockchain/insight-generator';
import { logger } from '../lib/logger';

export function initializeTasks(): TaskRegistry {
  try {
    const registry = TaskRegistry.getInstance();
    
    // Basic tasks
    registry.registerTask(new Text2ImageTask());
    registry.registerTask(new WebSearchTask());
    registry.registerTask(new MessagingTask());
    
    // Blockchain tasks
    registry.registerTask(new BlockchainDataFetcherTask());
    registry.registerTask(new AnomalyDetectorTask());
    registry.registerTask(new InsightGeneratorTask());
    
    logger.info('All tasks initialized successfully');
    return registry;
  } catch (error) {
    logger.error('Failed to initialize tasks:', error);
    throw error;
  }
} 