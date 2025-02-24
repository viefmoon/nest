import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { RelationalAreaPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';

const infrastructurePersistenceModule = RelationalAreaPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, AuthModule],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService, infrastructurePersistenceModule],
})
export class AreasModule {}
