import { Category } from '../../../../domain/category';
import { CategoryEntity } from '../entities/category.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { SubcategoryMapper } from '../../../../../subcategories/infrastructure/persistence/relational/mappers/Subcategory.mapper';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category | null {
    if (!entity) {
      return null;
    }

    const domain = new Category();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.description = entity.description;
    domain.isActive = entity.isActive;
    domain.photo = entity.photo ? FileMapper.toDomain(entity.photo) : null;
    domain.subCategories = entity.subCategories
      ? (entity.subCategories
          .map((subcategory) => SubcategoryMapper.toDomain(subcategory))
          .filter(Boolean) as any)
      : [];
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  static toEntity(domain: Category): CategoryEntity | null {
    if (!domain) {
      return null;
    }

    const entity = new CategoryEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.photoId = domain.photo?.id || null;

    return entity;
  }
}
