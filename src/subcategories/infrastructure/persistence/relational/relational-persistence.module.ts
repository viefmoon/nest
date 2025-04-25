import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryEntity } from './entities/Subcategory.entity';
import { SubcategoriesRelationalRepository } from './repositories/subcategories-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubcategoryEntity])],
  providers: [
    {
      provide: 'SubcategoryRepository',
      useClass: SubcategoriesRelationalRepository,
    },
  ],
  exports: ['SubcategoryRepository'],
})
export class SubcategoriesRelationalPersistenceModule {}
