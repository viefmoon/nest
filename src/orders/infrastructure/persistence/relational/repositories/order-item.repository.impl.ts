import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from '../../../../domain/order-item';
import { OrderItemRepository } from '../../order-item.repository';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderItemMapper } from '../mappers/order-item.mapper';

@Injectable()
export class OrderItemRepositoryImpl implements OrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
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
    const orderItemEntity = OrderItemMapper.toEntity(orderItem);
    const savedEntity = await this.orderItemRepository.save(orderItemEntity);

    return OrderItemMapper.toDomain(savedEntity);
  }

  async update(orderItem: OrderItem): Promise<OrderItem> {
    const orderItemEntity = OrderItemMapper.toEntity(orderItem);
    const updatedEntity = await this.orderItemRepository.save(orderItemEntity);

    return OrderItemMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.orderItemRepository.softDelete(id);
  }
}
