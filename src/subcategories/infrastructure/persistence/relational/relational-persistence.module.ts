import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryEntity } from './entities/subcategory.entity';
import { SubcategoriesRelationalRepository } from './repositories/subcategories-relational.repository';
import { SubcategoryMapper } from './mappers/subcategory.mapper';
import { SUBCATEGORY_REPOSITORY } from '../../../../common/tokens';
import { CategoriesRelationalPersistenceModule } from '../../../../categories/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubcategoryEntity]),
    CategoriesRelationalPersistenceModule,],
  providers: [
    {
      provide: SUBCATEGORY_REPOSITORY,
      useClass: SubcategoriesRelationalRepository,
    },
    SubcategoryMapper,
  ],
  exports: [SUBCATEGORY_REPOSITORY, SubcategoryMapper],
})
export class SubcategoriesRelationalPersistenceModule {}
