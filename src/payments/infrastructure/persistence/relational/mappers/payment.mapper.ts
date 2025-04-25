import { Injectable } from '@nestjs/common';
import { Payment } from '../../../../domain/payment';
import { PaymentEntity } from '../entities/payment.entity';
import { Order } from '../../../../../orders/domain/order';
import { OrderEntity } from '../../../../../orders/infrastructure/persistence/relational/entities/order.entity'; // Necesario para stub

@Injectable()
export class PaymentMapper {
  toDomain(entity: PaymentEntity): Payment {
    const payment = new Payment();
    payment.id = entity.id;
    payment.orderId = entity.orderId;
    payment.paymentMethod = entity.paymentMethod;
    payment.amount = entity.amount;
    payment.paymentStatus = entity.paymentStatus;
    payment.order = entity.order ? (entity.order as unknown as Order) : null;
    payment.createdAt = entity.createdAt;
    payment.updatedAt = entity.updatedAt;
    payment.deletedAt = entity.deletedAt;
    return payment;
  }

  toPersistence(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.id = domain.id;
    entity.order = { id: domain.orderId } as OrderEntity;
    entity.paymentMethod = domain.paymentMethod;
    entity.amount = domain.amount;
    entity.paymentStatus = domain.paymentStatus;
    return entity;
  }
}
