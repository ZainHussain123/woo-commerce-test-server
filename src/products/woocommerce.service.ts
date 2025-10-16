import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Product } from './entities/product.entity';

interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  stock_status: string;
  stock_quantity: number | null;
  categories: Array<{ name: string }>;
  tags: Array<{ name: string }>;
  on_sale: boolean;
  date_created: string;
}

@Injectable()
export class WooCommerceService {
  private readonly baseUrl: string;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('WOOCOMMERCE_BASE_URL', 'https://wp-multisite.convertcart.com');
    this.consumerKey = this.configService.get<string>('WOOCOMMERCE_CONSUMER_KEY', 'ck_af82ae325fbee1c13f31eb26148f4dea473b0f77');
    this.consumerSecret = this.configService.get<string>('WOOCOMMERCE_CONSUMER_SECRET', 'cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c9445');
  }

  async fetchProducts(page: number = 1, perPage: number = 100): Promise<WooCommerceProduct[]> {
    try {
      const url = `${this.baseUrl}/wp-json/wc/v3/products`;
      const params = {
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret,
        page,
        per_page: perPage,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params })
      );

      return (response as any).data;
    } catch (error) {
      console.error('Error fetching products from WooCommerce:', error);
      throw new Error('Failed to fetch products from WooCommerce API');
    }
  }

  async fetchAllProducts(): Promise<WooCommerceProduct[]> {
    const allProducts: WooCommerceProduct[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const products = await this.fetchProducts(page, 100);
      allProducts.push(...products);
      hasMore = products.length === 100;
      page++;
    }

    return allProducts;
  }

  transformWooCommerceProduct(wcProduct: WooCommerceProduct): Partial<Product> {
    return {
      id: wcProduct.id,
      title: wcProduct.name,
      price: parseFloat(wcProduct.price),
      stock_status: wcProduct.stock_status,
      stock_quantity: wcProduct.stock_quantity,
      category: wcProduct.categories.length > 0 ? wcProduct.categories[0].name : null,
      tags: wcProduct.tags.map(tag => tag.name),
      on_sale: wcProduct.on_sale,
      created_at: new Date(wcProduct.date_created),
    };
  }
}
