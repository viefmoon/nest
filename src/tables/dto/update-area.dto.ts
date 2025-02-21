import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAreaDto } from './create-area.dto';
import { IsOptional, IsString } from 'class-validator';

/**
 * DTO para actualizar un Área.
 * Extiende de CreateAreaDto, marcando todos los campos como opcionales.
 */
export class UpdateAreaDto extends PartialType(CreateAreaDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
