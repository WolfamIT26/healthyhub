import { describe, expect, it, vi } from 'vitest';

import { AdminDashboardService } from './admin-dashboard.service';

const metrics = {
  products: { total: 12, activePublic: 8, unavailable: 2 },
  orders: {
    total: 9,
    byStatus: { new: 2, confirmed: 3, completed: 2, cancelled: 1, returned: 1 },
  },
  reviews: {
    total: 5,
    byStatus: { published: 4, hidden: 1, rejected: 0 },
  },
};

describe('AdminDashboardService', () => {
  it('returns only authoritative aggregate fields in the canonical tenant scope', async () => {
    const repository = { readMetrics: vi.fn().mockResolvedValue(metrics) };
    const service = new AdminDashboardService(repository as never);

    const result = await service.getDashboard();

    expect(repository.readMetrics).toHaveBeenCalledWith('1');
    expect(result).toEqual({ ...metrics, generatedAt: expect.any(String) });
    expect(JSON.stringify(result)).not.toMatch(/email|phone|address|password|provider/i);
  });

  it('does not invent revenue, growth, conversion or moderation-pending metrics', async () => {
    const service = new AdminDashboardService({
      readMetrics: vi.fn().mockResolvedValue(metrics),
    } as never);
    const result = await service.getDashboard();

    expect(result).not.toHaveProperty('revenue');
    expect(result).not.toHaveProperty('profit');
    expect(result).not.toHaveProperty('conversion');
    expect(result.reviews).not.toHaveProperty('pending');
  });
});
