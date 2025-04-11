import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreparationScreenRepository } from '../preparation-screen.repository';
import { PreparationScreenEntity } from './entities/preparation-screen.entity';
import { PreparationScreensRelationalRepository } from './repositories/preparation-screen.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PreparationScreenEntity])],
  providers: [
    {
      provide: 'PreparationScreenRepository', // Use token string
      useClass: PreparationScreensRelationalRepository,
    },
  ],
  exports: ['PreparationScreenRepository'], // Export token string
})
export class RelationalPreparationScreenPersistenceModule {}
