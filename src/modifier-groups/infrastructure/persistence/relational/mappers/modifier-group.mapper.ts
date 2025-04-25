import { ModifierGroup } from '../../../../domain/modifier-group';
import { ModifierGroupEntity } from '../entities/modifier-group.entity';
import { ProductModifierMapper } from '../../../../../product-modifiers/infrastructure/persistence/relational/mappers/product-modifier.mapper';

export class ModifierGroupMapper {
  static toDomain(entity: ModifierGroupEntity): ModifierGroup {
    const group = new ModifierGroup();
    group.id = entity.id;
    group.name = entity.name;
    group.description = entity.description;
    group.minSelections = entity.minSelections;
    group.maxSelections = entity.maxSelections;
    group.isRequired = entity.isRequired;
    group.allowMultipleSelections = entity.allowMultipleSelections;
    group.isActive = entity.isActive;
    group.createdAt = entity.createdAt;
    group.updatedAt = entity.updatedAt;
    group.deletedAt = entity.deletedAt;

    if (entity.productModifiers) {
      group.productModifiers = entity.productModifiers.map((modifier) =>
        ProductModifierMapper.toDomain(modifier),
      );
    } else {
      group.productModifiers = [];
    }


    return group;
  }

  static toPersistence(domain: ModifierGroup): ModifierGroupEntity {
    const entity = new ModifierGroupEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.minSelections = domain.minSelections;
    entity.maxSelections = domain.maxSelections;
    entity.isRequired = domain.isRequired;
    entity.allowMultipleSelections = domain.allowMultipleSelections;
    entity.isActive = domain.isActive;
    // No mapear relaciones inversas ni timestamps generados automáticamente
    return entity;
  }
}
