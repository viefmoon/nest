import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModifierGroupRepository } from '../modifier-group.repository';
import { ModifierGroupEntity } from './entities/modifier-group.entity';
import { ModifierGroupsRelationalRepository } from './repositories/modifier-group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ModifierGroupEntity])],
  providers: [
    {
      provide: ModifierGroupRepository,
      useClass: ModifierGroupsRelationalRepository,
    },
  ],
  exports: [ModifierGroupRepository],
})
export class RelationalModifierGroupPersistenceModule {}
