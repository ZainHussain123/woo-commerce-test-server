import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { WooCommerceService } from './woocommerce.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private wooCommerceService: WooCommerceService,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async ingestProductsFromWooCommerce(): Promise<{ imported: number; updated: number }> {
    try {
      const wooCommerceProducts = await this.wooCommerceService.fetchAllProducts();
      let imported = 0;
      let updated = 0;

      for (const wcProduct of wooCommerceProducts) {
        const productData = this.wooCommerceService.transformWooCommerceProduct(wcProduct);
        
        const existingProduct = await this.productRepository.findOne({ 
          where: { id: productData.id } 
        });

        if (existingProduct) {
          await this.productRepository.update(productData.id!, productData);
          updated++;
        } else {
          const product = this.productRepository.create(productData);
          await this.productRepository.save(product);
          imported++;
        }
      }

      return { imported, updated };
    } catch (error) {
      console.error('Error ingesting products:', error);
      throw new Error('Failed to ingest products from WooCommerce');
    }
  }

  async evaluateSegments(conditions: string): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    const lowerConditions = conditions.toLowerCase();

    if (lowerConditions.includes('on sale') || lowerConditions.includes('sale')) {
      query.andWhere('product.on_sale = :onSale', { onSale: true });
    }

    if (lowerConditions.includes('in stock') || lowerConditions.includes('instock')) {
      query.andWhere('product.stock_status = :stockStatus', { stockStatus: 'instock' });
    }

    if (lowerConditions.includes('out of stock') || lowerConditions.includes('outofstock')) {
      query.andWhere('product.stock_status = :stockStatus', { stockStatus: 'outofstock' });
    }
    const priceMatch = conditions.match(/price\s*(<|>|<=|>=|=)\s*(\d+)/i);
    if (priceMatch) {
      const operator = priceMatch[1];
      const price = parseFloat(priceMatch[2]);
      query.andWhere(`product.price ${operator} :price`, { price });
    }
    const categoryMatch = conditions.match(/category\s*[:=]\s*["']?([^"'\s]+)["']?/i);
    if (categoryMatch) {
      const category = categoryMatch[1];
      query.andWhere('product.category ILIKE :category', { category: `%${category}%` });
    }
    const tagMatch = conditions.match(/tag\s*[:=]\s*["']?([^"'\s]+)["']?/i);
    if (tagMatch) {
      const tag = tagMatch[1];
      query.andWhere('product.tags ILIKE :tag', { tag: `%${tag}%` });
    }

    return await query.getMany();
  }
}
