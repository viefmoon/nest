import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryEntity } from './entities/subcategory.entity';
import { SubcategoriesRelationalRepository } from './repositories/subcategories-relational.repository';
import { SubcategoryMapper } from './mappers/subcategory.mapper';
import { SUBCATEGORY_REPOSITORY } from '../../../../common/tokens';

export const SUBCATEGORY_MAPPER = Symbol('SUBCATEGORY_MAPPER'); 

@Module({
  imports: [TypeOrmModule.forFeature([SubcategoryEntity])],
  providers: [
    {
      provide: SUBCATEGORY_REPOSITORY,
      useClass: SubcategoriesRelationalRepository,
    },
    { provide: SUBCATEGORY_MAPPER, useClass: SubcategoryMapper }, 
  ],
  exports: [SUBCATEGORY_REPOSITORY, SUBCATEGORY_MAPPER],
})
export class SubcategoriesRelationalPersistenceModule {}
