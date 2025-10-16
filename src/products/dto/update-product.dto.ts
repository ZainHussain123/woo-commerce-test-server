import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
  isActive?: boolean;
}
