import { OrderItem } from './order-item';

export class OrderItemModifier {
  constructor(
    public readonly id: string,
    public readonly orderItemId: string,
    public readonly modifierId: string,
    public readonly modifierOptionId: string | null,
    public readonly quantity: number,
    public readonly price: number,
    public readonly orderItem?: OrderItem,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {}

  static create(
    id: string,
    orderItemId: string,
    modifierId: string,
    modifierOptionId: string | null,
    quantity: number,
    price: number,
    orderItem?: OrderItem,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ): OrderItemModifier {
    return new OrderItemModifier(
      id,
      orderItemId,
      modifierId,
      modifierOptionId,
      quantity,
      price,
      orderItem,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}
