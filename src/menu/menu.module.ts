import { Module } from '@nestjs/common';
import { RelationalMenuPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

/**
 * Módulo principal de Menú,
 * gestiona Categorías, Subcategorías y Productos.
 */
@Module({
  imports: [RelationalMenuPersistenceModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService, RelationalMenuPersistenceModule],
})
export class MenuModule {}
