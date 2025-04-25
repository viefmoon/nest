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
import { TicketImpressionRepository } from './infrastructure/persistence/ticket-impression.repository';
import { TicketType } from './domain/enums/ticket-type.enum';
import { TicketImpression } from './domain/ticket-impression';
// Importar ProductModifierRepository si se implementa la lógica de precio por defecto
// import { ProductModifierRepository } from '../product-modifiers/infrastructure/persistence/product-modifier.repository';

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
    @Inject('TicketImpressionRepository')
    private readonly ticketImpressionRepository: TicketImpressionRepository,
    // Inyectar ProductModifierRepository si es necesario para precios por defecto
    // @Inject('ProductModifierRepository')
    // private readonly productModifierRepository: ProductModifierRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepository.create({
      userId: createOrderDto.userId,
      tableId: createOrderDto.tableId || null,
      scheduledAt: createOrderDto.scheduledAt || null,
      orderType: createOrderDto.orderType,
      orderStatus: OrderStatus.PENDING,
      subtotal: createOrderDto.subtotal,
      total: createOrderDto.total,
      notes: createOrderDto.notes,
      phoneNumber: createOrderDto.phoneNumber || null,
      customerName: createOrderDto.customerName || null,
      deliveryAddress: createOrderDto.deliveryAddress || null,
    });

    if (createOrderDto.items && createOrderDto.items.length > 0) {
      for (const itemDto of createOrderDto.items) {
        // Crear el item primero
        const createOrderItemDto: CreateOrderItemDto = {
          orderId: order.id,
          productId: itemDto.productId,
          productVariantId: itemDto.productVariantId,
          quantity: itemDto.quantity,
          basePrice: itemDto.basePrice,
          finalPrice: itemDto.finalPrice,
          preparationNotes: itemDto.preparationNotes,
          modifiers: itemDto.modifiers, // Pasar los modificadores aquí
        };
        // Guardar el item y obtener su ID
        const savedOrderItem =
          await this.createOrderItemInternal(createOrderItemDto); // Usar método interno

        // Crear modificadores asociados al item recién guardado
        if (itemDto.modifiers && itemDto.modifiers.length > 0) {
          for (const modifierDto of itemDto.modifiers) {
            await this.createOrderItemModifier({
              // Llamada actualizada
              orderItemId: savedOrderItem.id,
              productModifierId: modifierDto.productModifierId,
              quantity: modifierDto.quantity,
              price: modifierDto.price,
            });
          }
        }
      }
    }
    // Recargar la orden completa al final para incluir todos los items y modificadores
    return this.findOne(order.id);
  }

  // Método interno para crear OrderItem sin la lógica de modificadores (evita recursión)
  private async createOrderItemInternal(
    createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    await this.findOne(createOrderItemDto.orderId); // Verificar orden

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
    return this.orderItemRepository.save(orderItem);
  }

  async findAll(
    filterOptions: FindAllOrdersDto,
    paginationOptions: IPaginationOptions,
  ): Promise<[Order[], number]> {
    return this.orderRepository.findManyWithPagination({
      filterOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      // Lanzar NotFoundException en lugar de Error genérico
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id); // Asegurarse de que la orden existe
    const updatePayload: Partial<Order> = {
      userId: updateOrderDto.userId,
      tableId: updateOrderDto.tableId,
      scheduledAt: updateOrderDto.scheduledAt,
      orderStatus: updateOrderDto.orderStatus,
      orderType: updateOrderDto.orderType,
      subtotal: updateOrderDto.subtotal,
      total: updateOrderDto.total,
      notes: updateOrderDto.notes,
      phoneNumber: updateOrderDto.phoneNumber,
      customerName: updateOrderDto.customerName,
      deliveryAddress: updateOrderDto.deliveryAddress,
    };

    const updatedOrder = await this.orderRepository.update(id, updatePayload);
    if (!updatedOrder) {
      // Podría ser un error interno si findOne no lanzó error antes
      throw new Error(`Failed to update order with ID ${id}`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Asegurarse de que la orden existe
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

  async findOpenOrders(): Promise<Order[]> {
    const today = new Date();
    return this.orderRepository.findOpenOrdersByDate(today);
  }

  // OrderItem methods
  // Este método ahora solo crea el item, los modificadores se manejan en 'create'
  async createOrderItem(
    createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    return this.createOrderItemInternal(createOrderItemDto);
  }

  async findOrderItemById(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findById(id);

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return orderItem;
  }

  async findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    await this.findOne(orderId); // Verificar que la orden existe
    return this.orderItemRepository.findByOrderId(orderId);
  }

  async updateOrderItem(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const existingOrderItem = await this.findOrderItemById(id);

    // Crear un objeto con los datos actualizados
    const updatedData = {
      ...existingOrderItem, // Copiar datos existentes
      productId: updateOrderItemDto.productId ?? existingOrderItem.productId,
      productVariantId:
        updateOrderItemDto.productVariantId ??
        existingOrderItem.productVariantId,
      quantity: updateOrderItemDto.quantity ?? existingOrderItem.quantity,
      basePrice: updateOrderItemDto.basePrice ?? existingOrderItem.basePrice,
      finalPrice: updateOrderItemDto.finalPrice ?? existingOrderItem.finalPrice,
      preparationStatus:
        updateOrderItemDto.preparationStatus ??
        existingOrderItem.preparationStatus,
      statusChangedAt: updateOrderItemDto.preparationStatus
        ? new Date()
        : existingOrderItem.statusChangedAt,
      preparationNotes:
        updateOrderItemDto.preparationNotes !== undefined
          ? updateOrderItemDto.preparationNotes
          : existingOrderItem.preparationNotes,
    };

    // Usar el método estático create para asegurar la lógica de dominio si existe
    const updatedOrderItem = OrderItem.create(
      updatedData.id,
      updatedData.orderId,
      updatedData.productId,
      updatedData.productVariantId,
      updatedData.quantity,
      updatedData.basePrice,
      updatedData.finalPrice,
      updatedData.preparationStatus,
      updatedData.statusChangedAt,
      updatedData.preparationNotes,
      // Pasar otras propiedades si son necesarias para create
      existingOrderItem.order,
      existingOrderItem.product,
      existingOrderItem.productVariant,
      existingOrderItem.modifiers,
      existingOrderItem.createdAt,
      existingOrderItem.updatedAt, // Esto será sobrescrito por TypeORM
      existingOrderItem.deletedAt,
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
  // Firma refactorizada para aceptar un objeto
  async createOrderItemModifier(data: {
    orderItemId: string;
    productModifierId: string; // Cambiado de modifierId
    quantity?: number; // Opcional
    price?: number | null; // Opcional y permite null
  }): Promise<OrderItemModifier> {
    await this.findOrderItemById(data.orderItemId); // Verificar que el orderItem existe

    // Aquí iría la lógica para obtener el precio del catálogo si data.price es null/undefined
    // const productModifier = await this.productModifierRepository.findById(data.productModifierId);
    // const finalPrice = data.price ?? productModifier?.price ?? 0;

    const orderItemModifier = OrderItemModifier.create(
      uuidv4(),
      data.orderItemId,
      data.productModifierId, // Usar productModifierId
      null, // modifierOptionId ya no se usa aquí
      data.quantity ?? 1, // Usar default si no se provee
      data.price ?? 0, // Usar default 0 si es null/undefined (o precio de catálogo)
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
    await this.findOrderItemById(orderItemId); // Verificar que el orderItem existe
    return this.orderItemModifierRepository.findByOrderItemId(orderItemId);
  }

  async updateOrderItemModifier(
    id: string,
    updateOrderItemModifierDto: UpdateOrderItemModifierDto,
  ): Promise<OrderItemModifier> {
    const existingModifier = await this.findOrderItemModifierById(id);

    // Crear objeto con datos actualizados
    const updatedData = {
      ...existingModifier,
      modifierId:
        updateOrderItemModifierDto.productModifierId ??
        existingModifier.modifierId, // Usar productModifierId
      // modifierOptionId se mantiene igual
      quantity:
        updateOrderItemModifierDto.quantity ?? existingModifier.quantity,
      price:
        updateOrderItemModifierDto.price !== undefined
          ? updateOrderItemModifierDto.price
          : existingModifier.price, // Permite null
    };

    // Usar el método estático create para la lógica de dominio
    const updatedModifier = OrderItemModifier.create(
      updatedData.id,
      updatedData.orderItemId,
      updatedData.modifierId,
      updatedData.modifierOptionId,
      updatedData.quantity,
      updatedData.price ?? 0, // CORRECCIÓN: Asegurar que sea number (usar 0 si es null)
      existingModifier.orderItem, // Pasar relaciones si son necesarias
      existingModifier.createdAt,
      existingModifier.updatedAt, // Será sobrescrito
      existingModifier.deletedAt,
    );

    // Pasar el objeto creado con lógica de dominio
    return this.orderItemModifierRepository.update(updatedModifier);
  }

  async deleteOrderItemModifier(id: string): Promise<void> {
    const orderItemModifier = await this.findOrderItemModifierById(id);
    await this.orderItemModifierRepository.delete(orderItemModifier.id);
  }

  // --- Ticket Impression Methods ---

  async registerTicketImpression(
    orderId: string,
    userId: string,
    ticketType: TicketType,
  ): Promise<TicketImpression> {
    await this.findOne(orderId); // Verificar orden

    const impressionData = {
      orderId,
      userId,
      ticketType,
      impressionTime: new Date(),
    };
    return this.ticketImpressionRepository.create(impressionData);
  }

  async findImpressionsByOrderId(orderId: string): Promise<TicketImpression[]> {
    await this.findOne(orderId); // Verificar orden
    return this.ticketImpressionRepository.findByOrderId(orderId);
  }
}
