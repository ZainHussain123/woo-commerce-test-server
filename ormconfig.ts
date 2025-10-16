import { DataSource } from 'typeorm';
import { Product } from './src/products/entities/product.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '12345',
  database: process.env.POSTGRES_DB || 'woocommerce',
  entities: [Product],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || false,
  logging: process.env.TYPEORM_LOGGING === 'true' || false,
});
