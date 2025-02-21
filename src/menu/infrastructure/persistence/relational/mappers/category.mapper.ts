import { CategoryEntity } from '../entities/category.entity';
import { Category } from '../../../../domain/category';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category {
    const domain = new Category();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.description = entity.description ?? null;
    domain.deletedAt = entity.deletedAt ?? null;

    return domain;
  }

  static toPersistence(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.description = domain.description ?? null;
    entity.deletedAt = domain.deletedAt ?? null;

    return entity;
  }
}
