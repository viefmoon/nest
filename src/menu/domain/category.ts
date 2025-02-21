import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

/**
 * Entidad de dominio para Categoría
 * (sin dependencias de TypeORM ni infraestructura).
 */
export class Category {
  @ApiProperty({
    example: 1,
    description: 'ID único de la categoría',
  })
  @Allow()
  id: number;

  @ApiProperty({
    example: 'Bebidas Calientes',
    description: 'Nombre de la categoría',
  })
  @Allow()
  name: string;

  @ApiPropertyOptional({
    example: 'Café, té y otras bebidas calientes',
    description: 'Descripción adicional de la categoría',
  })
  @Allow()
  description?: string | null;

  /**
   * Podemos incluir banderas o propiedades de negocio.
   */
  @ApiPropertyOptional()
  deletedAt?: Date | null;
}
