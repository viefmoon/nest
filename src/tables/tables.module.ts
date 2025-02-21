import { Module } from '@nestjs/common';
import { RelationalTablesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';

/**
 * Módulo principal de Tables, que incluye lógica de Mesas y Áreas.
 */
@Module({
  imports: [RelationalTablesPersistenceModule],
  controllers: [TablesController, AreasController],
  providers: [TablesService, AreasService],
  exports: [TablesService, AreasService, RelationalTablesPersistenceModule],
})
export class TablesModule {} 