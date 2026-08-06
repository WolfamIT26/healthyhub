export type GatewayName =
  'ai' | 'payment' | 'storage' | 'notification' | 'ocr' | 'vision' | 'analytics' | 'integration';

export type GatewayStatus = 'not_configured' | 'ready' | 'degraded' | 'unavailable';

export interface GatewayHealth {
  name: GatewayName;
  status: GatewayStatus;
  provider: string;
  checkedAt: string;
}

export interface ExternalGateway {
  getHealth(): Promise<GatewayHealth>;
}
