import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreparationScreenEntity } from '../entities/preparation-screen.entity';
import { PreparationScreenMapper } from '../mappers/preparation-screen.mapper';
import { PreparationScreenRepository } from '../../preparation-screen.repository';
import { PreparationScreen } from '../../../../domain/preparation-screen';
import { FindAllPreparationScreensDto } from '../../../../dto/find-all-preparation-screens.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
// Use TypeORM's DeepPartial
import { DeepPartial } from 'typeorm';
import { ProductEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product.entity';

@Injectable()
export class PreparationScreensRelationalRepository
  implements PreparationScreenRepository
{
  constructor(
    @InjectRepository(PreparationScreenEntity)
    private readonly preparationScreenRepository: Repository<PreparationScreenEntity>,
  ) {}

  async create(
    data: Omit<
      PreparationScreen,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<PreparationScreen> {
    // Create entity with scalar data first
    const screenEntity = this.preparationScreenRepository.create({
      name: data.name,
      description: data.description,
      isActive: data.isActive,
    });

    // Assign product entities with only IDs if they exist in the domain data
    if (data.products && data.products.length > 0) {
      screenEntity.products = data.products.map(
        (p) => ({ id: p.id }) as ProductEntity,
      );
    } else {
      screenEntity.products = []; // Ensure it's an empty array if no products
    }

    // Save the entity with the relations assigned
    const newEntity = await this.preparationScreenRepository.save(screenEntity);

    // Reload to get the full entity with relations populated
    const reloadedEntity = await this.preparationScreenRepository.findOne({
      where: { id: newEntity.id },
      relations: ['products'], // Ensure products are loaded
    });

    if (!reloadedEntity) {
      // Should not happen, but good practice to check
      throw new Error(`Failed to reload entity ${newEntity.id} after create.`);
    }

    return PreparationScreenMapper.toDomain(reloadedEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllPreparationScreensDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PreparationScreen[]> {
    const where: any = {};

    if (filterOptions?.name) {
      where.name = filterOptions.name;
    }

    if (filterOptions?.isActive !== undefined) {
      where.isActive = filterOptions.isActive;
    }

    const entities = await this.preparationScreenRepository.find({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: {
        name: 'ASC',
      },
    });

    return entities.map(PreparationScreenMapper.toDomain);
  }

  async findById(id: string): Promise<NullableType<PreparationScreen>> {
    const entity = await this.preparationScreenRepository.findOne({
      where: { id },
    });

    return entity ? PreparationScreenMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<NullableType<PreparationScreen>> {
    const entity = await this.preparationScreenRepository.findOne({
      where: { name },
    });

    return entity ? PreparationScreenMapper.toDomain(entity) : null;
  }

  async update(
    id: string,
    payload: DeepPartial<PreparationScreen>, // Use TypeORM's DeepPartial
  ): Promise<PreparationScreen | null> {
    const entity = await this.preparationScreenRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    // Apply scalar updates directly to the fetched entity
    // Use Object.assign or loop through payload keys
    Object.assign(entity, {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    });

    // If payload.products is defined, update the relation
    // Assigning a new array of entities (even just with IDs) tells TypeORM to manage the relation
    if (payload.products !== undefined) {
      if (payload.products.length > 0) {
        entity.products = payload.products
          .filter((p) => !!p?.id) // Filter out undefined products or those without an id
          .map((p) => ({ id: p.id }) as ProductEntity);
      } else {
        entity.products = []; // Assign empty array to remove all relations
      }
    }
    // Note: If payload.products is undefined, we don't touch entity.products, leaving it as is.

    // Save the modified entity. TypeORM will handle the ManyToMany update.
    const updatedEntity = await this.preparationScreenRepository.save(entity);

    // Reload to ensure relations are correctly fetched after save
    const reloadedEntity = await this.preparationScreenRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['products'], // Ensure products are loaded
    });

    if (!reloadedEntity) {
      // Should not happen if save was successful
      throw new Error(`Failed to reload entity ${id} after update.`);
    }

    return PreparationScreenMapper.toDomain(reloadedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.preparationScreenRepository.softDelete(id);
  }
}
