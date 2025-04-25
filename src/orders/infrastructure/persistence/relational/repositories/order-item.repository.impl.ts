import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity'; // Importar OrderEntity
import { NotFoundException } from '@nestjs/common'; // Importar NotFoundException

import { OrderItem } from '../../../../domain/order-item';
import { OrderItemRepository } from '../../order-item.repository';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderItemMapper } from '../mappers/order-item.mapper';

@Injectable()
export class OrderItemRepositoryImpl implements OrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(OrderEntity) // Inyectar OrderRepository
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findById(id: string): Promise<OrderItem | null> {
    const orderItemEntity = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'modifiers'],
    });

    if (!orderItemEntity) {
      return null;
    }

    return OrderItemMapper.toDomain(orderItemEntity);
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItemEntities = await this.orderItemRepository.find({
      where: { orderId },
      relations: ['order', 'modifiers'],
    });

    return orderItemEntities.map(OrderItemMapper.toDomain);
  }

  async save(orderItem: OrderItem): Promise<OrderItem> {
    // Buscar la OrderEntity correspondiente
    const orderEntity = await this.orderRepository.findOneBy({
      id: orderItem.orderId,
    });
    if (!orderEntity) {
      throw new NotFoundException(
        `Order with ID ${orderItem.orderId} not found when saving OrderItem`,
      );
    }

    const orderItemEntity = OrderItemMapper.toPersistence(orderItem);
    // Ya no asignar explícitamente a orderId (es @RelationId y de solo lectura)
    // Asignar la relación completa es suficiente. El mapper ya asigna el stub { id: ... } también.
    orderItemEntity.order = orderEntity; // Asignar la relación completa

    const savedEntity = await this.orderItemRepository.save(orderItemEntity);

    // Recargar para asegurar que las relaciones estén presentes en la respuesta
    const reloadedEntity = await this.orderItemRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['order', 'modifiers', 'product', 'productVariant'], // Cargar relaciones necesarias
    });

    if (!reloadedEntity) {
      throw new NotFoundException(
        `OrderItem with ID ${savedEntity.id} not found after saving.`,
      );
    }

    return OrderItemMapper.toDomain(reloadedEntity);
  }

  async update(orderItem: OrderItem): Promise<OrderItem> {
    // Similar a save, asegurar que la relación 'order' esté presente si es necesario
    // aunque 'update' generalmente no cambia las relaciones principales.
    // Por simplicidad y dado que el error es en INSERT, dejamos update como está por ahora,
    // pero podría necesitar lógica similar a 'save' si se actualiza 'orderId'.
    const existingEntity = await this.orderItemRepository.findOneBy({
      id: orderItem.id,
    });
    if (!existingEntity) {
      throw new NotFoundException(
        `OrderItem with ID ${orderItem.id} not found for update.`,
      );
    }

    // Mapear los datos actualizados a una entidad parcial
    const partialEntity = OrderItemMapper.toPersistence(orderItem);

    // Fusionar los cambios en la entidad existente
    this.orderItemRepository.merge(existingEntity, partialEntity);

    // Guardar la entidad fusionada
    const updatedEntity = await this.orderItemRepository.save(existingEntity);

    // Recargar para obtener el estado final con relaciones
    const reloadedEntity = await this.orderItemRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['order', 'modifiers', 'product', 'productVariant'], // Cargar relaciones necesarias
    });

    if (!reloadedEntity) {
      throw new NotFoundException(
        `OrderItem with ID ${updatedEntity.id} not found after updating.`,
      );
    }

    return OrderItemMapper.toDomain(reloadedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.orderItemRepository.softDelete(id);
  }
}
