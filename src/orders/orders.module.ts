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
import { TicketImpressionEntity } from './infrastructure/persistence/relational/entities/ticket-impression.entity';
import { TicketImpressionRelationalRepository } from './infrastructure/persistence/relational/repositories/ticket-impression-relational.repository';
import { TicketImpressionsController } from './ticket-impressions.controller';
// --- Importaciones para Historial ---
import { OrderHistoryEntity } from './infrastructure/persistence/relational/entities/order-history.entity';
import { OrderItemHistoryEntity } from './infrastructure/persistence/relational/entities/order-item-history.entity';
import { OrderHistoryRelationalRepository } from './infrastructure/persistence/relational/repositories/order-history.repository';
import { OrderItemHistoryRelationalRepository } from './infrastructure/persistence/relational/repositories/order-item-history.repository';
import { OrderSubscriber } from './infrastructure/persistence/relational/subscribers/order.subscriber';
import { OrderItemSubscriber } from './infrastructure/persistence/relational/subscribers/order-item.subscriber';
import { OrderChangeLogService } from './order-change-log.service';
import { OrderItemChangeLogService } from './order-item-change-log.service';
import { UsersModule } from '../users/users.module'; // Importar UsersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      DailyOrderCounterEntity,
      OrderItemModifierEntity,
      OrderItemEntity,
      TicketImpressionEntity,
      OrderHistoryEntity, // Añadir entidad de historial de orden
      OrderItemHistoryEntity, // Añadir entidad de historial de item
    ]),
    UsersModule, // Añadir UsersModule para que los servicios de log puedan usar UsersService
  ],
  controllers: [OrdersController, TicketImpressionsController],
  providers: [
    OrdersService,
    // --- Proveedores existentes ---
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
    {
      provide: 'TicketImpressionRepository',
      useClass: TicketImpressionRelationalRepository,
    },
    // --- Proveedores para Historial ---
    {
      provide: 'OrderHistoryRepository',
      useClass: OrderHistoryRelationalRepository,
    },
    {
      provide: 'OrderItemHistoryRepository',
      useClass: OrderItemHistoryRelationalRepository,
    },
    OrderSubscriber, // Registrar subscriber de orden
    OrderItemSubscriber, // Registrar subscriber de item de orden
    OrderChangeLogService, // Registrar servicio de log de orden
    OrderItemChangeLogService, // Registrar servicio de log de item
  ],
  exports: [
    OrdersService,
    // Exportar repositorios y servicios existentes si es necesario...
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
    {
      provide: 'TicketImpressionRepository',
      useClass: TicketImpressionRelationalRepository,
    },
    // Exportar servicios de historial si se necesitan fuera
    OrderChangeLogService,
    OrderItemChangeLogService,
    {
      provide: 'OrderHistoryRepository',
      useClass: OrderHistoryRelationalRepository,
    },
    {
      provide: 'OrderItemHistoryRepository',
      useClass: OrderItemHistoryRelationalRepository,
    },
  ],
})
export class OrdersModule {}
