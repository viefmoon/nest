import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Area } from '../../../../domain/area';
import { FindAllAreasDto } from '../../../../dto/find-all-areas.dto';
import { AreaRepository } from '../../area.repository';
import { AreaEntity } from '../entities/area.entity';
import { AreaMapper } from '../mappers/area.mapper';

@Injectable()
export class AreasRelationalRepository implements AreaRepository {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areasRepository: Repository<AreaEntity>,
  ) {}

  async create(data: Area): Promise<Area> {
    const persistenceModel = AreaMapper.toPersistence(data);
    const newEntity = await this.areasRepository.save(
      this.areasRepository.create(persistenceModel),
    );
    return AreaMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllAreasDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Area[]> {
    const where: FindOptionsWhere<AreaEntity> = {};

    if (filterOptions?.name) {
      where.name = filterOptions.name;
    }

    if (filterOptions?.isActive !== undefined) {
      where.isActive = filterOptions.isActive;
    }

    const entities = await this.areasRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });

    return entities.map((area) => AreaMapper.toDomain(area));
  }

  async findById(id: Area['id']): Promise<NullableType<Area>> {
    const entity = await this.areasRepository.findOne({
      where: { id },
    });

    return entity ? AreaMapper.toDomain(entity) : null;
  }

  async findByName(name: Area['name']): Promise<NullableType<Area>> {
    const entity = await this.areasRepository.findOne({
      where: { name },
    });

    return entity ? AreaMapper.toDomain(entity) : null;
  }

  async update(id: Area['id'], payload: Partial<Area>): Promise<Area> {
    const entity = await this.areasRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Area not found');
    }

    const updatedEntity = await this.areasRepository.save(
      this.areasRepository.create(
        AreaMapper.toPersistence({
          ...AreaMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AreaMapper.toDomain(updatedEntity);
  }

  async remove(id: Area['id']): Promise<void> {
    await this.areasRepository.softDelete(id);
  }
}
