import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryProductDto {
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
    description: 'Campo para ordenar (name | id | price)',
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
    description: 'Filtrar por subcategoría (id)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  subCategoryId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por existencia de stock (> 0)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  inStock?: boolean;
}
