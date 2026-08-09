import { Module } from '@nestjs/common';

import { ShippingQuoteService } from './shipping-quote.service';

@Module({ providers: [ShippingQuoteService], exports: [ShippingQuoteService] })
export class ShippingFoundationModule {}
