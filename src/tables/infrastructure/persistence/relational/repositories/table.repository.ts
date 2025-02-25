import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Table } from '../../../../domain/table';
import { FindAllTablesDto } from '../../../../dto/find-all-tables.dto';
import { TableRepository } from '../../table.repository';
import { TableEntity } from '../entities/table.entity';
import { TableMapper } from '../mappers/table.mapper';

@Injectable()
export class TablesRelationalRepository implements TableRepository {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tablesRepository: Repository<TableEntity>,
  ) {}

  async create(data: Table): Promise<Table> {
    const persistenceModel = TableMapper.toPersistence(data);
    const newEntity = await this.tablesRepository.save(
      this.tablesRepository.create(persistenceModel),
    );
    return TableMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllTablesDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Table[]> {
    const where: FindOptionsWhere<TableEntity> = {};

    if (filterOptions?.name) {
      where.name = filterOptions.name;
    }

    if (filterOptions?.areaId) {
      where.areaId = filterOptions.areaId;
    }

    if (filterOptions?.capacity !== undefined) {
      where.capacity = filterOptions.capacity;
    }

    if (filterOptions?.isActive !== undefined) {
      where.isActive = filterOptions.isActive;
    }

    if (filterOptions?.isAvailable !== undefined) {
      where.isAvailable = filterOptions.isAvailable;
    }

    if (filterOptions?.isTemporary !== undefined) {
      where.isTemporary = filterOptions.isTemporary;
    }

    const entities = await this.tablesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });

    return entities.map((table) => TableMapper.toDomain(table));
  }

  async findById(id: Table['id']): Promise<NullableType<Table>> {
    const entity = await this.tablesRepository.findOne({
      where: { id },
    });

    return entity ? TableMapper.toDomain(entity) : null;
  }

  async findByName(name: Table['name']): Promise<NullableType<Table>> {
    const entity = await this.tablesRepository.findOne({
      where: { name },
    });

    return entity ? TableMapper.toDomain(entity) : null;
  }

  async findByAreaId(areaId: Table['areaId']): Promise<Table[]> {
    const entities = await this.tablesRepository.find({
      where: { areaId },
    });

    return entities.map((table) => TableMapper.toDomain(table));
  }

  async update(id: Table['id'], payload: Partial<Table>): Promise<Table> {
    const entity = await this.tablesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Table not found');
    }

    const updatedEntity = await this.tablesRepository.save(
      this.tablesRepository.create(
        TableMapper.toPersistence({
          ...TableMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TableMapper.toDomain(updatedEntity);
  }

  async remove(id: Table['id']): Promise<void> {
    await this.tablesRepository.softDelete(id);
  }
}
