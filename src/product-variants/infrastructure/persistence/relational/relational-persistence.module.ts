import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { ProductVariantRelationalRepository } from './repositories/product-variant-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity])],
  providers: [
    {
      provide: 'ProductVariantRepository',
      useClass: ProductVariantRelationalRepository,
    },
  ],
  exports: ['ProductVariantRepository'],
})
export class ProductVariantRelationalPersistenceModule {}
