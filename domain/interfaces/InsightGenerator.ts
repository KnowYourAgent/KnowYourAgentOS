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

// domain/interfaces/InsightGenerator.ts
import { Insight } from '../entities/Insight';

export interface BlockchainData {
  chain: string;
  blockNumber: number;
  timestamp: number;
  transactions: unknown[];
}

export enum AnomalyType {
  PRICE_SPIKE = 'PRICE_SPIKE',
  VOLUME_ANOMALY = 'VOLUME_ANOMALY',
  PATTERN_DEVIATION = 'PATTERN_DEVIATION'
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  description: string;
}

export interface InsightGenerator {
  pullBlockchainData(): Promise<BlockchainData>;
  detectAnomalies(data: BlockchainData): Promise<Anomaly[]>;
  generateStructuredInsights(anomalies: Anomaly[]): Promise<Insight[]>;
}