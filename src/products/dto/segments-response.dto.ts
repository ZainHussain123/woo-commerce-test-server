import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class SegmentsResponseDto {
  @ApiProperty({
    description: 'The conditions used for filtering',
    example: 'on sale and in stock'
  })
  conditions: string;

  @ApiProperty({
    description: 'Number of products matching the conditions',
    example: 15
  })
  count: number;

  @ApiProperty({
    description: 'Array of products matching the conditions',
    type: [ProductResponseDto]
  })
  products: ProductResponseDto[];
}
