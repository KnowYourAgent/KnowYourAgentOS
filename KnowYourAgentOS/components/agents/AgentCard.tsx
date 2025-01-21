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

// components/agents/AgentCard.tsx
import React from 'react';
import { Agent } from '@/domain/entities/Agent';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold">{agent.name}</h2>
      {agent.description && <p className="mt-2">{agent.description}</p>}
      <span className="block mt-2 text-sm text-gray-500">Status: {agent.status}</span>
    </div>
  );
}