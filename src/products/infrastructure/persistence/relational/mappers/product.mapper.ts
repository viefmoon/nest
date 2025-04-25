import { Product } from '../../../../domain/product';
import { ProductEntity } from '../entities/product.entity';
import { SubcategoryMapper } from '../../../../../subcategories/infrastructure/persistence/relational/mappers/Subcategory.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { ProductVariantMapper } from '../../../../../product-variants/infrastructure/persistence/relational/mappers/product-variant.mapper';
import { ModifierGroupMapper } from '../../../../../modifier-groups/infrastructure/persistence/relational/mappers/modifier-group.mapper';
import { PreparationScreenMapper } from '../../../../../preparation-screens/infrastructure/persistence/relational/mappers/preparation-screen.mapper';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const product = new Product();
    product.id = entity.id;
    product.name = entity.name;
    product.price = entity.price;
    product.hasVariants = entity.hasVariants;
    product.isActive = entity.isActive;
    product.subcategoryId = entity.subCategoryId;
    product.photoId = entity.photoId;
    product.estimatedPrepTime = entity.estimatedPrepTime;
    product.createdAt = entity.createdAt;
    product.updatedAt = entity.updatedAt;
    product.deletedAt = entity.deletedAt;

    if (entity.photo) {
      product.photo = FileMapper.toDomain(entity.photo);
    }

    if (entity.subcategory) {
      product.subcategory = SubcategoryMapper.toDomain(entity.subcategory);
    }

    if (entity.variants) {
      product.variants = entity.variants.map((variant) =>
        ProductVariantMapper.toDomain(variant),
      );
    }

    if (entity.modifierGroups) {
      product.modifierGroups = entity.modifierGroups.map((group) =>
        ModifierGroupMapper.toDomain(group),
      );
    }

    if (entity.preparationScreen) {
      product.preparationScreen = PreparationScreenMapper.toDomain(
        entity.preparationScreen,
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
    entity.subCategoryId = domain.subcategoryId;
    entity.photoId = domain.photoId;
    entity.estimatedPrepTime = domain.estimatedPrepTime;

    if (domain.modifierGroups !== undefined) {
      entity.modifierGroups = domain.modifierGroups.map((group) =>
        ModifierGroupMapper.toEntity(group),
      );
    }

    if (domain.variants !== undefined) {
      entity.variants = domain.variants.map((variant) =>
        ProductVariantMapper.toEntity(variant),
      );
    }

    // Mapear preparationScreens si existen en el dominio
    // Similar al otro mapper, TypeORM maneja la tabla intermedia.
    // La asignación se hará en el servicio.

    return entity;
  }
}
