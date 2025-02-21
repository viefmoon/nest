import { Injectable, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { MenuRepository } from './infrastructure/persistence/menu.repository';

import { Category } from './domain/category';
import { SubCategory } from './domain/subcategory';
import { Product } from './domain/product';

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
  QuerySubCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
} from './dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResponseDto } from '../utils/dto/infinity-pagination-response.dto';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  /**
   * Categorías
   */
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    return this.menuRepository.createCategory({
      ...dto,
    });
  }

  async findAllCategories(
    query: QueryCategoryDto,
  ): Promise<InfinityPaginationResponseDto<Category>> {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.menuRepository.findCategoriesWithPagination(query, {
      page,
      limit,
    });

    return infinityPagination(data, { page, limit });
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.menuRepository.findCategoryById(id);
  }

  async updateCategory(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.menuRepository.updateCategory(id, dto);
  }

  async removeCategory(id: number): Promise<void> {
    return this.menuRepository.removeCategory(id);
  }

  /**
   * Subcategorías
   */
  async createSubCategory(dto: CreateSubCategoryDto): Promise<SubCategory> {
    return this.menuRepository.createSubCategory({
      ...dto,
    });
  }

  async findAllSubCategories(
    query: QuerySubCategoryDto,
  ): Promise<InfinityPaginationResponseDto<SubCategory>> {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.menuRepository.findSubCategoriesWithPagination(query, {
      page,
      limit,
    });

    return infinityPagination(data, { page, limit });
  }

  async findSubCategoryById(id: number): Promise<SubCategory | null> {
    return this.menuRepository.findSubCategoryById(id);
  }

  async updateSubCategory(
    id: number,
    dto: UpdateSubCategoryDto,
  ): Promise<SubCategory | null> {
    return this.menuRepository.updateSubCategory(id, dto);
  }

  async removeSubCategory(id: number): Promise<void> {
    return this.menuRepository.removeSubCategory(id);
  }

  /**
   * Productos
   */
  async createProduct(dto: CreateProductDto): Promise<Product> {
    // Validación: si `hasVariants === true` y `price` está set, podría ser un error.
    if (dto.hasVariants && typeof dto.price === 'number') {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          price: 'No puede asignar price si el producto maneja variantes',
        },
      });
    }

    return this.menuRepository.createProduct({
      ...dto,
      stock: dto.stock ?? 0,
      hasVariants: dto.hasVariants ?? false,
    });
  }

  async findAllProducts(
    query: QueryProductDto,
  ): Promise<InfinityPaginationResponseDto<Product>> {
    const page = query.page ?? 1;
    let limit = query.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.menuRepository.findProductsWithPagination(query, {
      page,
      limit,
    });

    return infinityPagination(data, { page, limit });
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.menuRepository.findProductById(id);
  }

  async updateProduct(
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    // Ejemplo de validación adicional
    if (dto.hasVariants && dto.price !== undefined) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          price: 'No puede asignar price si el producto maneja variantes',
        },
      });
    }

    return this.menuRepository.updateProduct(id, dto);
  }

  async removeProduct(id: number): Promise<void> {
    return this.menuRepository.removeProduct(id);
  }
}
