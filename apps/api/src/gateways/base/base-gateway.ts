import type { ExternalGateway, GatewayHealth, GatewayName } from './gateway.types';

export abstract class BaseGateway implements ExternalGateway {
  protected abstract readonly gatewayName: GatewayName;

  async getHealth(): Promise<GatewayHealth> {
    return {
      name: this.gatewayName,
      status: 'not_configured',
      provider: 'not_configured',
      checkedAt: new Date().toISOString(),
    };
  }
}
