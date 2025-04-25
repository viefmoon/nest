import { ProductVariant } from '../../../../domain/product-variant';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductMapper } from '../../../../../products/infrastructure/persistence/relational/mappers/product.mapper';
import { ProductEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product.entity'; // Necesario para stub

export class ProductVariantMapper {
  static toDomain(entity: ProductVariantEntity): ProductVariant {
    const productVariant = new ProductVariant();
    productVariant.id = entity.id;
    productVariant.productId = entity.productId;
    productVariant.name = entity.name;
    productVariant.price = entity.price;
    productVariant.isActive = entity.isActive;
    productVariant.createdAt = entity.createdAt;
    productVariant.updatedAt = entity.updatedAt;
    productVariant.deletedAt = entity.deletedAt;

    if (entity.product) {
      productVariant.product = ProductMapper.toDomain(entity.product);
    }

    return productVariant;
  }

  static toPersistence(domain: ProductVariant): ProductVariantEntity {
    const entity = new ProductVariantEntity();
    entity.id = domain.id;
    entity.product = { id: domain.productId } as ProductEntity;
    entity.name = domain.name;
    entity.price = domain.price;
    entity.isActive = domain.isActive;

    return entity;
  }
}
