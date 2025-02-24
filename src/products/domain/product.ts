import { ApiProperty } from '@nestjs/swagger';
import { SubCategory } from '../../subcategories/domain/subcategory';
import { FileType } from '../../files/domain/file';
import { ProductVariant } from '../../product-variants/domain/product-variant';

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
  subCategoryId: string;

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
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  preparationScreenId: string | null;

  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  photo: FileType | null;

  @ApiProperty({
    type: () => SubCategory,
    nullable: true,
  })
  subCategory: SubCategory | null;

  @ApiProperty({
    type: () => [ProductVariant],
    isArray: true,
  })
  variants: ProductVariant[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
