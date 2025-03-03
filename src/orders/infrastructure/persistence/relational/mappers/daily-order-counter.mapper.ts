import { DailyOrderCounter } from '../../../../domain/daily-order-counter';
import { DailyOrderCounterEntity } from '../entities/daily-order-counter.entity';
import { OrderMapper } from './order.mapper';

export class DailyOrderCounterMapper {
  static toDomain(entity: DailyOrderCounterEntity): DailyOrderCounter {
    const domain = new DailyOrderCounter();
    domain.id = entity.id;
    domain.date = entity.date;
    domain.currentNumber = entity.currentNumber;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    if (entity.orders) {
      domain.orders = entity.orders.map(OrderMapper.toDomain);
    }

    return domain;
  }

  static toPersistence(domain: DailyOrderCounter): DailyOrderCounterEntity {
    const entity = new DailyOrderCounterEntity();
    entity.id = domain.id;
    entity.date = domain.date;
    entity.currentNumber = domain.currentNumber;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
