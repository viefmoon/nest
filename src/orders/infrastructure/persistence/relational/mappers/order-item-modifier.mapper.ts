import { OrderItemEntity } from '../entities/order-item.entity'; // Añadir importación
import { ProductModifierEntity } from '../../../../../product-modifiers/infrastructure/persistence/relational/entities/product-modifier.entity'; // Añadir importación
import { OrderItemModifier } from '../../../../domain/order-item-modifier';
import { OrderItemModifierEntity } from '../entities/order-item-modifier.entity';
import { OrderItemMapper } from './order-item.mapper';

export class OrderItemModifierMapper {
  static toDomain(entity: OrderItemModifierEntity): OrderItemModifier {
    // La propiedad @RelationId 'orderItemId' ya nos da el ID directamente.
    // Mantenemos la carga de la relación completa 'orderItem' por si se necesita en el dominio.
    const orderItemDomain = entity.orderItem
      ? OrderItemMapper.toDomain(entity.orderItem)
      : undefined;

    // Usamos los IDs de @RelationId directamente.
    return OrderItemModifier.create(
      entity.id,
      entity.orderItemId, // Directamente desde @RelationId
      entity.modifierId, // Directamente desde @RelationId
      entity.modifierOptionId, // Se mantiene como columna normal
      entity.quantity,
      entity.price,
      orderItemDomain, // Pasamos el objeto de dominio si se cargó
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toPersistence(domain: OrderItemModifier): OrderItemModifierEntity {
    const entity = new OrderItemModifierEntity();
    entity.id = domain.id;
    // Ya no asignamos a orderItemId o modifierId directamente.
    // Asignamos stubs a las relaciones. TypeORM usará estos IDs para las columnas FK.
    entity.orderItem = { id: domain.orderItemId } as OrderItemEntity;
    entity.modifier = { id: domain.modifierId } as ProductModifierEntity;
    // modifierOptionId se mantiene si sigue siendo una columna directa.
    entity.modifierOptionId = domain.modifierOptionId;
    entity.quantity = domain.quantity;
    entity.price = domain.price;
    // Las propiedades @RelationId (orderItemId, modifierId) son de solo lectura y no se asignan aquí.

    return entity;
  }
}
