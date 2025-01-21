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

export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)'
];

export const CHAIN_CONSTANTS = {
  BASE_MAINNET: {
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    wsUrl: 'wss://mainnet.base.org',
    networkName: 'mainnet' as const
  },
  BASE_GOERLI: {
    chainId: 84531,
    rpcUrl: 'https://goerli.base.org',
    wsUrl: 'wss://goerli.base.org',
    networkName: 'goerli' as const
  }
}; 