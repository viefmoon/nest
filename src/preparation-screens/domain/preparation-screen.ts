import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/domain/product';

export class PreparationScreen {
  @ApiProperty({
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Pantalla Cocina Principal',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Pantalla primaria para órdenes de cocina',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => [Product],
    description: 'Productos asociados a esta pantalla de preparación',
    required: false, // Indicar que es opcional
  })
  products?: Product[]; // Añadir la relación con productos

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
