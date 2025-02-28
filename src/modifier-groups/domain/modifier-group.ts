import { ApiProperty } from '@nestjs/swagger';
import { ProductModifier } from '../../product-modifiers/domain/product-modifier';
import { Product } from '../../products/domain/product';

export class ModifierGroup {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Tamaños',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Selecciona el tamaño de tu bebida',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Number,
    example: 0,
    description: 'Número mínimo de selecciones',
  })
  minSelections: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Número máximo de selecciones',
  })
  maxSelections: number;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Indica si el grupo de modificadores es requerido',
  })
  isRequired: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Indica si se permiten múltiples selecciones',
  })
  allowMultipleSelections: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indica si el grupo de modificadores está activo',
  })
  isActive: boolean;

  @ApiProperty({
    type: () => [ProductModifier],
    isArray: true,
  })
  productModifiers: ProductModifier[];

  @ApiProperty({
    type: () => [Product],
    isArray: true,
  })
  products: Product[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
