import { PreparationScreen } from '../../../../domain/preparation-screen';
import { PreparationScreenEntity } from '../entities/preparation-screen.entity';
import { ProductMapper } from '../../../../../products/infrastructure/persistence/relational/mappers/product.mapper';

export class PreparationScreenMapper {
  static toDomain(entity: PreparationScreenEntity): PreparationScreen {
    const preparationScreen = new PreparationScreen();
    preparationScreen.id = entity.id;
    preparationScreen.name = entity.name;
    preparationScreen.description = entity.description;
    preparationScreen.isActive = entity.isActive;
    preparationScreen.createdAt = entity.createdAt;
    preparationScreen.updatedAt = entity.updatedAt;
    preparationScreen.deletedAt = entity.deletedAt;

    // Mapear productos si existen en la entidad (cargados con la relación)
    if (entity.products) {
      preparationScreen.products = entity.products.map((productEntity) =>
        ProductMapper.toDomain(productEntity),
      );
    }

    return preparationScreen;
  }

  static toPersistence(domain: PreparationScreen): PreparationScreenEntity {
    const entity = new PreparationScreenEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    // Mapear productos si existen en el dominio
    // Nota: Generalmente no mapeamos relaciones inversas a la persistencia
    // a menos que sea necesario para crear/actualizar la relación desde este lado.
    // Para ManyToMany, TypeORM maneja la tabla intermedia basado en la entidad principal.
    // Si necesitamos asignar productos al crear/actualizar la pantalla,
    // la lógica estará en el servicio usando los IDs.

    return entity;
  }
}
