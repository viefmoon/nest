import { SubCategoryEntity } from '../entities/subcategory.entity';
import { SubCategory } from '../../../../domain/subcategory';

export class SubCategoryMapper {
  static toDomain(entity: SubCategoryEntity): SubCategory {
    const domain = new SubCategory();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.description = entity.description ?? null;
    domain.categoryId = entity.category?.id;
    domain.deletedAt = entity.deletedAt ?? null;

    return domain;
  }

  static toPersistence(domain: SubCategory): SubCategoryEntity {
    const entity = new SubCategoryEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.description = domain.description ?? null;
    // La relación con category la resolvemos a nivel del repositorio
    // (aquí podríamos mapear el categoryEntity si fuese necesario).
    entity.deletedAt = domain.deletedAt ?? null;

    return entity;
  }
}
