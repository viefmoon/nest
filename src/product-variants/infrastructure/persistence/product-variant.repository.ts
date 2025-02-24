import { ProductVariant } from '../../domain/product-variant';

export interface ProductVariantRepository {
  create(productVariant: ProductVariant): Promise<ProductVariant>;
  findAll(options: {
    page: number;
    limit: number;
    productId?: string;
    isActive?: boolean;
  }): Promise<[ProductVariant[], number]>;
  findOne(id: string): Promise<ProductVariant>;
  update(id: string, productVariant: ProductVariant): Promise<ProductVariant>;
  softDelete(id: string): Promise<void>;
}
