import { Module } from '@nestjs/common';
import { ThermalPrintersController } from './thermal-printers.controller';
import { ThermalPrintersService } from './thermal-printers.service';
import { RelationalThermalPrinterPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';
import { PrintingController } from './printing.controller'; // Añadido
import { PrintingService } from './printing.service'; // Añadido
import { OrdersModule } from '../orders/orders.module'; // Añadido

const infrastructurePersistenceModule =
  RelationalThermalPrinterPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    AuthModule,
    OrdersModule, // Añadido para que PrintingService pueda usar OrdersService
  ],
  controllers: [ThermalPrintersController, PrintingController], // Añadido PrintingController
  providers: [ThermalPrintersService, PrintingService], // Añadido PrintingService
  exports: [ThermalPrintersService, infrastructurePersistenceModule], // No exportamos PrintingService por ahora
})
export class ThermalPrintersModule {}
