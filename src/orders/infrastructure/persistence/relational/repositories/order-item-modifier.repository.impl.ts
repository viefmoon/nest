import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItemModifier } from '../../../../domain/order-item-modifier';
import { OrderItemModifierRepository } from '../../order-item-modifier.repository';
import { OrderItemModifierEntity } from '../entities/order-item-modifier.entity';
import { OrderItemModifierMapper } from '../mappers/order-item-modifier.mapper';

@Injectable()
export class OrderItemModifierRepositoryImpl
  implements OrderItemModifierRepository
{
  constructor(
    @InjectRepository(OrderItemModifierEntity)
    private readonly orderItemModifierRepository: Repository<OrderItemModifierEntity>,
  ) {}

  async findById(id: string): Promise<OrderItemModifier | null> {
    const orderItemModifierEntity =
      await this.orderItemModifierRepository.findOne({
        where: { id },
        relations: ['orderItem'],
      });

    if (!orderItemModifierEntity) {
      return null;
    }

    return OrderItemModifierMapper.toDomain(orderItemModifierEntity);
  }

  async findByOrderItemId(orderItemId: string): Promise<OrderItemModifier[]> {
    const orderItemModifierEntities =
      await this.orderItemModifierRepository.find({
        where: { orderItemId },
        relations: ['orderItem'],
      });

    return orderItemModifierEntities.map(OrderItemModifierMapper.toDomain);
  }

  async save(orderItemModifier: OrderItemModifier): Promise<OrderItemModifier> {
    const orderItemModifierEntity =
      OrderItemModifierMapper.toEntity(orderItemModifier);
    const savedEntity = await this.orderItemModifierRepository.save(
      orderItemModifierEntity,
    );

    return OrderItemModifierMapper.toDomain(savedEntity);
  }

  async update(
    orderItemModifier: OrderItemModifier,
  ): Promise<OrderItemModifier> {
    const orderItemModifierEntity =
      OrderItemModifierMapper.toEntity(orderItemModifier);
    const updatedEntity = await this.orderItemModifierRepository.save(
      orderItemModifierEntity,
    );

    return OrderItemModifierMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.orderItemModifierRepository.softDelete(id);
  }
}
