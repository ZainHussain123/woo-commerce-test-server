import { ApiProperty } from '@nestjs/swagger';

export class EvaluateSegmentsDto {
  @ApiProperty({
    description: 'Text conditions for filtering products',
    example: 'on sale and in stock',
    examples: {
      'on_sale': {
        summary: 'Products on sale',
        value: 'on sale'
      },
      'in_stock': {
        summary: 'Products in stock',
        value: 'in stock'
      },
      'price_filter': {
        summary: 'Products under $50',
        value: 'price < 50'
      },
      'category_filter': {
        summary: 'Electronics category',
        value: 'category = Electronics'
      },
      'complex_filter': {
        summary: 'Complex filtering',
        value: 'price < 100 and in stock and category = Electronics'
      }
    }
  })
  conditions: string;
}
