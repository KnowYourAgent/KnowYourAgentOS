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

// domain/interfaces/LLMEngine.ts
export interface StructuredData {
  // define your structured data type
}

export interface Query {
  // define your query structure
}

export interface LLMEngine {
  translateToNaturalLanguage(data: StructuredData): Promise<string>;
  generateIndexerQueries(text: string): Promise<Query[]>;
  handleConversationContext(userId: string, message: string): Promise<string>;
}