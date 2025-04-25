import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRelationalRepository } from './repositories/categories-relational.repository';
import { CategoryMapper } from './mappers/category.mapper';
import { CATEGORY_REPOSITORY } from '../../../../common/tokens';

export const CATEGORY_MAPPER = Symbol('CATEGORY_MAPPER'); 

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoriesRelationalRepository,
    },
    { provide: CATEGORY_MAPPER, useClass: CategoryMapper }, 
  ],
  exports: [CATEGORY_REPOSITORY, CATEGORY_MAPPER],
})
export class CategoriesRelationalPersistenceModule {}
