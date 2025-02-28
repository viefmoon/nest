import { ApiProperty } from '@nestjs/swagger';

export class ProductModifier {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del grupo de modificadores al que pertenece',
  })
  groupId: string;

  @ApiProperty({
    type: String,
    example: 'Grande',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Tamaño grande de 500ml',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Number,
    example: 10.5,
    nullable: true,
    description: 'Precio adicional del modificador',
  })
  price: number | null;

  @ApiProperty({
    type: Number,
    example: 0,
    description: 'Orden de visualización',
  })
  sortOrder: number;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Indica si este modificador es seleccionado por defecto',
  })
  isDefault: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indica si el modificador está activo',
  })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
