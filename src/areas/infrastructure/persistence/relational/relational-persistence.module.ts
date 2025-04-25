import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AREA_REPOSITORY } from '../../../../common/tokens';
import { AreaEntity } from './entities/area.entity';
import { AreasRelationalRepository } from './repositories/area.repository';
import { AreaMapper } from './mappers/area.mapper'; 

export const AREA_MAPPER = Symbol('AREA_MAPPER'); 

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  providers: [
    {
      provide: AREA_REPOSITORY,
      useClass: AreasRelationalRepository,
    },
    { provide: AREA_MAPPER, useClass: AreaMapper }, 
  ],
  exports: [AREA_REPOSITORY, AREA_MAPPER],
})
export class RelationalAreaPersistenceModule {}
