import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

/**
 * Entidad de dominio para Producto
 */
export class Product {
  @ApiProperty({
    example: 1,
    description: 'ID único del producto',
  })
  @Allow()
  id: number;

  @ApiProperty({
    example: 'Café Mocha',
    description: 'Nombre del producto',
  })
  @Allow()
  name: string;

  @ApiPropertyOptional({
    example: 45.5,
    description: 'Precio base del producto',
  })
  @Allow()
  price?: number | null;

  @ApiProperty({
    example: false,
    description: 'Si el producto tiene o no variantes',
  })
  @Allow()
  hasVariants: boolean;

  @ApiProperty({
    example: 50,
    description: 'Stock disponible',
  })
  @Allow()
  stock: number;

  /**
   * ID de la subcategoría a la que pertenece
   */
  @ApiProperty({
    example: 1,
    description: 'ID de la subcategoría a la que pertenece',
  })
  @Allow()
  subCategoryId: number;

  /**
   * ID de un archivo de imagen (relacionado con la tabla file)
   */
  @ApiPropertyOptional({
    example: 'some-file-uuid',
    description: 'ID de un archivo de imagen (relacionado con la tabla file)',
  })
  @Allow()
  photoId?: string | null;

  @ApiPropertyOptional({
    example: 7,
    description: 'Tiempo de preparación estimado en minutos',
  })
  @Allow()
  estimatedPrepTime?: number;

  @ApiPropertyOptional({
    description: 'Fecha de eliminación',
  })
  @Allow()
  deletedAt?: Date | null;
}
