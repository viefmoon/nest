import { SubCategory } from '../../../../domain/subcategory';
import { SubCategoryEntity } from '../entities/subcategory.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { CategoryMapper } from '../../../../../categories/infrastructure/persistence/relational/mappers/category.mapper';

export class SubCategoryMapper {
  static toDomain(entity: SubCategoryEntity): SubCategory | null {
    if (!entity) {
      return null;
    }

    const domain = new SubCategory();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.description = entity.description;
    domain.isActive = entity.isActive;
    domain.categoryId = entity.categoryId;
    domain.photo = entity.photo ? FileMapper.toDomain(entity.photo) : null;

    // Asignar la categoría solo si existe y se puede mapear correctamente
    const categoryDomain = entity.category
      ? CategoryMapper.toDomain(entity.category)
      : null;
    if (categoryDomain) {
      domain.category = categoryDomain;
    }

    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  static toEntity(domain: SubCategory): SubCategoryEntity | null {
    if (!domain) {
      return null;
    }

    const entity = new SubCategoryEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.categoryId = domain.categoryId;
    entity.photoId = domain.photo?.id || null;

    return entity;
  }
}
