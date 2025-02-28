import { Module } from '@nestjs/common';
import { ProductModifiersService } from './product-modifiers.service';
import { ProductModifiersController } from './product-modifiers.controller';
import { RelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPersistenceModule],
  controllers: [ProductModifiersController],
  providers: [ProductModifiersService],
  exports: [ProductModifiersService],
})
export class ProductModifiersModule {}
