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

// domain/entities/Agent.ts
import { AgentStatus, AgentType } from '../interfaces/AgentEnums';

export class Agent {
  id: string;
  name: string;
  description?: string;
  status: AgentStatus;
  type: AgentType;

  constructor(props: {
    id: string;
    name: string;
    description?: string;
    status?: AgentStatus;
    type: AgentType;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status ?? AgentStatus.ACTIVE;
    this.type = props.type;
  }
}