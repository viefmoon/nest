import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaEntity } from './entities/area.entity';
import { TableEntity } from './entities/table.entity';
import { AreaRepository } from '../area.repository';
import { AreasRelationalRepository } from './repositories/area.repository';
import { TableRepository } from '../table.repository';
import { TablesRelationalRepository } from './repositories/table.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity, TableEntity])],
  providers: [
    {
      provide: AreaRepository,
      useClass: AreasRelationalRepository,
    },
    {
      provide: TableRepository,
      useClass: TablesRelationalRepository,
    },
  ],
  exports: [AreaRepository, TableRepository],
})
export class RelationalTablesPersistenceModule {} 