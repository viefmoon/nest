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
    // Usar QueryBuilder para filtrar por el ID de la relación orderItem
    const queryBuilder = this.orderItemModifierRepository
      .createQueryBuilder('oim') // Alias para OrderItemModifierEntity
      .leftJoinAndSelect('oim.orderItem', 'oi') // Unir y seleccionar la relación orderItem (alias 'oi')
      // Añadimos también la relación con modifier si es necesaria (equivalente a relations: ['orderItem', 'modifier'])
      // Si 'modifier' no se necesita aquí, se puede quitar el siguiente leftJoinAndSelect.
      // Basado en el otro repositorio, parece que sí se necesita.
      .leftJoinAndSelect('oim.modifier', 'pm')
      .where('oi.id = :orderItemId', { orderItemId }); // Filtrar por el ID del orderItem relacionado

    const entities = await queryBuilder.getMany(); // Ejecutar la consulta

    return entities.map(OrderItemModifierMapper.toDomain);
  }

  async save(orderItemModifier: OrderItemModifier): Promise<OrderItemModifier> {
    const orderItemModifierEntity =
      OrderItemModifierMapper.toPersistence(orderItemModifier);
    const savedEntity = await this.orderItemModifierRepository.save(
      orderItemModifierEntity,
    );

    return OrderItemModifierMapper.toDomain(savedEntity);
  }

  async update(
    orderItemModifier: OrderItemModifier,
  ): Promise<OrderItemModifier> {
    const orderItemModifierEntity =
      OrderItemModifierMapper.toPersistence(orderItemModifier);
    const updatedEntity = await this.orderItemModifierRepository.save(
      orderItemModifierEntity,
    );

    return OrderItemModifierMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.orderItemModifierRepository.softDelete(id);
  }
}
