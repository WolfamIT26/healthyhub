import { Module } from '@nestjs/common';

import { AiGateway } from './ai/ai-gateway';
import { AnalyticsGateway } from './analytics/analytics-gateway';
import { IntegrationGateway } from './integration/integration-gateway';
import { NotificationGateway } from './notification/notification-gateway';
import { OcrGateway } from './ocr/ocr-gateway';
import { PaymentGateway } from './payment/payment-gateway';
import { StorageGateway } from './storage/storage-gateway';
import { VisionGateway } from './vision/vision-gateway';

const gatewayProviders = [
  AiGateway,
  PaymentGateway,
  StorageGateway,
  NotificationGateway,
  OcrGateway,
  VisionGateway,
  AnalyticsGateway,
  IntegrationGateway,
];

@Module({
  providers: gatewayProviders,
  exports: gatewayProviders,
})
export class GatewayRegistryModule {}
