import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MenuRepository } from '../../menu.repository';
import { Category } from '../../../../domain/category';
import { SubCategory } from '../../../../domain/subcategory';
import { Product } from '../../../../domain/product';
import { CategoryEntity } from '../entities/category.entity';
import { SubCategoryEntity } from '../entities/subcategory.entity';
import { ProductEntity } from '../entities/product.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { SubCategoryMapper } from '../mappers/subcategory.mapper';
import { ProductMapper } from '../mappers/product.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import {
  QueryCategoryDto,
  QuerySubCategoryDto,
  QueryProductDto,
} from '../../../../dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MenuRelationalRepository extends MenuRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(SubCategoryEntity)
    private readonly subCategoryRepo: Repository<SubCategoryEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {
    super();
  }

  /**
   * Categorías
   */
  async createCategory(
    data: Omit<Category, 'id' | 'deletedAt'>,
  ): Promise<Category> {
    const entity = CategoryMapper.toPersistence(data as Category);
    const saved = await this.categoryRepo.save(this.categoryRepo.create(entity));
    return CategoryMapper.toDomain(saved);
  }

  async findCategoryById(id: number): Promise<NullableType<Category>> {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    return cat ? CategoryMapper.toDomain(cat) : null;
  }

  async updateCategory(
    id: number,
    payload: Partial<Category>,
  ): Promise<NullableType<Category>> {
    const catEntity = await this.categoryRepo.findOne({ where: { id } });
    if (!catEntity) {
      return null;
    }
    const merged = this.categoryRepo.merge(
      catEntity,
      CategoryMapper.toPersistence(payload as Category),
    );
    const saved = await this.categoryRepo.save(merged);
    return CategoryMapper.toDomain(saved);
  }

  async removeCategory(id: number): Promise<void> {
    const catEntity = await this.categoryRepo.findOne({ where: { id } });
    if (!catEntity) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepo.softRemove(catEntity);
  }

  async findCategoriesWithPagination(
    query: QueryCategoryDto,
    pagination: IPaginationOptions,
  ): Promise<Category[]> {
    const { page, limit } = pagination;

    const order = query.orderBy
      ? { [query.orderBy]: query.order?.toUpperCase() || 'ASC' }
      : {};

    const [entities] = await this.categoryRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order,
    });

    return entities.map(CategoryMapper.toDomain);
  }

  /**
   * Subcategorías
   */
  async createSubCategory(
    data: Omit<SubCategory, 'id' | 'deletedAt'>,
  ): Promise<SubCategory> {
    // Verificamos la categoría
    const cat = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
    if (!cat) {
      throw new NotFoundException('Category not found for this subcategory');
    }
    const entity = SubCategoryMapper.toPersistence(data as SubCategory);
    entity.category = cat;
    const saved = await this.subCategoryRepo.save(
      this.subCategoryRepo.create(entity),
    );
    return SubCategoryMapper.toDomain(saved);
  }

  async findSubCategoryById(id: number): Promise<NullableType<SubCategory>> {
    const sub = await this.subCategoryRepo.findOne({ where: { id } });
    return sub ? SubCategoryMapper.toDomain(sub) : null;
  }

  async updateSubCategory(
    id: number,
    payload: Partial<SubCategory>,
  ): Promise<NullableType<SubCategory>> {
    const subEntity = await this.subCategoryRepo.findOne({ where: { id } });
    if (!subEntity) {
      return null;
    }

    // Si se está cambiando la categoría
    if (payload.categoryId && payload.categoryId !== subEntity.category.id) {
      const cat = await this.categoryRepo.findOne({
        where: { id: payload.categoryId },
      });
      if (!cat) {
        throw new NotFoundException('New category not found');
      }
      subEntity.category = cat;
    }

    const merged = this.subCategoryRepo.merge(
      subEntity,
      SubCategoryMapper.toPersistence(payload as SubCategory),
    );

    const saved = await this.subCategoryRepo.save(merged);
    return SubCategoryMapper.toDomain(saved);
  }

  async removeSubCategory(id: number): Promise<void> {
    const subEntity = await this.subCategoryRepo.findOne({ where: { id } });
    if (!subEntity) {
      throw new NotFoundException('SubCategory not found');
    }
    await this.subCategoryRepo.softRemove(subEntity);
  }

  async findSubCategoriesWithPagination(
    query: QuerySubCategoryDto,
    pagination: IPaginationOptions,
  ): Promise<SubCategory[]> {
    const { page, limit } = pagination;
    const order = query.orderBy
      ? { [query.orderBy]: query.order?.toUpperCase() || 'ASC' }
      : {};

    const where: any = {};
    if (query.categoryId) {
      // Filtrar por categoría
      where.category = { id: query.categoryId };
    }

    const [entities] = await this.subCategoryRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      order,
    });

    return entities.map(SubCategoryMapper.toDomain);
  }

  /**
   * Productos
   */
  async createProduct(
    data: Omit<Product, 'id' | 'deletedAt'>,
  ): Promise<Product> {
    // Verificamos la subcategoría
    const subcat = await this.subCategoryRepo.findOne({
      where: { id: data.subCategoryId },
    });
    if (!subcat) {
      throw new NotFoundException('SubCategory not found');
    }
    const entity = ProductMapper.toPersistence(data as Product);
    entity.subCategory = subcat;

    const saved = await this.productRepo.save(this.productRepo.create(entity));
    return ProductMapper.toDomain(saved);
  }

  async findProductById(id: number): Promise<NullableType<Product>> {
    const product = await this.productRepo.findOne({ where: { id } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async updateProduct(
    id: number,
    payload: Partial<Product>,
  ): Promise<NullableType<Product>> {
    const productEntity = await this.productRepo.findOne({ where: { id } });
    if (!productEntity) {
      return null;
    }

    // Si se está cambiando la subcategoría
    if (
      payload.subCategoryId &&
      payload.subCategoryId !== productEntity.subCategory.id
    ) {
      const subcat = await this.subCategoryRepo.findOne({
        where: { id: payload.subCategoryId },
      });
      if (!subcat) {
        throw new NotFoundException('SubCategory not found for product');
      }
      productEntity.subCategory = subcat;
    }

    const merged = this.productRepo.merge(
      productEntity,
      ProductMapper.toPersistence(payload as Product),
    );

    const saved = await this.productRepo.save(merged);
    return ProductMapper.toDomain(saved);
  }

  async removeProduct(id: number): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepo.softRemove(product);
  }

  async findProductsWithPagination(
    query: QueryProductDto,
    pagination: IPaginationOptions,
  ): Promise<Product[]> {
    const { page, limit } = pagination;
    const order = query.orderBy
      ? { [query.orderBy]: query.order?.toUpperCase() || 'ASC' }
      : {};

    const where: any = {};
    if (query.subCategoryId) {
      where.subCategory = { id: query.subCategoryId };
    }

    if (typeof query.inStock !== 'undefined' && query.inStock === true) {
      // Filtrar productos cuyo stock > 0
      where.stock = () => 'stock > 0';
    }

    const [entities] = await this.productRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      order,
    });

    return entities.map(ProductMapper.toDomain);
  }
} 