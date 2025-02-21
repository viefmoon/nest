import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

/**
 * Entidad de dominio para Subcategoría
 */
export class SubCategory {
  @ApiProperty({
    example: 1,
    description: 'ID único de la subcategoría',
  })
  @Allow()
  id: number;

  @ApiProperty({
    example: 'Cafés Especiales',
    description: 'Nombre de la subcategoría',
  })
  @Allow()
  name: string;

  @ApiPropertyOptional({
    example: 'Café filtrado, espresso, etc.',
    description: 'Descripción adicional de la subcategoría',
  })
  @Allow()
  description?: string | null;

  /**
   * ID de la categoría padre
   */
  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiPropertyOptional()
  deletedAt?: Date | null;
}
