import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

/**
 * Entidad de dominio para Variante de Producto
 */
export class ProductVariant {
  @ApiProperty({
    example: 1,
    description: 'ID único de la variante',
  })
  @Allow()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del producto al que pertenece',
  })
  @Allow()
  productId: number;

  @ApiProperty({
    example: 'Grande',
    description: 'Nombre de la variante',
  })
  @Allow()
  name: string;

  @ApiProperty({
    example: 55.5,
    description: 'Precio de la variante',
  })
  @Allow()
  price: number;

  @ApiPropertyOptional()
  deletedAt?: Date | null;
} 