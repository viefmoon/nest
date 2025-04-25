import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { Subcategory } from '../../subcategories/domain/Subcategory';

export class Category {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Electrónicos',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Productos electrónicos y gadgets',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: () => FileType,
    nullable: true,
  })
  photo: FileType | null;

  @ApiProperty({
    type: () => [Subcategory],
    description: 'Subcategorías asociadas a esta categoría',
  })
  subcategories: Subcategory[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
