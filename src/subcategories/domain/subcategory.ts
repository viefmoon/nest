import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/domain/category';
import { FileType } from '../../files/domain/file';
import { Product } from '../../products/domain/product'; 


export class Subcategory {
  @ApiProperty() id!: string;
  @ApiProperty() categoryId!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty() isActive!: boolean;

  
  @ApiProperty({ nullable: true }) photoId!: string | null;

  @ApiProperty({ type: () => Category, nullable: true })
  category!: Category | null;

  @ApiProperty({ type: () => FileType, nullable: true })
  photo!: FileType | null;
  
  @ApiProperty({ type: () => [Product] }) products!: Product[];

  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
  @ApiProperty({ nullable: true }) deletedAt!: Date | null;
}
