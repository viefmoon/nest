import { Module } from '@nestjs/common';
import { PreparationScreensController } from './preparation-screens.controller';
import { PreparationScreensService } from './preparation-screens.service';
import { RelationalPreparationScreenPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';

const infrastructurePersistenceModule =
  RelationalPreparationScreenPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, AuthModule],
  controllers: [PreparationScreensController],
  providers: [PreparationScreensService],
  exports: [PreparationScreensService, infrastructurePersistenceModule],
})
export class PreparationScreensModule {}
