import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/domain/category';
import { FileType } from '../../files/domain/file';
import { Product } from '../../products/domain/product'; // Importar Product

export class Subcategory {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId: string;

  @ApiProperty({
    type: String,
    example: 'Smartphones',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Teléfonos inteligentes y accesorios',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  photo: FileType | null;

  @ApiProperty({
    type: () => Category,
    description: 'Categoría a la que pertenece esta subcategoría',
  })
  category: Category;

  @ApiProperty({
    type: () => [Product],
    isArray: true,
    description: 'Productos pertenecientes a esta subcategoría',
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
