export const USER_AGENT_FAMILY_MAX_LENGTH = 32;

/**
 * Chỉ phân loại client family phục vụ security audit; không lưu raw User-Agent.
 */
export function getUserAgentFamily(userAgent?: string): string {
  let family = 'Unknown';

  if (userAgent) {
    if (/Edg(?:e|A|iOS)?\//i.test(userAgent)) {
      family = 'Edge';
    } else if (/(?:Firefox|FxiOS)\//i.test(userAgent)) {
      family = 'Firefox';
    } else if (/(?:Chrome|CriOS)\//i.test(userAgent)) {
      family = 'Chrome';
    } else if (/Safari\//i.test(userAgent)) {
      family = 'Safari';
    }
  }

  return family.slice(0, USER_AGENT_FAMILY_MAX_LENGTH);
}
