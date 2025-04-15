import { Category } from '../../domain/category';

export interface CategoryRepository {
  create(data: Category): Promise<Category>;
  findOne(id: string): Promise<Category>;
  findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<[Category[], number]>;
  update(id: string, data: Category): Promise<Category>;
  softDelete(id: string): Promise<void>;
  findFullMenu(): Promise<Category[]>;
}
