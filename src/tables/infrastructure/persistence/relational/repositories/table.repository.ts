import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TableRepository } from '../../../table.repository';
import { Table } from '../../../../domain/table';
import { TableEntity } from '../entities/table.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { TableMapper } from '../mappers/table.mapper';

@Injectable()
export class TablesRelationalRepository extends TableRepository {
  constructor(
    @InjectRepository(TableEntity)
    private readonly repository: Repository<TableEntity>,
  ) {
    super();
  }

  async create(data: Omit<Table, 'id'>): Promise<Table> {
    const entity = TableMapper.toPersistence(data as Table);
    const saved = await this.repository.save(this.repository.create(entity));
    return TableMapper.toDomain(saved);
  }

  async findById(id: Table['id']): Promise<NullableType<Table>> {
    const found = await this.repository.findOne({ where: { id: Number(id) } });
    return found ? TableMapper.toDomain(found) : null;
  }

  async findAll(): Promise<Table[]> {
    const entities = await this.repository.find();
    return entities.map((e) => TableMapper.toDomain(e));
  }

  async update(id: Table['id'], data: Partial<Table>): Promise<Table> {
    const existing = await this.repository.findOne({ where: { id: Number(id) } });
    if (!existing) {
      throw new Error('Table not found');
    }
    const toUpdate = {
      ...TableMapper.toDomain(existing),
      ...data,
    };
    const updatedEntity = await this.repository.save(
      this.repository.create(TableMapper.toPersistence(toUpdate)),
    );
    return TableMapper.toDomain(updatedEntity);
  }

  async remove(id: Table['id']): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Funde varias mesas en una mesa padre.
   */
  async mergeTables(parentTableId: Table['id'], childTableIds: Table['id'][]): Promise<void> {
    const parent = await this.repository.findOne({ where: { id: Number(parentTableId) } });
    if (!parent) {
      throw new Error('Parent table not found');
    }

    // Podrías usar un approach para setear parentTableId en las child tables,
    // o cualquier otra regla que aplique a tu dominio.
    await this.repository.update(
      { id: In(childTableIds.map(Number)) },
      { parentTableId: Number(parentTableId) },
    );
  }

  /**
   * Separa mesas que previamente se fusionaron.
   */
  async splitTables(tableId: Table['id']): Promise<void> {
    // Lógica para revertir el parentTableId en las child tables.
    // Por simplicidad, supongamos que "tableId" es la mesa padre
    // y todas las que tengan parentTableId = tableId se "liberan".
    await this.repository.update(
      { parentTableId: Number(tableId) },
      { parentTableId: null },
    );
  }
} 