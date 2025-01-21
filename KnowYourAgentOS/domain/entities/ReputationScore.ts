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

export class ReputationScore {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly score: number,
    public readonly lastUpdated: Date
  ) {}

  static create(props: {
    id: string;
    userId: string;
    score: number;
    lastUpdated?: Date;
  }): ReputationScore {
    return new ReputationScore(
      props.id,
      props.userId,
      props.score,
      props.lastUpdated ?? new Date()
    );
  }
} 