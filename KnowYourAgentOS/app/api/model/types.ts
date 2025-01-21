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

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface ModelRequestBody {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ModelResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

export function validateModelRequest(body: any): body is ModelRequestBody {
  if (!body?.messages || !Array.isArray(body.messages)) {
    throw new Error('Messages array is required');
  }

  if (!body.messages.every((msg: Message) => 
    msg.role && ['system', 'user', 'assistant'].includes(msg.role) && 
    typeof msg.content === 'string'
  )) {
    throw new Error('Invalid message format');
  }

  return true;
} 