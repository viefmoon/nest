import { PreparationScreen } from '../../../../domain/preparation-screen';
import { PreparationScreenEntity } from '../entities/preparation-screen.entity';

export class PreparationScreenMapper {
  static toDomain(entity: PreparationScreenEntity): PreparationScreen {
    const preparationScreen = new PreparationScreen();
    preparationScreen.id = entity.id;
    preparationScreen.name = entity.name;
    preparationScreen.description = entity.description;
    preparationScreen.isActive = entity.isActive;
    preparationScreen.displayOrder = entity.displayOrder;
    preparationScreen.color = entity.color;
    preparationScreen.createdAt = entity.createdAt;
    preparationScreen.updatedAt = entity.updatedAt;
    preparationScreen.deletedAt = entity.deletedAt;

    return preparationScreen;
  }

  static toPersistence(domain: PreparationScreen): PreparationScreenEntity {
    const entity = new PreparationScreenEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.displayOrder = domain.displayOrder;
    entity.color = domain.color;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
