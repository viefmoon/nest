import { Module } from '@nestjs/common';
import { ThermalPrintersController } from './thermal-printers.controller';
import { ThermalPrintersService } from './thermal-printers.service';
import { RelationalThermalPrinterPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';

const infrastructurePersistenceModule =
  RelationalThermalPrinterPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    AuthModule,
  ],
  controllers: [ThermalPrintersController],
  providers: [ThermalPrintersService],
  exports: [ThermalPrintersService, infrastructurePersistenceModule],
})
export class ThermalPrintersModule {}
