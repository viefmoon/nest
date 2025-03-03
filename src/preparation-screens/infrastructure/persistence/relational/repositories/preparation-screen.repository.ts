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
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

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
    const persistenceModel = this.preparationScreenRepository.create(
      data as DeepPartial<PreparationScreenEntity>,
    );
    const newEntity =
      await this.preparationScreenRepository.save(persistenceModel);
    return PreparationScreenMapper.toDomain(newEntity);
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
        displayOrder: 'ASC',
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
    payload: DeepPartial<PreparationScreen>,
  ): Promise<PreparationScreen | null> {
    const entity = await this.preparationScreenRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.preparationScreenRepository.save({
      ...entity,
      ...payload,
    });

    return PreparationScreenMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.preparationScreenRepository.softDelete(id);
  }
}
