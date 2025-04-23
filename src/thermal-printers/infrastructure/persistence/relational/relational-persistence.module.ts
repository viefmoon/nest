import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThermalPrinterRepository } from '../thermal-printer.repository';
import { ThermalPrinterEntity } from './entities/thermal-printer.entity';
import { ThermalPrintersRelationalRepository } from './repositories/thermal-printer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ThermalPrinterEntity])],
  providers: [
    {
      provide: ThermalPrinterRepository,
      useClass: ThermalPrintersRelationalRepository,
    },
  ],
  exports: [ThermalPrinterRepository],
})
export class RelationalThermalPrinterPersistenceModule {}
