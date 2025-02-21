import { ProductEntity } from '../entities/product.entity';
import { Product } from '../../../../domain/product';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const domain = new Product();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.price = entity.price ?? null;
    domain.hasVariants = entity.hasVariants;
    domain.stock = entity.stock;
    domain.subCategoryId = entity.subCategory?.id;
    domain.photoId = entity.photoId ?? null;
    domain.estimatedPrepTime = entity.estimatedPrepTime ?? 0;
    domain.deletedAt = entity.deletedAt ?? null;

    return domain;
  }

  static toPersistence(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.price = domain.price ?? null;
    entity.hasVariants = domain.hasVariants;
    entity.stock = domain.stock;
    // La subCategoría se asigna en el repositorio
    entity.photoId = domain.photoId ?? null;
    entity.estimatedPrepTime = domain.estimatedPrepTime ?? null;
    entity.deletedAt = domain.deletedAt ?? null;

    return entity;
  }
}
