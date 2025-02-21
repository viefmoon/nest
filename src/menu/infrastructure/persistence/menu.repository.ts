import { Category } from '../../domain/category';
import { SubCategory } from '../../domain/subcategory';
import { Product } from '../../domain/product';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import {
  QueryCategoryDto,
  QuerySubCategoryDto,
  QueryProductDto,
} from '../../dto';

export abstract class MenuRepository {
  /**
   * Métodos para categorías
   */
  abstract createCategory(data: Omit<Category, 'id' | 'deletedAt'>): Promise<Category>;
  abstract findCategoryById(id: number): Promise<NullableType<Category>>;
  abstract updateCategory(id: number, payload: Partial<Category>): Promise<NullableType<Category>>;
  abstract removeCategory(id: number): Promise<void>;

  abstract findCategoriesWithPagination(
    query: QueryCategoryDto,
    pagination: IPaginationOptions,
  ): Promise<Category[]>;

  /**
   * Métodos para subcategorías
   */
  abstract createSubCategory(data: Omit<SubCategory, 'id' | 'deletedAt'>): Promise<SubCategory>;
  abstract findSubCategoryById(id: number): Promise<NullableType<SubCategory>>;
  abstract updateSubCategory(id: number, payload: Partial<SubCategory>): Promise<NullableType<SubCategory>>;
  abstract removeSubCategory(id: number): Promise<void>;

  abstract findSubCategoriesWithPagination(
    query: QuerySubCategoryDto,
    pagination: IPaginationOptions,
  ): Promise<SubCategory[]>;

  /**
   * Métodos para productos
   */
  abstract createProduct(data: Omit<Product, 'id' | 'deletedAt'>): Promise<Product>;
  abstract findProductById(id: number): Promise<NullableType<Product>>;
  abstract updateProduct(id: number, payload: Partial<Product>): Promise<NullableType<Product>>;
  abstract removeProduct(id: number): Promise<void>;

  abstract findProductsWithPagination(
    query: QueryProductDto,
    pagination: IPaginationOptions,
  ): Promise<Product[]>;
}
