import { Order } from './order';
import { Product } from '../../products/domain/product';
import { ProductVariant } from '../../product-variants/domain/product-variant';
import { OrderItemModifier } from './order-item-modifier';

export enum PreparationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly productId: string,
    public readonly productVariantId: string | null,
    public readonly quantity: number,
    public readonly basePrice: number,
    public readonly finalPrice: number,
    public readonly preparationStatus: PreparationStatus,
    public readonly statusChangedAt: Date,
    public readonly preparationNotes: string | null,
    public readonly order?: Order,
    public readonly product?: Product,
    public readonly productVariant?: ProductVariant | null,
    public readonly modifiers?: OrderItemModifier[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {}

  static create(
    id: string,
    orderId: string,
    productId: string,
    productVariantId: string | null,
    quantity: number,
    basePrice: number,
    finalPrice: number,
    preparationStatus: PreparationStatus = PreparationStatus.PENDING,
    statusChangedAt: Date = new Date(),
    preparationNotes: string | null = null,
    order?: Order,
    product?: Product,
    productVariant?: ProductVariant | null,
    modifiers: OrderItemModifier[] = [],
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ): OrderItem {
    return new OrderItem(
      id,
      orderId,
      productId,
      productVariantId,
      quantity,
      basePrice,
      finalPrice,
      preparationStatus,
      statusChangedAt,
      preparationNotes,
      order,
      product,
      productVariant,
      modifiers,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}
