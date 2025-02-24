import { SubCategory } from '../../domain/subcategory';

export interface SubCategoryRepository {
  create(data: SubCategory): Promise<SubCategory>;
  findOne(id: string): Promise<SubCategory>;
  findAll(options?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<[SubCategory[], number]>;
  update(id: string, data: SubCategory): Promise<SubCategory>;
  softDelete(id: string): Promise<void>;
}
