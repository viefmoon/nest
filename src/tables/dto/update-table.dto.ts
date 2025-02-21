import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTableDto } from './create-table.dto';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

/**
 * DTO para actualizar una Mesa.
 */
export class UpdateTableDto extends PartialType(CreateTableDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isTemporary?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  parentTableId?: number;

  @ApiPropertyOptional({ description: 'Cambiar de área si se requiere' })
  @IsOptional()
  @IsNumber()
  areaId?: number;
} 