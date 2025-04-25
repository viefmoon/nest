import { Subcategory } from '../../../../domain/Subcategory';
import { SubcategoryEntity } from '../entities/Subcategory.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { CategoryMapper } from '../../../../../categories/infrastructure/persistence/relational/mappers/category.mapper';
import { ProductMapper } from '../../../../../products/infrastructure/persistence/relational/mappers/product.mapper'; // Importar ProductMapper

export class SubcategoryMapper {
  static toDomain(entity: SubcategoryEntity): Subcategory | null {
    if (!entity) {
      return null;
    }

    const domain = new Subcategory();
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

    // Mapear productos si existen en la entidad cargada
    domain.products = entity.products
      ? (entity.products
          .map((product) => ProductMapper.toDomain(product)) // Usar ProductMapper
          .filter(Boolean) as any) // Filtrar nulos/undefined si ProductMapper puede devolverlos
      : [];

    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  static toEntity(domain: Subcategory): SubcategoryEntity | null {
    if (!domain) {
      return null;
    }

    const entity = new SubcategoryEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.categoryId = domain.categoryId;
    entity.photoId = domain.photo?.id || null;

    return entity;
  }
}
