import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ScheduledIngestionService } from './scheduled-ingestion.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { IngestResponseDto } from './dto/ingest-response.dto';
import { EvaluateSegmentsDto } from './dto/evaluate-segments.dto';
import { SegmentsResponseDto } from './dto/segments-response.dto';

@ApiTags('products')
@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly scheduledIngestionService: ScheduledIngestionService
  ) {}

  @Get('products')
  @ApiOperation({ 
    summary: 'Get all products',
    description: 'Retrieves all products stored in the local database'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all products',
    type: [ProductResponseDto]
  })
  async findAll() {
    const products = await this.productsService.findAll();
    return {
      products,
      count: products.length,
      message: 'Products fetched successfully'
    };
  }

  @Get('products/:id')
  @ApiOperation({ 
    summary: 'Get product by ID',
    description: 'Retrieves a specific product by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product ID', 
    type: 'number',
    example: 123
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Product found',
    type: ProductResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Product not found' 
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post('products/ingest')
  @ApiOperation({ 
    summary: 'Ingest products from WooCommerce',
    description: 'Fetches all products from WooCommerce API and stores them in the local database. Updates existing products and imports new ones.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Products ingested successfully',
    type: IngestResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Failed to fetch products from WooCommerce API' 
  })
  async ingestProducts() {
    const result = await this.productsService.ingestProductsFromWooCommerce();
    return {
      message: 'Products ingested successfully',
      imported: result.imported,
      updated: result.updated,
      total: result.imported + result.updated
    };
  }

  @Post('products/ingest/manual')
  @ApiOperation({ 
    summary: 'Manually trigger product ingestion',
    description: 'Manually triggers the product ingestion process. This is useful for testing or immediate synchronization.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Manual ingestion triggered successfully',
    type: IngestResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Failed to trigger manual ingestion' 
  })
  async triggerManualIngestion() {
    const result = await this.scheduledIngestionService.triggerManualIngestion();
    return {
      message: 'Manual ingestion triggered successfully',
      imported: result.imported,
      updated: result.updated,
      total: result.imported + result.updated
    };
  }

  @Get('products/ingest/status')
  @ApiOperation({ 
    summary: 'Get ingestion status',
    description: 'Returns information about the scheduled ingestion jobs and their configuration.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ingestion status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        scheduledJobs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              schedule: { type: 'string' },
              description: { type: 'string' }
            }
          }
        },
        environment: {
          type: 'object',
          properties: {
            cronSchedule: { type: 'string' },
            timezone: { type: 'string' }
          }
        }
      }
    }
  })
  getIngestionStatus() {
    return {
      scheduledJobs: [
        {
          name: 'Hourly Ingestion',
          schedule: '0 * * * *',
          description: 'Runs every hour'
        },
        {
          name: 'Daily Ingestion',
          schedule: '0 0 * * *',
          description: 'Runs daily at midnight'
        },
        {
          name: 'Custom Ingestion',
          schedule: process.env.CRON_SCHEDULE || '0 */6 * * *',
          description: 'Custom schedule (configurable via CRON_SCHEDULE env var)'
        }
      ],
      environment: {
        cronSchedule: process.env.CRON_SCHEDULE || '0 */6 * * *',
        timezone: process.env.TZ || 'UTC'
      }
    };
  }
}

@ApiTags('segments')
@Controller()
export class SegmentsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('segments/evaluate')
  @ApiOperation({ 
    summary: 'Evaluate product segments',
    description: 'Filters products based on text conditions. Supports natural language filtering with keywords like "on sale", "in stock", price comparisons, category filters, and tag filters.'
  })
  @ApiBody({ 
    type: EvaluateSegmentsDto,
    description: 'Text conditions for filtering products'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Filtered products based on conditions',
    type: SegmentsResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid conditions provided' 
  })
  async evaluateSegments(@Body() body: EvaluateSegmentsDto) {
    if (!body.conditions) {
      return { error: 'Conditions are required' };
    }
    
    const products = await this.productsService.evaluateSegments(body.conditions);
    return {
      conditions: body.conditions,
      count: products.length,
      products
    };
  }
}
