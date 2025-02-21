import { Area } from '../../../../domain/area';
import { AreaEntity } from '../entities/area.entity';

export class AreaMapper {
  static toDomain(entity: AreaEntity): Area {
    const domain = new Area();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.description = entity.description ?? null;
    return domain;
  }

  static toPersistence(domain: Area): AreaEntity {
    const entity = new AreaEntity();
    if (typeof domain.id === 'number') {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.description = domain.description;
    return entity;
  }
} 