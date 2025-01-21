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

import { z } from 'zod';

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  authType: 'apiKey' | 'oauth2' | 'none';
  authConfig?: {
    apiKeyHeader?: string;
    apiKeyValue?: string;
    oauthConfig?: {
      clientId: string;
      clientSecret: string;
      tokenUrl: string;
      authUrl: string;
      scopes: string[];
    };
  };
  rateLimit?: {
    requests: number;
    period: 'second' | 'minute' | 'hour' | 'day';
  };
}

export interface ConfigItem {
  type: string;
  description?: string;
  required?: boolean;
  default?: any;
  enum?: string[];
}

export interface ToolConfig {
  name: string;
  description: string;
  version: string;
  author?: string;
  provider: ProviderConfig;
  properties?: Record<string, ConfigItem>;
  required?: string[];
}

export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Tool<T = any> {
  id: string;
  name: string;
  description: string;
  config: ToolConfig;
  execute(params: Record<string, any>): Promise<ToolResult<T>>;
}

// Utility type to convert ToolConfig to Zod schema
export type ConfigToZod<T extends ToolConfig> = z.ZodObject<{
  [K in keyof Required<T>['properties']]: z.ZodType<any>
}>;

// Helper function to convert ToolConfig to Zod schema
export function createConfigSchema(config: ToolConfig): z.ZodObject<any> {
  const shape = Object.entries(config.properties || {}).reduce((acc, [key, prop]) => ({
    ...acc,
    [key]: createPropertySchema(prop)
  }), {});

  return z.object(shape);
}

function createPropertySchema(prop: ConfigItem): z.ZodType<any> {
  let schema: z.ZodType<any>;

  switch (prop.type) {
    case 'string':
      schema = z.string();
      break;
    case 'number':
      schema = z.number();
      break;
    case 'boolean':
      schema = z.boolean();
      break;
    case 'array':
      schema = z.array(z.any());
      break;
    default:
      schema = z.any();
  }

  if (prop.enum) {
    schema = z.enum(prop.enum as [string, ...string[]]);
  }

  if (!prop.required) {
    schema = schema.optional();
  }

  if (prop.default !== undefined) {
    schema = schema.default(prop.default);
  }

  return schema;
} 