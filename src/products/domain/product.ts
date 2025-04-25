import { ApiProperty } from '@nestjs/swagger';
import { Subcategory } from '../../subcategories/domain/Subcategory';
import { FileType } from '../../files/domain/file';
import { ProductVariant } from '../../product-variants/domain/product-variant';
import { ModifierGroup } from '../../modifier-groups/domain/modifier-group';
import { PreparationScreen } from '../../preparation-screens/domain/preparation-screen';
export class Product {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Hamburguesa Clásica',
  })
  name: string;

  @ApiProperty({
    type: Number,
    example: 10.99,
    nullable: true,
  })
  price: number | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  hasVariants: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    default: true,
    description: 'Indica si el producto está activo',
  })
  isActive: boolean;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  subcategoryId: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  photoId: string | null;

  @ApiProperty({
    type: Number,
    example: 15,
    description: 'Tiempo estimado de preparación en minutos',
  })
  estimatedPrepTime: number;

  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  photo: FileType | null;

  @ApiProperty({
    type: () => Subcategory,
    nullable: true,
  })
  subcategory: Subcategory | null;

  @ApiProperty({
    type: () => [ProductVariant],
    isArray: true,
  })
  variants: ProductVariant[];

  @ApiProperty({
    type: () => [ModifierGroup],
    isArray: true,
  })
  modifierGroups: ModifierGroup[];

  @ApiProperty({
    type: () => PreparationScreen,
    nullable: true,
  })
  preparationScreen?: PreparationScreen;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
