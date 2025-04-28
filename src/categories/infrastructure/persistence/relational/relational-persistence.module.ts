import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRelationalRepository } from './repositories/categories-relational.repository';
import { CategoryMapper } from './mappers/category.mapper';
import { CATEGORY_REPOSITORY } from '../../../../common/tokens';
import { SubcategoriesRelationalPersistenceModule } from '../../../../subcategories/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    SubcategoriesRelationalPersistenceModule,
  ],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoriesRelationalRepository,
    },
    CategoryMapper,
  ],
  exports: [CATEGORY_REPOSITORY, CategoryMapper],
})
export class CategoriesRelationalPersistenceModule {}
