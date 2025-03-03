import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemModifierRepository } from '../../order-item-modifier.repository';
import { OrderItemModifierEntity } from '../entities/order-item-modifier.entity';
import { OrderItemModifier } from '../../../../domain/order-item-modifier';
import { OrderItemModifierMapper } from '../mappers/order-item-modifier.mapper';

@Injectable()
export class OrderItemModifierRelationalRepository
  implements OrderItemModifierRepository
{
  constructor(
    @InjectRepository(OrderItemModifierEntity)
    private readonly orderItemModifierRepository: Repository<OrderItemModifierEntity>,
  ) {}

  async findById(id: string): Promise<OrderItemModifier | null> {
    const entity = await this.orderItemModifierRepository.findOne({
      where: { id },
      relations: ['orderItem', 'productModifier'],
    });

    if (!entity) {
      return null;
    }

    return OrderItemModifierMapper.toDomain(entity);
  }

  async findByOrderItemId(orderItemId: string): Promise<OrderItemModifier[]> {
    const entities = await this.orderItemModifierRepository.find({
      where: { orderItemId },
      relations: ['orderItem', 'productModifier'],
    });

    return entities.map((entity) => OrderItemModifierMapper.toDomain(entity));
  }

  async save(orderItemModifier: OrderItemModifier): Promise<OrderItemModifier> {
    const entity = OrderItemModifierMapper.toEntity(orderItemModifier);
    const savedEntity = await this.orderItemModifierRepository.save(entity);

    return this.findById(savedEntity.id) as Promise<OrderItemModifier>;
  }

  async update(
    orderItemModifier: OrderItemModifier,
  ): Promise<OrderItemModifier> {
    const entity = OrderItemModifierMapper.toEntity(orderItemModifier);
    await this.orderItemModifierRepository.update(entity.id, entity);

    return this.findById(entity.id) as Promise<OrderItemModifier>;
  }

  async delete(id: string): Promise<void> {
    await this.orderItemModifierRepository.softDelete(id);
  }
}
