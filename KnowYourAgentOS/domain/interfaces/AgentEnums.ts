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

// domain/interfaces/AgentEnums.ts
export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  MAINTENANCE = 'MAINTENANCE',
  DISABLED = 'DISABLED',
}

export enum AgentType {
  INSIGHT_GENERATOR = 'INSIGHT_GENERATOR',
  ENGAGEMENT_MANAGER = 'ENGAGEMENT_MANAGER',
  SUPPORT = 'SUPPORT',
  ANALYST = 'ANALYST',
  CUSTOM = 'CUSTOM',
}

export enum TweetStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}