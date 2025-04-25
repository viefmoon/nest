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

    // Cargar la entidad completa con el área
    const completeEntity = await this.tablesRepository.findOne({
      where: { id: newEntity.id },
      relations: ['area'],
    });

    if (!completeEntity) {
      throw new Error(
        `No se pudo cargar la tabla creada con ID ${newEntity.id}`,
      );
    }

    return TableMapper.toDomain(completeEntity);
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
      where.area = { id: filterOptions.areaId };
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
      relations: ['area'],
    });

    return entities.map((table) => TableMapper.toDomain(table));
  }

  async findById(id: Table['id']): Promise<NullableType<Table>> {
    const entity = await this.tablesRepository.findOne({
      where: { id },
      relations: ['area'],
    });

    return entity ? TableMapper.toDomain(entity) : null;
  }

  async findByName(name: Table['name']): Promise<NullableType<Table>> {
    const entity = await this.tablesRepository.findOne({
      where: { name },
      relations: ['area'],
    });

    return entity ? TableMapper.toDomain(entity) : null;
  }

  async findByAreaId(areaId: Table['areaId']): Promise<Table[]> {
    const entities = await this.tablesRepository.find({
      where: { area: { id: areaId } },
      relations: ['area'],
    });

    return entities.map((table) => TableMapper.toDomain(table));
  }

  async update(id: Table['id'], payload: Partial<Table>): Promise<Table> {
    const entity = await this.tablesRepository.findOne({
      where: { id },
      relations: ['area'],
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

    // Cargar la entidad actualizada con el área
    const completeEntity = await this.tablesRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['area'],
    });

    if (!completeEntity) {
      throw new Error(
        `No se pudo cargar la tabla actualizada con ID ${updatedEntity.id}`,
      );
    }

    return TableMapper.toDomain(completeEntity);
  }

  async remove(id: Table['id']): Promise<void> {
    await this.tablesRepository.softDelete(id);
  }
}
