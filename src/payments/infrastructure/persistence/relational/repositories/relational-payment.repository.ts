import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentRepository } from '../../payment.repository';
import { Payment } from '../../../../domain/payment';
import { PaymentMapper } from '../mappers/payment.mapper';

@Injectable()
export class RelationalPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly paymentMapper: PaymentMapper,
  ) {}

  async findAll(): Promise<Payment[]> {
    const paymentEntities = await this.paymentRepository.find();
    return paymentEntities.map((entity) => this.paymentMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Payment | null> {
    const paymentEntity = await this.paymentRepository.findOne({
      where: { id },
    });
    return paymentEntity ? this.paymentMapper.toDomain(paymentEntity) : null;
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    const paymentEntities = await this.paymentRepository.find({
      where: { orderId },
    });
    return paymentEntities.map((entity) => this.paymentMapper.toDomain(entity));
  }

  async create(payment: Payment): Promise<Payment> {
    const paymentEntity = this.paymentMapper.toPersistence(payment);
    const savedEntity = await this.paymentRepository.save(paymentEntity);
    return this.paymentMapper.toDomain(savedEntity);
  }

  async update(id: string, payment: Partial<Payment>): Promise<Payment> {
    await this.paymentRepository.update(
      id,
      this.paymentMapper.toPersistence(payment as Payment),
    );
    const updatedEntity = await this.paymentRepository.findOne({
      where: { id },
    });
    if (!updatedEntity) {
      throw new Error(`Payment with ID ${id} not found after update`);
    }
    return this.paymentMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.paymentRepository.softDelete(id);
  }
}
