import { Product } from '../../../../domain/product';
import { ProductEntity } from '../entities/product.entity';
import { SubCategoryMapper } from '../../../../../subcategories/infrastructure/persistence/relational/mappers/subcategory.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { ProductVariantMapper } from '../../../../../product-variants/infrastructure/persistence/relational/mappers/product-variant.mapper';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const product = new Product();
    product.id = entity.id;
    product.name = entity.name;
    product.price = entity.price;
    product.hasVariants = entity.hasVariants;
    product.isActive = entity.isActive;
    product.subCategoryId = entity.subCategoryId;
    product.photoId = entity.photoId;
    product.estimatedPrepTime = entity.estimatedPrepTime;
    product.preparationScreenId = entity.preparationScreenId;
    product.createdAt = entity.createdAt;
    product.updatedAt = entity.updatedAt;
    product.deletedAt = entity.deletedAt;

    if (entity.photo) {
      product.photo = FileMapper.toDomain(entity.photo);
    }

    if (entity.subCategory) {
      product.subCategory = SubCategoryMapper.toDomain(entity.subCategory);
    }

    if (entity.variants) {
      product.variants = entity.variants.map((variant) =>
        ProductVariantMapper.toDomain(variant),
      );
    }

    return product;
  }

  static toEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.price = domain.price;
    entity.hasVariants = domain.hasVariants;
    entity.isActive = domain.isActive;
    entity.subCategoryId = domain.subCategoryId;
    entity.photoId = domain.photoId;
    entity.estimatedPrepTime = domain.estimatedPrepTime;
    entity.preparationScreenId = domain.preparationScreenId;

    return entity;
  }
}
