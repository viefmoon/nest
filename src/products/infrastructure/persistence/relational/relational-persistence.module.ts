import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductRelationalRepository } from './repositories/product-relational.repository';
import { ModifierGroupEntity } from '../../../../modifier-groups/infrastructure/persistence/relational/entities/modifier-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ModifierGroupEntity])],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: ProductRelationalRepository,
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductRelationalPersistenceModule {}
