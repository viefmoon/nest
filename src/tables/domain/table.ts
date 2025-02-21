import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { Area } from './area';

/**
 * Entidad de dominio para las Mesas.
 * No depende de infraestructura ni de TypeORM.
 */
export class Table {
  @ApiProperty({ example: 1 })
  @Allow()
  id: number | string;

  @ApiProperty({ example: 'Mesa 5' })
  @Allow()
  name: string;

  @ApiProperty({ example: false })
  @Allow()
  isTemporary: boolean;

  @ApiProperty({ example: null, description: 'Campo opcional para el ID de mesa padre en caso de fusión.' })
  @Allow()
  parentTableId?: number | string | null;

  @ApiProperty({ type: () => Area, nullable: true })
  @Allow()
  area?: Area | null;
} 