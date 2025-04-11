import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { ModifierGroupsModule } from '../modifier-groups/modifier-groups.module'; // Importar ModifierGroupsModule
import { PreparationScreensModule } from '../preparation-screens/preparation-screens.module'; // Añadido
@Module({
  imports: [
    ProductRelationalPersistenceModule,
    ProductVariantsModule,
    ModifierGroupsModule, // Añadir ModifierGroupsModule a los imports
    forwardRef(() => PreparationScreensModule), // Use forwardRef here
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
