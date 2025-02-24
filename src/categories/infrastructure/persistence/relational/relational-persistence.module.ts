import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRelationalRepository } from './repositories/categories-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: 'CategoryRepository',
      useClass: CategoriesRelationalRepository,
    },
  ],
  exports: ['CategoryRepository'],
})
export class CategoriesRelationalPersistenceModule {}
