import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { PreparationScreensController } from './preparation-screens.controller';
import { PreparationScreensService } from './preparation-screens.service';
import { RelationalPreparationScreenPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ProductsModule } from '../products/products.module'; // Import ProductsModule

@Module({
  imports: [
    RelationalPreparationScreenPersistenceModule,
    forwardRef(() => ProductsModule), // Use forwardRef here
  ],
  controllers: [PreparationScreensController],
  providers: [PreparationScreensService],
  exports: [PreparationScreensService],
})
export class PreparationScreensModule {}
