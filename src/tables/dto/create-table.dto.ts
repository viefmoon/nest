import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

/**
 * DTO para crear una Mesa.
 */
export class CreateTableDto {
  @ApiProperty({ example: 'Mesa 5' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isTemporary?: boolean;

  @ApiPropertyOptional({ example: null, description: 'ID de la mesa padre en caso de fusión, si aplica' })
  @IsOptional()
  parentTableId?: number;

  @ApiProperty({ example: 1, description: 'ID del Área donde se creará la mesa' })
  @IsNumber()
  areaId: number;
}
