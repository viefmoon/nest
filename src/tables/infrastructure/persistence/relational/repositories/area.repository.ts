import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaRepository } from '../../../area.repository';
import { Area } from '../../../../domain/area';
import { AreaEntity } from '../entities/area.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AreaMapper } from '../mappers/area.mapper';

@Injectable()
export class AreasRelationalRepository extends AreaRepository {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly repository: Repository<AreaEntity>,
  ) {
    super();
  }

  async create(data: Omit<Area, 'id'>): Promise<Area> {
    const entity = AreaMapper.toPersistence(data as Area);
    const saved = await this.repository.save(this.repository.create(entity));
    return AreaMapper.toDomain(saved);
  }

  async findById(id: Area['id']): Promise<NullableType<Area>> {
    const found = await this.repository.findOne({ where: { id: Number(id) } });
    return found ? AreaMapper.toDomain(found) : null;
  }

  async findAll(): Promise<Area[]> {
    const entities = await this.repository.find();
    return entities.map((e) => AreaMapper.toDomain(e));
  }

  async update(id: Area['id'], data: Partial<Area>): Promise<Area> {
    const existing = await this.repository.findOne({ where: { id: Number(id) } });
    if (!existing) {
      throw new Error('Area not found');
    }
    const toUpdate = {
      ...AreaMapper.toDomain(existing),
      ...data,
    };
    const updatedEntity = await this.repository.save(
      this.repository.create(AreaMapper.toPersistence(toUpdate)),
    );
    return AreaMapper.toDomain(updatedEntity);
  }

  async remove(id: Area['id']): Promise<void> {
    await this.repository.softDelete(id);
  }
} 