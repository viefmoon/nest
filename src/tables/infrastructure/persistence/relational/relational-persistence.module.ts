import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableRepository } from '../table.repository';
import { TableEntity } from './entities/table.entity';
import { TablesRelationalRepository } from './repositories/table.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity])],
  providers: [
    {
      provide: TableRepository,
      useClass: TablesRelationalRepository,
    },
  ],
  exports: [TableRepository],
})
export class RelationalTablePersistenceModule {}
