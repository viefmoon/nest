import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

/**
 * Entidad de dominio para las Áreas.
 * No depende de infraestructura ni de TypeORM.
 */
export class Area {
  @ApiProperty({ example: 1 })
  @Allow()
  id: number | string;

  @ApiProperty({ example: 'Salón Principal' })
  @Allow()
  name: string;

  @ApiProperty({ example: 'Área principal del restaurante' })
  @Allow()
  description?: string | null;
} 