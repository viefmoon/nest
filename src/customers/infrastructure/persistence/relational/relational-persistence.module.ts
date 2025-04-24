import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { AddressEntity } from './entities/address.entity';
import { CustomerRepository } from '../customer.repository'; // Importar interfaz
import { AddressRepository } from '../address.repository'; // Importar interfaz
import { CustomerRelationalRepository } from './repositories/customer.repository'; // Importar implementación
import { AddressRelationalRepository } from './repositories/address.repository'; // Importar implementación

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, AddressEntity])],
  providers: [
    {
      provide: CustomerRepository, // Usar la clase abstracta como token
      useClass: CustomerRelationalRepository,
    },
    {
      provide: AddressRepository, // Usar la clase abstracta como token
      useClass: AddressRelationalRepository,
    },
  ],
  exports: [CustomerRepository, AddressRepository], // Exportar los tokens
})
export class RelationalCustomerPersistenceModule {}
