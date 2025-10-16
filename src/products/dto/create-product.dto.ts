export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock?: number;
  isActive?: boolean;
}
