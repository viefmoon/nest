import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModifierEntity } from './entities/product-modifier.entity';
import { ProductModifierMapper } from './mappers/product-modifier.mapper';
import { ProductModifierRepository } from '../product-modifier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModifierEntity])],
  providers: [ProductModifierMapper, ProductModifierRepository],
  exports: [ProductModifierRepository],
})
export class RelationalPersistenceModule {}
