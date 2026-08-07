import { describe, expect, it } from 'vitest';

import { getUserAgentFamily, USER_AGENT_FAMILY_MAX_LENGTH } from './user-agent-family';

describe('getUserAgentFamily', () => {
  it('normalizes a long Chrome user-agent', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 '.repeat(20);
    expect(getUserAgentFamily(userAgent)).toBe('Chrome');
  });

  it('normalizes Safari', () => {
    expect(
      getUserAgentFamily(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 ' +
          '(KHTML, like Gecko) Version/17.5 Safari/605.1.15',
      ),
    ).toBe('Safari');
  });

  it('normalizes Firefox', () => {
    expect(
      getUserAgentFamily(
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0',
      ),
    ).toBe('Firefox');
  });

  it('uses Unknown when User-Agent is missing', () => {
    expect(getUserAgentFamily()).toBe('Unknown');
  });

  it('uses a safely bounded Unknown value for abnormal and very long input', () => {
    const result = getUserAgentFamily(`abnormal-client/${'x'.repeat(100_000)}`);
    expect(result).toBe('Unknown');
    expect(result.length).toBeLessThanOrEqual(USER_AGENT_FAMILY_MAX_LENGTH);
  });

  it('detects Edge before its embedded Chrome signature', () => {
    expect(
      getUserAgentFamily(
        'Mozilla/5.0 AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
      ),
    ).toBe('Edge');
  });
});
