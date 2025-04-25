import { Product } from '../../products/domain/product';

export class ProductVariant {
  id: string;

  productId: string;

  name: string;

  price: number;

  isActive: boolean;

  product: Product | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
