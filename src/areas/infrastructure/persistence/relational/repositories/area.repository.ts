import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { mapArray } from '../../../../../common/mappers/base.mapper';
import { Area } from '../../../../domain/area';
import { FindAllAreasDto } from '../../../../dto/find-all-areas.dto';
import { Paginated } from '../../../../../common/types/paginated.type';
import { AreaRepository } from '../../area.repository';
import { AreaEntity } from '../entities/area.entity';
import { AreaMapper } from '../mappers/area.mapper';

@Injectable()
export class AreasRelationalRepository implements AreaRepository {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areasRepository: Repository<AreaEntity>,
    private readonly areaMapper: AreaMapper,
  ) {}

  async create(data: Area): Promise<Area> {
    const persistenceModel = this.areaMapper.toEntity(data);
    const newEntity = await this.areasRepository.save(
      this.areasRepository.create(persistenceModel!),
    );
    return this.areaMapper.toDomain(newEntity)!;
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllAreasDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Paginated<Area>> {
    const where: FindOptionsWhere<AreaEntity> = {};

    if (filterOptions?.name) {
      where.name = filterOptions.name;
    }

    if (filterOptions?.isActive !== undefined) {
      where.isActive = filterOptions.isActive;
    }

    const [entities, total] = await this.areasRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });

    const items = mapArray(entities, (entity) => this.areaMapper.toDomain(entity));
    return new Paginated(items, total, paginationOptions.page, paginationOptions.limit);
  }

  async findById(id: Area['id']): Promise<NullableType<Area>> {
    const entity = await this.areasRepository.findOne({
      where: { id },
    });

    return entity ? this.areaMapper.toDomain(entity) : null;
  }

  async findByName(name: Area['name']): Promise<NullableType<Area>> {
    const entity = await this.areasRepository.findOne({
      where: { name },
    });

    return entity ? this.areaMapper.toDomain(entity) : null;
  }

  async update(id: Area['id'], payload: Partial<Area>): Promise<Area> {
    const entity = await this.areasRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Area not found');
    }

    const updatedEntity = await this.areasRepository.save(
      this.areasRepository.create(
        this.areaMapper.toEntity({
          ...this.areaMapper.toDomain(entity)!,
          ...payload,
        } as Area)!,
      ),
    );

    return this.areaMapper.toDomain(updatedEntity as AreaEntity)!;
  }

  async remove(id: Area['id']): Promise<void> {
    await this.areasRepository.softDelete(id);
  }
}
