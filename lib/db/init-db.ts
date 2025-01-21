import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { initializeSchema } from './schema';
import { logger } from '../logger';

async function main() {
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);
  
  try {
    await initializeSchema(supabase);
    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database schema:', error);
    process.exit(1);
  }
}

main();
