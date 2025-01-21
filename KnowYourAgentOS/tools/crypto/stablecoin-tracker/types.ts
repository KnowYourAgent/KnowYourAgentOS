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

import { ToolCategory } from '../../../domain/interfaces/ToolCategory';

export type MetricType = 'market_cap' | 'volume_24h' | 'percent_change_24h';

export interface StablecoinParams {
  stablecoins?: string[];
  metrics?: MetricType[];
  convert?: string;
}

export interface StablecoinResult {
  timestamp: string;
  data: Array<{
    symbol: string;
    name: string;
    market_cap?: number;
    volume_24h?: number;
    percent_change_24h?: number;
  }>;
}

export interface CoinMarketCapResponse {
  data: Record<string, {
    symbol: string;
    name: string;
    quote: {
      [currency: string]: {
        market_cap: number;
        volume_24h: number;
        percent_change_24h: number;
      };
    };
  }>;
}

export interface StablecoinConfig {
  metadata: {
    id: string;
    name: string;
    description: string;
    version: string;
    author?: string;
    category: ToolCategory;
    provider: {
      name: string;
      baseUrl: string;
      authType: 'apiKey' | 'oauth2' | 'none';
      authConfig: {
        apiKeyHeader: string;
        apiKeyValue?: string;
      };
    };
    rateLimit: {
      requests: number;
      period: 'second' | 'minute' | 'hour' | 'day';
    };
  };
  parameters: Array<{
    name: string;
    type: 'array' | 'string';
    description: string;
    required: boolean;
    default: string[] | MetricType[] | string;
    items?: {
      type: 'string';
      enum: string[] | MetricType[];
    };
    enum?: string[];
  }>;
} 