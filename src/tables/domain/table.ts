import { ApiProperty } from '@nestjs/swagger';
import { Area } from '../../areas/domain/area';

export class Table {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Mesa 1',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  areaId: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isTemporary: boolean;

  @ApiProperty({
    type: String,
    example: 'T-123',
    nullable: true,
  })
  temporaryIdentifier: string | null;

  @ApiProperty({
    type: () => Area,
    description: 'Área a la que pertenece la mesa (obligatorio)',
  })
  area: Area;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
