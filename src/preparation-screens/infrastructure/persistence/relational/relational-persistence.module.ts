import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreparationScreenEntity } from './entities/preparation-screen.entity';
import { PreparationScreensRelationalRepository } from './repositories/preparation-screen.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PreparationScreenEntity])],
  providers: [
    {
      provide: 'PreparationScreenRepository',
      useClass: PreparationScreensRelationalRepository,
    },
  ],
  exports: ['PreparationScreenRepository'],
})
export class RelationalPreparationScreenPersistenceModule {}
