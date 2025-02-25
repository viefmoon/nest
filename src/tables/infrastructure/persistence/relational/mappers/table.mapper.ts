import { AreaMapper } from '../../../../../areas/infrastructure/persistence/relational/mappers/area.mapper';
import { Table } from '../../../../domain/table';
import { TableEntity } from '../entities/table.entity';

export class TableMapper {
  static toDomain(raw: TableEntity): Table {
    const domainEntity = new Table();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.areaId = raw.areaId;
    domainEntity.capacity = raw.capacity;
    domainEntity.isActive = raw.isActive;
    domainEntity.isAvailable = raw.isAvailable;
    domainEntity.isTemporary = raw.isTemporary;
    domainEntity.temporaryIdentifier = raw.temporaryIdentifier;
    if (!raw.area) {
      throw new Error(`La tabla ${raw.id} no tiene un área asociada`);
    }
    domainEntity.area = AreaMapper.toDomain(raw.area);
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Table): TableEntity {
    const persistenceEntity = new TableEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.areaId = domainEntity.areaId;
    persistenceEntity.capacity = domainEntity.capacity;
    persistenceEntity.isActive = domainEntity.isActive;
    persistenceEntity.isAvailable = domainEntity.isAvailable;
    persistenceEntity.isTemporary = domainEntity.isTemporary;
    persistenceEntity.temporaryIdentifier = domainEntity.temporaryIdentifier;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
