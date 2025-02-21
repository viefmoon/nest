import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

/**
 * DTO para filtrar y paginar categorías
 */
export class QueryCategoryDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Límite de items por página',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
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
}
