import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuRepository } from '../menu.repository';

import { CategoryEntity } from './entities/category.entity';
import { SubCategoryEntity } from './entities/subcategory.entity';
import { ProductEntity } from './entities/product.entity';
import { MenuRelationalRepository } from './repositories/menu-relational.repository';
import { ProductVariantEntity } from './entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      SubCategoryEntity,
      ProductEntity,
      ProductVariantEntity,
    ]),
  ],
  providers: [
    {
      provide: MenuRepository,
      useClass: MenuRelationalRepository,
    },
  ],
  exports: [MenuRepository],
})
export class RelationalMenuPersistenceModule {}
