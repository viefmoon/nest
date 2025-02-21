import { Table } from '../../../../domain/table';
import { TableEntity } from '../entities/table.entity';
import { AreaMapper } from './area.mapper';

export class TableMapper {
  static toDomain(entity: TableEntity): Table {
    const domain = new Table();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.isTemporary = entity.isTemporary;
    domain.parentTableId = entity.parentTableId ?? null;

    if (entity.area) {
      domain.area = AreaMapper.toDomain(entity.area);
    }
    return domain;
  }

  static toPersistence(domain: Table): TableEntity {
    const entity = new TableEntity();
    if (typeof domain.id === 'number') {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.isTemporary = domain.isTemporary;
    entity.parentTableId = domain.parentTableId ?? null;

    if (domain.area) {
      entity.area = AreaMapper.toPersistence(domain.area);
    }
    return entity;
  }
} 