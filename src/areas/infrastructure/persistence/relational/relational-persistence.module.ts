import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaRepository } from '../area.repository';
import { AreaEntity } from './entities/area.entity';
import { AreasRelationalRepository } from './repositories/area.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  providers: [
    {
      provide: AreaRepository,
      useClass: AreasRelationalRepository,
    },
  ],
  exports: [AreaRepository],
})
export class RelationalAreaPersistenceModule {}
