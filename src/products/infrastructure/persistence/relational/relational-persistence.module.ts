import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductRelationalRepository } from './repositories/product-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: ProductRelationalRepository,
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductRelationalPersistenceModule {}
