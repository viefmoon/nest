import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductModifier } from '../../domain/product-modifier';
import { ProductModifierEntity } from './relational/entities/product-modifier.entity';
import { ProductModifierMapper } from './relational/mappers/product-modifier.mapper';
import { FindAllProductModifiersDto } from '../../dto/find-all-product-modifiers.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

@Injectable()
export class ProductModifierRepository {
  constructor(
    @InjectRepository(ProductModifierEntity)
    private readonly productModifierEntityRepository: Repository<ProductModifierEntity>,
  ) {}

  async create(data: ProductModifier): Promise<ProductModifier> {
    const persistenceModel = ProductModifierMapper.toPersistence(data);
    const newEntity =
      await this.productModifierEntityRepository.save(persistenceModel);
    return ProductModifierMapper.toDomain(newEntity);
  }

  async findById(id: string): Promise<ProductModifier | null> {
    const entity = await this.productModifierEntityRepository.findOne({
      where: { id },
    });
    return entity ? ProductModifierMapper.toDomain(entity) : null;
  }

  async findByGroupId(groupId: string): Promise<ProductModifier[]> {
    const entities = await this.productModifierEntityRepository.find({
      where: { groupId },
      order: { sortOrder: 'ASC' },
    });
    return entities.map((entity) => ProductModifierMapper.toDomain(entity));
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions: FindAllProductModifiersDto;
    paginationOptions: IPaginationOptions;
  }): Promise<ProductModifier[]> {
    const queryBuilder =
      this.productModifierEntityRepository.createQueryBuilder(
        'product_modifier',
      );

    if (filterOptions.groupId) {
      queryBuilder.andWhere('product_modifier.group_id = :groupId', {
        groupId: filterOptions.groupId,
      });
    }

    if (filterOptions.name) {
      queryBuilder.andWhere('product_modifier.name ILIKE :name', {
        name: `%${filterOptions.name}%`,
      });
    }

    if (filterOptions.isActive !== undefined) {
      queryBuilder.andWhere('product_modifier.is_active = :isActive', {
        isActive: filterOptions.isActive,
      });
    }

    if (filterOptions.isDefault !== undefined) {
      queryBuilder.andWhere('product_modifier.is_default = :isDefault', {
        isDefault: filterOptions.isDefault,
      });
    }

    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    const take = paginationOptions.limit;

    queryBuilder
      .orderBy('product_modifier.sort_order', 'ASC')
      .addOrderBy('product_modifier.name', 'ASC')
      .skip(skip)
      .take(take);

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => ProductModifierMapper.toDomain(entity));
  }

  async update(
    id: string,
    data: Partial<ProductModifier>,
  ): Promise<ProductModifier | null> {
    const entity = await this.productModifierEntityRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.productModifierEntityRepository.save({
      ...entity,
      ...data,
    });

    return ProductModifierMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.productModifierEntityRepository.softDelete(id);
  }
}
