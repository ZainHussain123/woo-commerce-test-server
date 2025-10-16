import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID from WooCommerce',
    example: 123
  })
  id: number;

  @ApiProperty({
    description: 'Product title/name',
    example: 'Wireless Bluetooth Headphones'
  })
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 99.99
  })
  price: number;

  @ApiProperty({
    description: 'Stock status',
    enum: ['instock', 'outofstock'],
    example: 'instock'
  })
  stock_status: string;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
    nullable: true
  })
  stock_quantity: number | null;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    nullable: true
  })
  category: string | null;

  @ApiProperty({
    description: 'Product tags',
    example: ['wireless', 'bluetooth', 'audio'],
    type: [String]
  })
  tags: string[];

  @ApiProperty({
    description: 'Whether the product is on sale',
    example: false
  })
  on_sale: boolean;

  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-15T10:30:00.000Z'
  })
  created_at: Date;
}
