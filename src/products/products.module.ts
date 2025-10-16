import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ProductsController, SegmentsController } from './products.controller';
import { ProductsService } from './products.service';
import { WooCommerceService } from './woocommerce.service';
import { ScheduledIngestionService } from './scheduled-ingestion.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    HttpModule
  ],
  controllers: [ProductsController, SegmentsController],
  providers: [ProductsService, WooCommerceService, ScheduledIngestionService]
})
export class ProductsModule {}
