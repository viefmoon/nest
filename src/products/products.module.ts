import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';

@Module({
  imports: [ProductRelationalPersistenceModule, ProductVariantsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
