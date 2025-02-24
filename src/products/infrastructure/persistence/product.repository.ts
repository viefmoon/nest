import { Product } from '../../domain/product';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(options: {
    page: number;
    limit: number;
    subCategoryId?: string;
    hasVariants?: boolean;
    isActive?: boolean;
    search?: string;
  }): Promise<[Product[], number]>;
  findOne(id: string): Promise<Product>;
  update(id: string, product: Product): Promise<Product>;
  softDelete(id: string): Promise<void>;
}
