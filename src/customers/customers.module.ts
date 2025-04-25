import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { RelationalCustomerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';

const infrastructurePersistenceModule = RelationalCustomerPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, AuthModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService, infrastructurePersistenceModule],
})
export class CustomersModule {}
