import { OrderItem } from '../../../../domain/order-item';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderMapper } from './order.mapper';
import { OrderItemModifierMapper } from './order-item-modifier.mapper';

export class OrderItemMapper {
  static toDomain(entity: OrderItemEntity): OrderItem {
    const order = entity.order ? OrderMapper.toDomain(entity.order) : undefined;

    const modifiers = entity.modifiers
      ? entity.modifiers.map((modifier) =>
          OrderItemModifierMapper.toDomain(modifier),
        )
      : [];

    return OrderItem.create(
      entity.id,
      entity.orderId,
      entity.productId,
      entity.productVariantId,
      entity.quantity,
      entity.basePrice,
      entity.finalPrice,
      entity.preparationStatus,
      entity.statusChangedAt,
      entity.preparationNotes,
      order,
      entity.product,
      entity.productVariant,
      modifiers,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toEntity(domain: OrderItem): OrderItemEntity {
    const entity = new OrderItemEntity();
    entity.id = domain.id;
    entity.orderId = domain.orderId;
    entity.productId = domain.productId;
    entity.productVariantId = domain.productVariantId;
    entity.quantity = domain.quantity;
    entity.basePrice = domain.basePrice;
    entity.finalPrice = domain.finalPrice;
    entity.preparationStatus = domain.preparationStatus;
    entity.statusChangedAt = domain.statusChangedAt;
    entity.preparationNotes = domain.preparationNotes;

    return entity;
  }
}
