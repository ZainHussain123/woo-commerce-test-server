import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from './products.service';

@Injectable()
export class ScheduledIngestionService {
  private readonly logger = new Logger(ScheduledIngestionService.name);

  constructor(private readonly productsService: ProductsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyIngestion() {
    this.logger.log('Starting scheduled hourly product ingestion...');
    
    try {
      const result = await this.productsService.ingestProductsFromWooCommerce();
      
      this.logger.log(`Scheduled ingestion completed successfully:
        - Imported: ${result.imported} products
        - Updated: ${result.updated} products
        - Total processed: ${result.imported + result.updated} products`);
        
    } catch (error) {
      this.logger.error('Scheduled ingestion failed:', error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyIngestion() {
    this.logger.log('Starting scheduled daily product ingestion...');
    
    try {
      const result = await this.productsService.ingestProductsFromWooCommerce();
      
      this.logger.log(`Daily scheduled ingestion completed successfully:
        - Imported: ${result.imported} products
        - Updated: ${result.updated} products
        - Total processed: ${result.imported + result.updated} products`);
        
    } catch (error) {
      this.logger.error('Daily scheduled ingestion failed:', error.message);
    }
  }

  @Cron('*/15 * * * *') // Every 15 minutes
  async handleFiveMinuteIngestion() {
    this.logger.log('Starting 5-minute scheduled product ingestion...');
    
    try {
      const result = await this.productsService.ingestProductsFromWooCommerce();
      
      this.logger.log(`5-minute scheduled ingestion completed successfully:
        - Imported: ${result.imported} products
        - Updated: ${result.updated} products
        - Total processed: ${result.imported + result.updated} products`);
        
    } catch (error) {
      this.logger.error('5-minute scheduled ingestion failed:', error.message);
    }
  }

  // Custom cron job that can be configured via environment variables
  @Cron(process.env.CRON_SCHEDULE || '0 */6 * * *') // Default: every 6 hours
  async handleCustomIngestion() {
    this.logger.log('Starting custom scheduled product ingestion...');
    
    try {
      const result = await this.productsService.ingestProductsFromWooCommerce();
      
      this.logger.log(`Custom scheduled ingestion completed successfully:
        - Imported: ${result.imported} products
        - Updated: ${result.updated} products
        - Total processed: ${result.imported + result.updated} products`);
        
    } catch (error) {
      this.logger.error('Custom scheduled ingestion failed:', error.message);
    }
  }

  // Manual trigger method for testing
  async triggerManualIngestion() {
    this.logger.log('Manual ingestion triggered...');
    
    try {
      const result = await this.productsService.ingestProductsFromWooCommerce();
      
      this.logger.log(`Manual ingestion completed successfully:
        - Imported: ${result.imported} products
        - Updated: ${result.updated} products
        - Total processed: ${result.imported + result.updated} products`);
        
      return result;
    } catch (error) {
      this.logger.error('Manual ingestion failed:', error.message);
      throw error;
    }
  }
}
