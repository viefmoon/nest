import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { RelationalCustomerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module'; // Importar AuthModule

// Determinar qué módulo de persistencia usar (en este caso, el relacional)
const infrastructurePersistenceModule = RelationalCustomerPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    AuthModule, // Añadir AuthModule a los imports
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  // Exportar el servicio y el módulo de persistencia si se necesita fuera de este módulo
  exports: [CustomersService, infrastructurePersistenceModule],
})
export class CustomersModule {}
