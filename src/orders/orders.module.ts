import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './infrastructure/persistence/relational/entities/order.entity';
import { DailyOrderCounterEntity } from './infrastructure/persistence/relational/entities/daily-order-counter.entity';
import { OrdersRelationalRepository } from './infrastructure/persistence/relational/repositories/order.repository';
import { DailyOrderCounterRelationalRepository } from './infrastructure/persistence/relational/repositories/daily-order-counter.repository';
import { OrderItemModifierEntity } from './infrastructure/persistence/relational/entities/order-item-modifier.entity';
import { OrderItemModifierRepositoryImpl } from './infrastructure/persistence/relational/repositories/order-item-modifier.repository.impl';
import { OrderItemEntity } from './infrastructure/persistence/relational/entities/order-item.entity';
import { OrderItemRepositoryImpl } from './infrastructure/persistence/relational/repositories/order-item.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      DailyOrderCounterEntity,
      OrderItemModifierEntity,
      OrderItemEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'OrderRepository',
      useClass: OrdersRelationalRepository,
    },
    {
      provide: 'DailyOrderCounterRepository',
      useClass: DailyOrderCounterRelationalRepository,
    },
    {
      provide: 'OrderItemModifierRepository',
      useClass: OrderItemModifierRepositoryImpl,
    },
    {
      provide: 'OrderItemRepository',
      useClass: OrderItemRepositoryImpl,
    },
  ],
  exports: [
    OrdersService,
    {
      provide: 'OrderRepository',
      useClass: OrdersRelationalRepository,
    },
    {
      provide: 'DailyOrderCounterRepository',
      useClass: DailyOrderCounterRelationalRepository,
    },
    {
      provide: 'OrderItemModifierRepository',
      useClass: OrderItemModifierRepositoryImpl,
    },
    {
      provide: 'OrderItemRepository',
      useClass: OrderItemRepositoryImpl,
    },
  ],
})
export class OrdersModule {}
