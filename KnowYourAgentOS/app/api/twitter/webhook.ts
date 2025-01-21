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

// app/api/twitter/webhook.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';
import { EngagementService } from '../../../domain/services/EngagementService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const crcToken = searchParams.get('crc_token');
  
  if (crcToken) {
    logger.info('Twitter CRC check initiated');
    // Compute Twitter's required response
    const responseToken = `sha256=${Buffer.from(crcToken).toString('base64')}`;
    return NextResponse.json({ response_token: responseToken });
  }
  return NextResponse.json({ message: 'No CRC token provided.' });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    logger.info('Twitter webhook payload received', payload);

    const engagementService = new EngagementService();
    await engagementService.handleWebhookEvent(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error in Twitter webhook handler', error);
    return NextResponse.json({ error: 'Failed to handle Twitter event' }, { status: 500 });
  }
}