import { describe, it, expect, vi } from 'vitest';
import { AgentService } from '@/domain/services/AgentService';
import { InsightGenerator } from '@/domain/interfaces/InsightGenerator';

describe('AgentService Integration', () => {
  it('runs the agent workflow and returns insights', async () => {
    const mockGenerator: InsightGenerator = {
      pullBlockchainData: vi.fn().mockResolvedValue({}),
      detectAnomalies: vi.fn().mockResolvedValue([]),
      generateStructuredInsights: vi.fn().mockResolvedValue([
        { id: '123', type: 'test', content: {}, timestamp: new Date(), processed: false },
      ]),
    };
    const agentService = new AgentService();
    // @ts-expect-error - inject mock for testing
    agentService.insightGenerator = mockGenerator;

    const insights = await agentService.runAgentWorkflow();
    expect(insights.length).toBe(1);
    expect(insights[0].id).toBe('123');
  });
});