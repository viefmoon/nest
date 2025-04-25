import { OrderItem } from '../../../../domain/order-item';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderMapper } from './order.mapper';
import { OrderItemModifierMapper } from './order-item-modifier.mapper';
import { ProductEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product.entity';
import { ProductVariantEntity } from '../../../../../product-variants/infrastructure/persistence/relational/entities/product-variant.entity';
import { OrderEntity } from '../entities/order.entity'; // Necesario para stub
// Importar los mappers necesarios
import { ProductMapper } from '../../../../../products/infrastructure/persistence/relational/mappers/product.mapper';
import { ProductVariantMapper } from '../../../../../product-variants/infrastructure/persistence/relational/mappers/product-variant.mapper';

export class OrderItemMapper {
  static toDomain(entity: OrderItemEntity): OrderItem {
    const order = entity.order ? OrderMapper.toDomain(entity.order) : undefined;

    const modifiers = entity.modifiers
      ? entity.modifiers.map((modifier) =>
          OrderItemModifierMapper.toDomain(modifier),
        )
      : [];

    // Mapear product y productVariant usando sus respectivos mappers
    // Asegurarse de que ProductMapper.toDomain maneje el caso de undefined/null si es necesario
    const productDomain = entity.product
      ? ProductMapper.toDomain(entity.product)
      : undefined;
    // Asegurarse de que ProductVariantMapper.toDomain maneje el caso de null si es necesario
    const productVariantDomain = entity.productVariant
      ? ProductVariantMapper.toDomain(entity.productVariant)
      : null;

    // Validar que productDomain no sea null o undefined si es requerido por OrderItem.create
    if (!productDomain) {
      // Podrías lanzar un error o manejarlo según la lógica de negocio
      // console.error(`Error mapeando OrderItem ${entity.id}: Producto asociado no encontrado o no mapeable.`);
      // Dependiendo de si OrderItem.create permite product undefined, podrías necesitar retornar null o lanzar error.
      // Asumiendo que OrderItem.create requiere product:
      throw new Error(
        `Producto asociado (ID: ${entity.productId}) no pudo ser mapeado para OrderItem ${entity.id}`,
      );
    }

    return OrderItem.create(
      entity.id,
      entity.order.id, // Obtener ID desde la relación
      entity.productId,
      entity.productVariantId,
      entity.quantity,
      entity.basePrice,
      entity.finalPrice,
      entity.preparationStatus,
      entity.statusChangedAt,
      entity.preparationNotes,
      order,
      productDomain, // Usar el objeto de dominio mapeado
      productVariantDomain, // Usar el objeto de dominio mapeado (puede ser null)
      modifiers,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toPersistence(domain: OrderItem): OrderItemEntity {
    const entity = new OrderItemEntity();
    entity.id = domain.id;
    // Asignar stubs a las relaciones en lugar de a los IDs directamente
    entity.order = { id: domain.orderId } as OrderEntity;
    // Las propiedades orderId, productId y productVariantId se gestionan por @RelationId y no se asignan aquí
    entity.quantity = domain.quantity;
    entity.basePrice = domain.basePrice;
    entity.finalPrice = domain.finalPrice;
    entity.preparationStatus = domain.preparationStatus;
    entity.statusChangedAt = domain.statusChangedAt;
    entity.preparationNotes = domain.preparationNotes;

    // Asignar relaciones usando los IDs del dominio (esto es correcto para guardar)
    if (domain.product?.id) {
      // No es necesario mapear el objeto completo aquí, solo la referencia
      entity.product = { id: domain.product.id } as ProductEntity;
    }
    if (domain.productVariant?.id) {
      // No es necesario mapear el objeto completo aquí, solo la referencia
      entity.productVariant = {
        id: domain.productVariant.id,
      } as ProductVariantEntity;
    } else {
      entity.productVariant = null;
    }
    // La relación 'order' se asigna en el repositorio antes de guardar

    return entity;
  }
}
