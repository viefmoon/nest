import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariant } from '../../../../domain/product-variant';

export class ProductVariantMapper {
  static toDomain(entity: ProductVariantEntity): ProductVariant {
    const domain = new ProductVariant();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.price = entity.price;
    domain.productId = entity.product?.id;
    domain.deletedAt = entity.deletedAt ?? null;

    return domain;
  }

  static toPersistence(domain: ProductVariant): ProductVariantEntity {
    const entity = new ProductVariantEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.price = domain.price;
    entity.deletedAt = domain.deletedAt ?? null;
    // La relación con product se asigna en el repositorio

    return entity;
  }
} 