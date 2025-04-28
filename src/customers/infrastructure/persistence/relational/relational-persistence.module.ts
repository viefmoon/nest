import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { AddressEntity } from './entities/address.entity';
import { CustomerRepository } from '../customer.repository';
import { AddressRepository } from '../address.repository';
import { CustomerRelationalRepository } from './repositories/customer.repository';
import { AddressRelationalRepository } from './repositories/address.repository';
import { CustomerMapper } from './mappers/customer.mapper';
import { AddressMapper } from './mappers/address.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, AddressEntity])],
  providers: [
    {
      provide: CustomerRepository,
      useClass: CustomerRelationalRepository,
    },
    {
      provide: AddressRepository,
      useClass: AddressRelationalRepository,
    },
    CustomerMapper,
    AddressMapper,
  ],
  exports: [
    CustomerRepository,
    AddressRepository,
    CustomerMapper,
    AddressMapper,
  ],
})
export class RelationalCustomerPersistenceModule {}
