import { NullableType } from '../../../utils/types/nullable.type';
import { Table } from '../../domain/table';

export abstract class TableRepository {
  abstract create(data: Omit<Table, 'id'>): Promise<Table>;
  abstract findById(id: Table['id']): Promise<NullableType<Table>>;
  abstract findAll(): Promise<Table[]>;
  abstract update(id: Table['id'], data: Partial<Table>): Promise<Table>;
  abstract remove(id: Table['id']): Promise<void>;

  abstract mergeTables(parentTableId: Table['id'], childTableIds: Table['id'][]): Promise<void>;
  abstract splitTables(tableId: Table['id']): Promise<void>;
} 