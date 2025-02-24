import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryEntity } from './entities/subcategory.entity';
import { SubCategoriesRelationalRepository } from './repositories/subcategories-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryEntity])],
  providers: [
    {
      provide: 'SubCategoryRepository',
      useClass: SubCategoriesRelationalRepository,
    },
  ],
  exports: ['SubCategoryRepository'],
})
export class SubCategoriesRelationalPersistenceModule {}
