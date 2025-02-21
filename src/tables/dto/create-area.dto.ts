import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO para crear un Área.
 */
export class CreateAreaDto {
  @ApiProperty({ example: 'Salón VIP' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Un área reservada para clientes VIP' })
  @IsOptional()
  @IsString()
  description?: string;
} 