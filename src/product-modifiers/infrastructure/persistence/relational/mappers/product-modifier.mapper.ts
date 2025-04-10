import { ProductModifier } from '../../../../domain/product-modifier';
import { ProductModifierEntity } from '../entities/product-modifier.entity';

export class ProductModifierMapper {
  static toDomain(entity: ProductModifierEntity): ProductModifier {
    const domain = new ProductModifier();
    domain.id = entity.id;
    domain.groupId = entity.groupId;
    domain.name = entity.name;
    domain.description = entity.description;
    domain.price = entity.price;
    domain.sortOrder = entity.sortOrder;
    domain.isDefault = entity.isDefault;
    domain.isActive = entity.isActive;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistence(domain: ProductModifier): ProductModifierEntity {
    const entity = new ProductModifierEntity();
    entity.id = domain.id;
    entity.groupId = domain.groupId;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.price = domain.price;
    entity.sortOrder = domain.sortOrder;
    entity.isDefault = domain.isDefault;
    entity.isActive = domain.isActive;
    return entity;
  }
}
