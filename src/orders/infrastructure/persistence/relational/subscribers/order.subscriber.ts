// src/orders/infrastructure/persistence/relational/subscribers/order.subscriber.ts
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
  EntityManager, // Importar EntityManager
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderHistoryEntity } from '../entities/order-history.entity';
import { classToPlain } from 'class-transformer';
import * as jsondiffpatch from 'jsondiffpatch';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<OrderEntity> {
  constructor(@InjectDataSource() readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return OrderEntity;
  }

  async afterInsert(event: InsertEvent<OrderEntity>) {
    if (!event.entity) return;
    // Asumimos que userId existe en OrderEntity y es el ID del usuario que crea
    const changedBy = event.entity.userId;
    await this.persistHistory(
      'INSERT',
      event.entity,
      null, // No diff for INSERT
      changedBy,
      event.manager,
    );
  }

  async afterUpdate(event: UpdateEvent<OrderEntity>) {
    if (!event.entity || !event.databaseEntity) return;

    // Convertir entidades a objetos planos para diff
    const before = classToPlain(event.databaseEntity);
    const after = classToPlain(event.entity);

    // Calcular diff (ignorar timestamps si no son relevantes para el historial)
    delete before['updatedAt'];
    delete after['updatedAt'];
    // Considerar eliminar otras propiedades no relevantes (ej. relaciones) si el snapshot es muy grande
    // delete before['user']; delete after['user'];
    // delete before['table']; delete after['table'];
    // delete before['dailyOrderCounter']; delete after['dailyOrderCounter'];
    // delete before['orderItems']; delete after['orderItems'];
    // delete before['payments']; delete after['payments'];
    // delete before['ticketImpressions']; delete after['ticketImpressions'];

    const diff = jsondiffpatch.diff(before, after);

    // Si no hay diferencias significativas, no registrar (opcional)
    if (!diff) {
      return;
    }

    // Asumimos que userId existe en OrderEntity y representa quién actualizó
    // En un escenario real, podría ser un campo 'updatedBy'
    const changedBy = (event.entity as OrderEntity).userId;
    await this.persistHistory(
      'UPDATE',
      event.entity as OrderEntity,
      diff,
      changedBy,
      event.manager,
    );
  }

  async afterRemove(event: RemoveEvent<OrderEntity>) {
    // El entity removido podría no estar completamente cargado, usamos databaseEntity
    if (!event.databaseEntity) return;
    // Asumimos que userId existe y representa quién eliminó
    // En un escenario real, podría ser un campo 'deletedBy' o necesitar contexto externo
    const changedBy = event.databaseEntity.userId;
    await this.persistHistory(
      'DELETE',
      event.databaseEntity,
      null, // No diff for DELETE
      changedBy,
      event.manager,
    );
  }

  private async persistHistory(
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    entity: OrderEntity,
    diff: jsondiffpatch.Delta | null,
    changedBy: string, // UUID del usuario
    manager: EntityManager, // Usar tipo EntityManager
  ) {
    // Asegurarse de que changedBy no sea undefined o null
    if (!changedBy) {
      console.warn(
        `OrderSubscriber: No se pudo determinar changedBy para la operación ${operation} en Order ID ${entity.id}. No se registrará historial.`,
      );
      // Considerar lanzar un error o usar un ID por defecto si es crítico
      // Por ejemplo: changedBy = 'SYSTEM_UNKNOWN';
      return; // O lanzar error si es mandatorio
    }

    const historyRecord = manager.create(OrderHistoryEntity, {
      orderId: entity.id,
      operation: operation,
      changedBy: changedBy,
      diff: diff ?? undefined, // Guardar null si no hay diff
      snapshot: classToPlain(entity), // Guardar el estado actual (o anterior para DELETE)
    });
    await manager.save(historyRecord);
  }
}
