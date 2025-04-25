import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../files/domain/file';
import { Subcategory } from '../../subcategories/domain/Subcategory';

export class Category {
  @ApiProperty({ example: 'uuid' })  id!: string;
  @ApiProperty()                     name!: string;
  @ApiProperty({ nullable: true })   description!: string | null;
  @ApiProperty()                     isActive!: boolean;
  @ApiProperty({ nullable: true })   photoId!: string | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  photo!: FileType | null;

  @ApiProperty({ type: () => [Subcategory], nullable: true })
  subcategories!: Subcategory[] | null;

  @ApiProperty()                     createdAt!: Date;
  @ApiProperty()                     updatedAt!: Date;
  @ApiProperty({ nullable: true })   deletedAt!: Date | null;
}
