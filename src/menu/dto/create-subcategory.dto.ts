import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSubCategoryDto {
  @ApiProperty({
    example: 'Cafés Especiales',
    description: 'Nombre de la subcategoría',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Café filtrado, espresso, etc.',
    description: 'Descripción adicional de la subcategoría',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría padre',
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
