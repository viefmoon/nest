import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QuerySubCategoryDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Límite de items por página',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo para ordenar (name | id)',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    description: 'Dirección de la ordenación (ASC | DESC)',
    example: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Filtrar por categoría padre (id)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  categoryId?: number;
} 