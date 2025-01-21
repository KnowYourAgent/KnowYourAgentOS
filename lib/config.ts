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

interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  redis: {
    restUrl: string;
    restToken: string;
  };
  logging: {
    level: string;
  };
  ai: {
    openaiKey: string;
    anthropicKey: string;
    geminiKey: string;
  };
}

export const config: EnvConfig = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  redis: {
    restUrl: process.env.UPSTASH_REDIS_REST_URL || '',
    restToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  ai: {
    openaiKey: process.env.OPENAI_API_KEY || '',
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
  },
};

export function validateConfig() {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ];

  const missingVars = requiredVars.filter(key => !process.env[key]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
} 