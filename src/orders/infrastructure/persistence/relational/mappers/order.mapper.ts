import { Order } from '../../../../domain/order';
import { OrderEntity } from '../entities/order.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { TableMapper } from '../../../../../tables/infrastructure/persistence/relational/mappers/table.mapper';
import { DailyOrderCounterMapper } from './daily-order-counter.mapper';

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    const domain = new Order();
    domain.id = entity.id;
    domain.dailyNumber = entity.dailyNumber;
    domain.dailyOrderCounterId = entity.dailyOrderCounterId;
    domain.userId = entity.userId;
    domain.tableId = entity.tableId;
    domain.orderStatus = entity.orderStatus;
    domain.orderType = entity.orderType;
    domain.total = entity.total;
    domain.notes = entity.notes || undefined;
    domain.phoneNumber = entity.phoneNumber; // Add mapping for phoneNumber
    domain.customer_name = entity.customer_name; // Add mapping for customer_name
    domain.delivery_address = entity.delivery_address; // Add mapping for delivery_address
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    if (entity.user) {
      domain.user = UserMapper.toDomain(entity.user);
    }

    if (entity.table) {
      domain.table = TableMapper.toDomain(entity.table);
    }

    if (entity.dailyOrderCounter) {
      domain.dailyOrderCounter = DailyOrderCounterMapper.toDomain(
        entity.dailyOrderCounter,
      );
    }

    return domain;
  }

  static toPersistence(domain: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = domain.id;
    entity.dailyNumber = domain.dailyNumber;
    entity.dailyOrderCounterId = domain.dailyOrderCounterId;
    entity.userId = domain.userId;
    entity.tableId = domain.tableId;
    entity.orderStatus = domain.orderStatus;
    entity.orderType = domain.orderType;
    entity.total = domain.total;
    entity.notes = domain.notes || null;
    entity.phoneNumber = domain.phoneNumber || null; // Add mapping for phoneNumber
    entity.customer_name = domain.customer_name || null; // Add mapping for customer_name
    entity.delivery_address = domain.delivery_address || null; // Add mapping for delivery_address
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
