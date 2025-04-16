import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from '../../category.repository';
import { Category } from '../../../../domain/category';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class CategoriesRelationalRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: Category): Promise<Category> {
    const entity = CategoryMapper.toEntity(data);
    if (!entity) {
      throw new Error('No se pudo crear la entidad de categoría');
    }
    const savedEntity = await this.categoryRepository.save(entity);
    const domainResult = CategoryMapper.toDomain(savedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad guardada a dominio');
    }
    return domainResult;
  }

  async findOne(id: string): Promise<Category> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
      relations: ['photo', 'subCategories'],
    });

    const domainResult = entity ? CategoryMapper.toDomain(entity) : null;
    if (!domainResult) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return domainResult;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<[Category[], number]> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.photo', 'photo')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .skip(skip)
      .take(limit);

    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    const [entities, count] = await queryBuilder.getManyAndCount();

    const domainResults = entities
      .map(CategoryMapper.toDomain)
      .filter((item): item is Category => item !== null);

    return [domainResults, count];
  }

  async update(id: string, data: Category): Promise<Category> {
    const entity = CategoryMapper.toEntity(data);
    if (!entity) {
      throw new Error(
        'No se pudo crear la entidad de categoría para actualizar',
      );
    }

    await this.categoryRepository.update(id, entity);

    const updatedEntity = await this.categoryRepository.findOne({
      where: { id },
      relations: ['photo', 'subCategories'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    const domainResult = CategoryMapper.toDomain(updatedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad actualizada a dominio');
    }

    return domainResult;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.categoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }

  async findFullMenu(): Promise<Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      // Cargar subcategorías activas
      .leftJoinAndSelect(
        'category.subCategories',
        'subCategory',
        'subCategory.isActive = :isActive',
        { isActive: true },
      )
      // Cargar productos activos dentro de subcategorías activas
      .leftJoinAndSelect(
        'subCategory.products',
        'product',
        'product.isActive = :isActive',
        { isActive: true },
      )
      // Cargar variantes de producto activas dentro de productos activos
      .leftJoinAndSelect(
        'product.variants',
        'productVariant',
        'productVariant.isActive = :isActive',
        { isActive: true },
      )
      // Cargar grupos de modificadores activos dentro de productos activos
      .leftJoinAndSelect(
        'product.modifierGroups',
        'modifierGroup',
        'modifierGroup.isActive = :isActive',
        { isActive: true },
      )
      // Cargar modificadores activos dentro de grupos de modificadores activos
      .leftJoinAndSelect(
        'modifierGroup.productModifiers',
        'modifier',
        'modifier.isActive = :isActive',
        { isActive: true },
      )
      // --- Añadir Joins para Fotos ---
      .leftJoinAndSelect('category.photo', 'categoryPhoto')
      .leftJoinAndSelect('subCategory.photo', 'subCategoryPhoto')
      .leftJoinAndSelect('product.photo', 'productPhoto')
      // --- Fin Joins para Fotos ---
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy({
        'category.name': 'ASC',
        'subCategory.name': 'ASC',
        'product.name': 'ASC',
      });

    const entities = await queryBuilder.getMany();

    // Mapear a dominio
    const domainResults = entities
      .map(CategoryMapper.toDomain)
      .filter((item): item is Category => item !== null);

    return domainResults;
  }
}
