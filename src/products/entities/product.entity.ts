import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Product ID from WooCommerce', example: 123 })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ description: 'Product title/name', example: 'Wireless Bluetooth Headphones' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Product price', example: 99.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ 
    description: 'Stock status', 
    enum: ['instock', 'outofstock'],
    example: 'instock' 
  })
  @Column()
  stock_status: string;

  @ApiProperty({ 
    description: 'Available stock quantity', 
    example: 50,
    nullable: true 
  })
  @Column('int', { nullable: true })
  stock_quantity: number | null;

  @ApiProperty({ 
    description: 'Product category', 
    example: 'Electronics',
    nullable: true 
  })
  @Column('varchar', { nullable: true })
  category: string | null;

  @ApiProperty({ 
    description: 'Product tags', 
    example: ['wireless', 'bluetooth', 'audio'],
    type: [String] 
  })
  @Column('simple-array', { nullable: true })
  tags: string[];

  @ApiProperty({ description: 'Whether the product is on sale', example: false })
  @Column({ default: false })
  on_sale: boolean;

  @ApiProperty({ description: 'Product creation date', example: '2024-01-15T10:30:00.000Z' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Last update date', example: '2024-01-15T10:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
