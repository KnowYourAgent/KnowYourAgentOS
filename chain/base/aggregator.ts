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

import { ethers } from 'ethers';
import { logger } from '../../lib/logger';
import { BaseNetworkService } from './network';
import { TransactionData, TokenTransfer, ContractActivity } from './types';
import { ERC20_ABI } from './constants';

export class BaseDataAggregator {
  constructor(private readonly networkService: BaseNetworkService) {}

  async getRecentTransactions(limit = 100): Promise<TransactionData[]> {
    try {
      const provider = this.networkService.getProvider();
      const latestBlock = await provider.getBlockNumber();
      const transactions: TransactionData[] = [];

      for (let i = 0; i < limit; i++) {
        const blockNumber = latestBlock - i;
        if (blockNumber < 0) break;

        const block = await provider.getBlockWithTransactions(blockNumber);
        if (!block) continue;

        for (const tx of block.transactions) {
          const receipt = await provider.getTransactionReceipt(tx.hash);
          if (!receipt) continue;

          transactions.push({
            hash: tx.hash,
            blockNumber: tx.blockNumber || 0,
            timestamp: (block.timestamp || 0) * 1000,
            from: tx.from,
            to: tx.to || null,
            value: tx.value.toString(),
            gasPrice: tx.gasPrice?.toString() || '0',
            gasLimit: tx.gasLimit.toString(),
            gasUsed: receipt.gasUsed.toString(),
            input: tx.data,
            status: receipt.status === 1,
            logs: receipt.logs,
            rawTransaction: tx,
            rawReceipt: receipt
          });
        }
      }

      return transactions;
    } catch (error) {
      logger.error('Error fetching recent transactions:', error);
      throw error;
    }
  }

  async getTokenTransfers(txData: TransactionData): Promise<TokenTransfer[]> {
    const transfers: TokenTransfer[] = [];
    const provider = this.networkService.getProvider();

    for (const log of txData.logs) {
      try {
        // Check if this is a Transfer event (topic0 is keccak256 of Transfer(address,address,uint256))
        if (log.topics[0] === ethers.utils.id('Transfer(address,address,uint256)')) {
          const contract = new ethers.Contract(log.address, ERC20_ABI, provider);
          const [symbol, decimals] = await Promise.all([
            contract.symbol(),
            contract.decimals()
          ]);

          transfers.push({
            tokenAddress: log.address,
            from: ethers.utils.defaultAbiCoder.decode(['address'], log.topics[1])[0],
            to: ethers.utils.defaultAbiCoder.decode(['address'], log.topics[2])[0],
            amount: log.data,
            decimals,
            symbol
          });
        }
      } catch (error) {
        logger.error(`Error parsing transfer event for token ${log.address}:`, error);
      }
    }

    return transfers;
  }

  async getContractActivity(address: string, blockRange = 1000): Promise<ContractActivity> {
    const provider = this.networkService.getProvider();
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = latestBlock - blockRange;

    const filter = {
      address,
      fromBlock,
      toBlock: latestBlock
    };

    try {
      const logs = await provider.getLogs(filter);
      const uniqueUsers = new Set<string>();
      const methodCalls = new Map<string, number>();

      logs.forEach(log => {
        uniqueUsers.add(log.transactionHash);
        const signature = log.topics[0];
        methodCalls.set(signature, (methodCalls.get(signature) || 0) + 1);
      });

      return {
        address,
        methodCalls: Array.from(methodCalls.entries()).map(([signature, count]) => ({
          signature,
          count
        })),
        uniqueUsers: Array.from(uniqueUsers),
        timestamp: Date.now()
      };
    } catch (error) {
      logger.error(`Error fetching contract activity for ${address}:`, error);
      throw error;
    }
  }

  async calculateTPS(timeWindow = 60): Promise<number> {
    try {
      const provider = this.networkService.getProvider();
      const latestBlock = await provider.getBlockNumber();
      const blocks = await Promise.all(
        Array.from({ length: timeWindow }, (_, i) => 
          provider.getBlock(latestBlock - i)
        )
      );

      const validBlocks = blocks.filter((block): block is ethers.providers.Block => block !== null);
      if (validBlocks.length < 2) return 0;

      const totalTx = validBlocks.reduce((sum, block) => sum + block.transactions.length, 0);
      const timeSpan = validBlocks[0].timestamp - validBlocks[validBlocks.length - 1].timestamp;

      return timeSpan > 0 ? totalTx / timeSpan : 0;
    } catch (error) {
      logger.error('Error calculating TPS:', error);
      return 0;
    }
  }
} 