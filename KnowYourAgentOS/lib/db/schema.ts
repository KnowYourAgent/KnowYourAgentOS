import { SupabaseClient } from '@supabase/supabase-js';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  status: 'ACTIVE' | 'PAUSED' | 'MAINTENANCE' | 'DISABLED';
  type: 'INSIGHT_GENERATOR' | 'ENGAGEMENT_MANAGER' | 'SUPPORT' | 'ANALYST' | 'CUSTOM';
  created_at: string;
  updated_at: string;
}

export interface AgentConfiguration {
  id: string;
  agent_id: string;
  llm_provider: string;
  llm_model: string;
  max_tokens: number;
  temperature: number;
  prompt_template: string;
  reply_template?: string;
  tweet_template?: string;
  schedule_config?: any;
  filters?: any;
  active_hours?: any;
  rate_limit?: any;
  updated_at: string;
}

export interface AgentCredential {
  id: string;
  agent_id: string;
  provider: string;
  credentials: any;
  is_valid: boolean;
  last_validated?: string;
  created_at: string;
  updated_at: string;
}

export interface Tweet {
  id: string;
  agent_id: string;
  content: string;
  media_urls: string[];
  reply_to_id?: string;
  engagement?: any;
  status: 'PENDING' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'DELETED';
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  twitter_id: string;
  username: string;
  created_at: string;
}

export interface ReputationScore {
  id: string;
  user_id: string;
  score: number;
  last_updated: string;
}

export interface Insight {
  id: string;
  type: string;
  content: any;
  timestamp: string;
  processed: boolean;
}

export async function initializeSchema(supabase: SupabaseClient) {
  // Create agents table
  await supabase.rpc('create_agents_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS agents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        avatar TEXT,
        status TEXT CHECK (status IN ('ACTIVE', 'PAUSED', 'MAINTENANCE', 'DISABLED')) DEFAULT 'ACTIVE',
        type TEXT CHECK (type IN ('INSIGHT_GENERATOR', 'ENGAGEMENT_MANAGER', 'SUPPORT', 'ANALYST', 'CUSTOM')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      CREATE INDEX IF NOT EXISTS agents_status_type_idx ON agents(status, type);
    `
  });

  // Create agent_configurations table
  await supabase.rpc('create_agent_configurations_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS agent_configurations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id UUID REFERENCES agents(id) UNIQUE,
        llm_provider TEXT DEFAULT 'ANTHROPIC',
        llm_model TEXT DEFAULT 'claude-3-opus-20240229',
        max_tokens INTEGER DEFAULT 4096,
        temperature FLOAT DEFAULT 0.7,
        prompt_template TEXT NOT NULL,
        reply_template TEXT,
        tweet_template TEXT,
        schedule_config JSONB,
        filters JSONB,
        active_hours JSONB,
        rate_limit JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  });

  // Create agent_credentials table
  await supabase.rpc('create_agent_credentials_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS agent_credentials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id UUID REFERENCES agents(id),
        provider TEXT NOT NULL,
        credentials JSONB NOT NULL,
        is_valid BOOLEAN DEFAULT true,
        last_validated TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        UNIQUE(agent_id, provider)
      );
    `
  });

  // Create tweets table
  await supabase.rpc('create_tweets_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS tweets (
        id TEXT PRIMARY KEY,
        agent_id UUID REFERENCES agents(id),
        content TEXT NOT NULL,
        media_urls TEXT[],
        reply_to_id TEXT,
        engagement JSONB,
        status TEXT CHECK (status IN ('PENDING', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'DELETED')) DEFAULT 'PENDING',
        scheduled_for TIMESTAMP WITH TIME ZONE,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      CREATE INDEX IF NOT EXISTS tweets_agent_status_idx ON tweets(agent_id, status);
    `
  });

  // Create users table
  await supabase.rpc('create_users_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        twitter_id TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  });

  // Create reputation_scores table
  await supabase.rpc('create_reputation_scores_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS reputation_scores (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) UNIQUE,
        score FLOAT NOT NULL,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `
  });

  // Create insights table
  await supabase.rpc('create_insights_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS insights (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type TEXT NOT NULL,
        content JSONB NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        processed BOOLEAN DEFAULT false
      );
    `
  });
}
