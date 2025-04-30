import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from '../../category.repository';
import { Category } from '../../../../domain/category';
import { CategoryMapper } from '../mappers/category.mapper';
import { Paginated } from '../../../../../common/types/paginated.type';

@Injectable()
export class CategoriesRelationalRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async create(data: Category): Promise<Category> {
    const entity = this.categoryMapper.toEntity(data);
    if (!entity) {
      throw new InternalServerErrorException('Error creating category entity');
    }
    const savedEntity = await this.categoryRepository.save(entity);
    const domainResult = this.categoryMapper.toDomain(savedEntity);
    if (!domainResult) {
      throw new InternalServerErrorException('Error mapping saved category entity to domain');
    }
    return domainResult;
  }

  async findOne(id: string): Promise<Category> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
      relations: ['photo', 'subcategories'],
    });

    const domainResult = entity ? this.categoryMapper.toDomain(entity) : null;
    if (!domainResult) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return domainResult;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<Paginated<Category>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.photo', 'photo')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .skip(skip)
      .take(limit);

    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    const [entities, count] = await queryBuilder.getManyAndCount();

    const domainResults = entities
      .map((entity) => this.categoryMapper.toDomain(entity))
      .filter((item): item is Category => item !== null);

    return new Paginated(domainResults, count, page, limit);
  }

  async update(id: string, data: Category): Promise<Category> {
    const entity = this.categoryMapper.toEntity(data);
    if (!entity) {
      throw new InternalServerErrorException(
        'Error creating category entity for update',
      );
    }

    await this.categoryRepository.update(id, entity);

    const updatedEntity = await this.categoryRepository.findOne({
      where: { id },
      relations: ['photo', 'subcategories'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    const domainResult = this.categoryMapper.toDomain(updatedEntity);
    if (!domainResult) {
      throw new InternalServerErrorException('Error mapping updated category entity to domain');
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
      .leftJoinAndSelect(
        'category.subcategories',
        'subcategory',
        'subcategory.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect(
        'subcategory.products',
        'product',
        'product.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect(
        'product.variants',
        'productVariant',
        'productVariant.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect(
        'product.modifierGroups',
        'modifierGroup',
        'modifierGroup.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect(
        'modifierGroup.productModifiers',
        'modifier',
        'modifier.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect('category.photo', 'categoryPhoto')
      .leftJoinAndSelect('subcategory.photo', 'subcategoryPhoto')
      .leftJoinAndSelect('product.photo', 'productPhoto')
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy({
        'category.name': 'ASC',
        'subcategory.name': 'ASC',
        'product.name': 'ASC',
      });

    const entities = await queryBuilder.getMany();

    const domainResults = entities
      .map((entity) => this.categoryMapper.toDomain(entity))
      .filter((item): item is Category => item !== null);

    return domainResults;
  }
}
