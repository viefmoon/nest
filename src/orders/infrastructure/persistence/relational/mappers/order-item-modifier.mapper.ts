import { OrderItemModifier } from '../../../../domain/order-item-modifier';
import { OrderItemModifierEntity } from '../entities/order-item-modifier.entity';
import { OrderItemMapper } from './order-item.mapper';

export class OrderItemModifierMapper {
  static toDomain(entity: OrderItemModifierEntity): OrderItemModifier {
    const orderItem = entity.orderItem
      ? OrderItemMapper.toDomain(entity.orderItem)
      : undefined;

    return OrderItemModifier.create(
      entity.id,
      entity.orderItemId,
      entity.modifierId,
      entity.modifierOptionId,
      entity.quantity,
      entity.price,
      orderItem,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toEntity(domain: OrderItemModifier): OrderItemModifierEntity {
    const entity = new OrderItemModifierEntity();
    entity.id = domain.id;
    entity.orderItemId = domain.orderItemId;
    entity.modifierId = domain.modifierId;
    entity.modifierOptionId = domain.modifierOptionId;
    entity.quantity = domain.quantity;
    entity.price = domain.price;

    return entity;
  }
}
