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

// components/common/PrimaryButton.tsx
import React from 'react';

interface PrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function PrimaryButton({ onClick, children }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      {children}
    </button>
  );
}