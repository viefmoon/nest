import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreparationScreenEntity } from '../entities/preparation-screen.entity';
import { PreparationScreenMapper } from '../mappers/preparation-screen.mapper';
import {
  FindPreparationScreensRepositoryDto,
  PreparationScreenRepository,
} from '../../preparation-screen.repository'; // Import updated interface and DTO type
import { PreparationScreen } from '../../../../domain/preparation-screen';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { ProductEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product.entity';
import { FindOptionsWhere, In } from 'typeorm'; // Import necessary TypeORM types
@Injectable()
export class PreparationScreensRelationalRepository
  implements PreparationScreenRepository
{
  constructor(
    @InjectRepository(PreparationScreenEntity)
    private readonly preparationScreenRepository: Repository<PreparationScreenEntity>,
  ) {}

  async save(
    domainEntity: PreparationScreen,
  ): Promise<PreparationScreen> {
    const persistenceEntity =
      PreparationScreenMapper.toPersistence(domainEntity);

    // Ensure products are mapped correctly for saving relations
    if (domainEntity.products) {
      persistenceEntity.products = domainEntity.products.map(
        (p) => ({ id: p.id }) as ProductEntity,
      );
    } else {
       // If domainEntity.products is null or undefined, ensure persistenceEntity.products is handled
       // Depending on TypeORM config, might need to set to [] or handle differently
       persistenceEntity.products = [];
    }


    const newEntity =
      await this.preparationScreenRepository.save(persistenceEntity);

    // It's often better to reload the entity after save to get all default values and relations populated correctly by the DB/ORM
    const reloadedEntity = await this.preparationScreenRepository.findOne({
       where: { id: newEntity.id },
       relations: ['products'], // Ensure relations are loaded
     });

     if (!reloadedEntity) {
       // This should ideally not happen after a successful save
       throw new Error(`Failed to reload entity with id ${newEntity.id} after save.`);
     }

    return PreparationScreenMapper.toDomain(reloadedEntity);
  }

  async findAll(
    options: FindPreparationScreensRepositoryDto,
  ): Promise<[PreparationScreen[], number]> {
    // Extract pagination options, providing defaults if necessary
    const page = options.paginationOptions?.page ?? 1;
    const limit = options.paginationOptions?.limit ?? 10;
    // Extract filter options directly from the root 'options' object
    const { name, isActive } = options;
    const where: FindOptionsWhere<PreparationScreenEntity> = {};

    if (name) {
      // Add filtering logic if needed, e.g., using Like operator
      // where.name = Like(`%${name}%`);
      where.name = name; // Exact match for now
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [entities, total] = await this.preparationScreenRepository.findAndCount(
      {
        where,
        skip: (page - 1) * limit, // Use destructured page and limit
        take: limit, // Use destructured limit
        order: {
          name: 'ASC', // Or other default sorting
        },
        relations: ['products'], // Load relations if needed for the list view
      },
    );

    return [entities.map(PreparationScreenMapper.toDomain), total];
  }

  async findOne(id: string): Promise<NullableType<PreparationScreen>> {
    const entity = await this.preparationScreenRepository.findOne({
      where: { id },
      relations: ['products'], // Ensure relations are loaded for detail view
    });

    return entity ? PreparationScreenMapper.toDomain(entity) : null;
  }

  // findByName is not part of the standard interface, remove or keep if specifically needed elsewhere

  async findByIds(ids: string[]): Promise<PreparationScreen[]> {
    if (ids.length === 0) {
      return []; // Return empty array if no IDs are provided
    }
    const entities = await this.preparationScreenRepository.find({
      where: { id: In(ids) },
      relations: ['products'], // Load relations if needed
    });
    return entities.map(PreparationScreenMapper.toDomain);
  }

  // The 'update' method is replaced by 'save'.
  // The 'save' method handles both creation and updates based on the presence of an ID.

  async softDelete(id: string): Promise<void> {
    await this.preparationScreenRepository.softDelete(id);
  }
}
