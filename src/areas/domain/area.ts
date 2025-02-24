import { ApiProperty } from '@nestjs/swagger';

export class Area {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Terraza',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Área al aire libre con vista panorámica',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
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
