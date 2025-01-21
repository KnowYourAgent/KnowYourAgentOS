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

export enum AnomalyType {
  STABLECOIN_DEVIATION = 'STABLECOIN_DEVIATION',
  VOLUME_SPIKE = 'VOLUME_SPIKE',
  PRICE_MANIPULATION = 'PRICE_MANIPULATION',
  GEOGRAPHIC_PATTERN = 'GEOGRAPHIC_PATTERN'
}

export interface BaseAnomaly {
  id: string;
  type: AnomalyType;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface StablecoinAnomaly extends BaseAnomaly {
  type: AnomalyType.STABLECOIN_DEVIATION;
  symbol: string;
  deviation: number;
  currentPrice: number;
}

export interface GeographicAnomaly extends BaseAnomaly {
  type: AnomalyType.GEOGRAPHIC_PATTERN;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

export type Anomaly = StablecoinAnomaly | GeographicAnomaly; 