import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentMapper } from './mappers/payment.mapper';
import { RelationalPaymentRepository } from './repositories/relational-payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    PaymentMapper,
    {
      provide: 'PaymentRepository',
      useClass: RelationalPaymentRepository,
    },
  ],
  exports: ['PaymentRepository'],
})
export class RelationalPersistenceModule {}
