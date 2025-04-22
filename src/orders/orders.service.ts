import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './domain/order';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { OrderStatus } from './domain/enums/order-status.enum';
import { DailyOrderCounterRepository } from './infrastructure/persistence/daily-order-counter.repository';
import { OrderItemModifierRepository } from './infrastructure/persistence/order-item-modifier.repository';
import { OrderItemModifier } from './domain/order-item-modifier';
import { OrderItemRepository } from './infrastructure/persistence/order-item.repository';
import { OrderItem } from './domain/order-item';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateOrderItemModifierDto } from './dto/update-order-item-modifier.dto';
import { PreparationStatus } from './domain/order-item';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('DailyOrderCounterRepository')
    private readonly dailyOrderCounterRepository: DailyOrderCounterRepository,
    @Inject('OrderItemModifierRepository')
    private readonly orderItemModifierRepository: OrderItemModifierRepository,
    @Inject('OrderItemRepository')
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.create({
      userId: createOrderDto.userId,
      tableId: createOrderDto.tableId || null,
      scheduledAt: createOrderDto.scheduledAt || null,
      orderType: createOrderDto.orderType,
      orderStatus: OrderStatus.PENDING, // Por defecto, todas las órdenes comienzan en estado PENDING
      subtotal: createOrderDto.subtotal,
      total: createOrderDto.total,
      notes: createOrderDto.notes, // Add notes
      phoneNumber: createOrderDto.phoneNumber || null, // Add phoneNumber
      customer_name: createOrderDto.customer_name || null, // Add customer_name
      delivery_address: createOrderDto.delivery_address || null, // Add delivery_address
    });
  }

  async findAll(
    filterOptions: FindAllOrdersDto,
    paginationOptions: IPaginationOptions,
  ): Promise<Order[]> {
    return this.orderRepository.findManyWithPagination({
      filterOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Asegurarse de que la orden existe
    await this.findOne(id);
    // Actualizar la orden (el repositorio ya protege los campos dailyNumber y dailyOrderCounterId)
    // Crear un objeto parcial solo con los campos que se pueden actualizar
    const updatePayload: Partial<Order> = {
      userId: updateOrderDto.userId,
      tableId: updateOrderDto.tableId,
      scheduledAt: updateOrderDto.scheduledAt,
      orderStatus: updateOrderDto.orderStatus,
      orderType: updateOrderDto.orderType,
      subtotal: updateOrderDto.subtotal,
      total: updateOrderDto.total,
      notes: updateOrderDto.notes, // Add notes
      phoneNumber: updateOrderDto.phoneNumber, // Add phoneNumber
      customer_name: updateOrderDto.customer_name, // Add customer_name
      delivery_address: updateOrderDto.delivery_address, // Add delivery_address
      // No incluir items aquí, se manejan por separado si es necesario
    };

    const updatedOrder = await this.orderRepository.update(id, updatePayload);
    if (!updatedOrder) {
      throw new Error(`Failed to update order with ID ${id}`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    // Asegurarse de que la orden existe
    await this.findOne(id);
    // Eliminar la orden
    return this.orderRepository.remove(id);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async findByTableId(tableId: string): Promise<Order[]> {
    return this.orderRepository.findByTableId(tableId);
  }

  async findByDailyOrderCounterId(
    dailyOrderCounterId: string,
  ): Promise<Order[]> {
    return this.orderRepository.findByDailyOrderCounterId(dailyOrderCounterId);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderRepository.findByDateRange(startDate, endDate);
  }

  // OrderItem methods
  async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    // Verificar que la orden existe
    await this.findOne(createOrderItemDto.orderId);

    const orderItem = OrderItem.create(
      uuidv4(),
      createOrderItemDto.orderId,
      createOrderItemDto.productId,
      createOrderItemDto.productVariantId || null,
      createOrderItemDto.quantity,
      createOrderItemDto.basePrice,
      createOrderItemDto.finalPrice,
      PreparationStatus.PENDING,
      new Date(),
      createOrderItemDto.preparationNotes || null,
    );

    const savedOrderItem = await this.orderItemRepository.save(orderItem);

    // Crear modificadores si existen
    if (
      createOrderItemDto.modifiers &&
      createOrderItemDto.modifiers.length > 0
    ) {
      for (const modifierDto of createOrderItemDto.modifiers) {
        await this.createOrderItemModifier(
          savedOrderItem.id,
          modifierDto.modifierId,
          modifierDto.modifierOptionId,
          modifierDto.quantity,
          modifierDto.price,
        );
      }
    }

    return this.findOrderItemById(savedOrderItem.id);
  }

  async findOrderItemById(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findById(id);

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return orderItem;
  }

  async findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    // Verificar que la orden existe
    await this.findOne(orderId);

    return this.orderItemRepository.findByOrderId(orderId);
  }

  async updateOrderItem(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const existingOrderItem = await this.findOrderItemById(id);

    const updatedOrderItem = OrderItem.create(
      existingOrderItem.id,
      existingOrderItem.orderId,
      updateOrderItemDto.productId || existingOrderItem.productId,
      updateOrderItemDto.productVariantId || existingOrderItem.productVariantId,
      updateOrderItemDto.quantity !== undefined
        ? updateOrderItemDto.quantity
        : existingOrderItem.quantity,
      updateOrderItemDto.basePrice !== undefined
        ? updateOrderItemDto.basePrice
        : existingOrderItem.basePrice,
      updateOrderItemDto.finalPrice !== undefined
        ? updateOrderItemDto.finalPrice
        : existingOrderItem.finalPrice,
      updateOrderItemDto.preparationStatus ||
        existingOrderItem.preparationStatus,
      updateOrderItemDto.preparationStatus
        ? new Date()
        : existingOrderItem.statusChangedAt,
      updateOrderItemDto.preparationNotes !== undefined
        ? updateOrderItemDto.preparationNotes
        : existingOrderItem.preparationNotes,
    );

    return this.orderItemRepository.update(updatedOrderItem);
  }

  async deleteOrderItem(id: string): Promise<void> {
    const orderItem = await this.findOrderItemById(id);

    // Eliminar primero los modificadores asociados
    const modifiers = await this.findOrderItemModifiersByOrderItemId(id);
    for (const modifier of modifiers) {
      await this.deleteOrderItemModifier(modifier.id);
    }

    await this.orderItemRepository.delete(orderItem.id);
  }

  // OrderItemModifier methods
  async createOrderItemModifier(
    orderItemId: string,
    modifierId: string,
    modifierOptionId: string,
    quantity: number = 1,
    price: number = 0,
  ): Promise<OrderItemModifier> {
    // Verificar que el orderItem existe
    await this.findOrderItemById(orderItemId);

    const orderItemModifier = OrderItemModifier.create(
      uuidv4(),
      orderItemId,
      modifierId,
      modifierOptionId,
      quantity,
      price,
    );

    return this.orderItemModifierRepository.save(orderItemModifier);
  }

  async findOrderItemModifierById(id: string): Promise<OrderItemModifier> {
    const orderItemModifier =
      await this.orderItemModifierRepository.findById(id);

    if (!orderItemModifier) {
      throw new NotFoundException(`OrderItemModifier with ID ${id} not found`);
    }

    return orderItemModifier;
  }

  async findOrderItemModifiersByOrderItemId(
    orderItemId: string,
  ): Promise<OrderItemModifier[]> {
    // Verificar que el orderItem existe
    await this.findOrderItemById(orderItemId);

    return this.orderItemModifierRepository.findByOrderItemId(orderItemId);
  }

  async updateOrderItemModifier(
    id: string,
    updateOrderItemModifierDto: UpdateOrderItemModifierDto,
  ): Promise<OrderItemModifier> {
    const existingModifier = await this.findOrderItemModifierById(id);

    const updatedModifier = OrderItemModifier.create(
      existingModifier.id,
      existingModifier.orderItemId,
      updateOrderItemModifierDto.modifierId || existingModifier.modifierId,
      updateOrderItemModifierDto.modifierOptionId ||
        existingModifier.modifierOptionId,
      updateOrderItemModifierDto.quantity !== undefined
        ? updateOrderItemModifierDto.quantity
        : existingModifier.quantity,
      updateOrderItemModifierDto.price !== undefined
        ? updateOrderItemModifierDto.price
        : existingModifier.price,
    );

    return this.orderItemModifierRepository.update(updatedModifier);
  }

  async deleteOrderItemModifier(id: string): Promise<void> {
    const orderItemModifier = await this.findOrderItemModifierById(id);
    await this.orderItemModifierRepository.delete(orderItemModifier.id);
  }
}
