import { TicketImpression } from '../../../../domain/ticket-impression';
import { TicketImpressionEntity } from '../entities/ticket-impression.entity';
import { OrderMapper } from './order.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class TicketImpressionMapper {
  static toDomain(entity: TicketImpressionEntity): TicketImpression {
    const domain = new TicketImpression();
    domain.id = entity.id;
    domain.orderId = entity.orderId;
    domain.userId = entity.userId;
    domain.ticketType = entity.ticketType;
    domain.impressionTime = entity.impressionTime; // Usar impressionTime
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    // Mapear relaciones si están cargadas
    if (entity.order) {
      domain.order = OrderMapper.toDomain(entity.order);
    }
    if (entity.user) {
      domain.user = UserMapper.toDomain(entity.user);
    }

    return domain;
  }

  static toPersistence(domain: TicketImpression): TicketImpressionEntity {
    const entity = new TicketImpressionEntity();
    entity.id = domain.id;
    entity.orderId = domain.orderId;
    entity.userId = domain.userId;
    entity.ticketType = domain.ticketType;
    entity.impressionTime = domain.impressionTime; // Usar impressionTime
    // No mapear createdAt, updatedAt, deletedAt (manejados por TypeORM)
    // No mapear relaciones inversas (order, user) aquí, se manejan por JoinColumn

    return entity;
  }
}
