import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Add ApiPropertyOptional
import { IsBoolean, IsOptional, IsString, IsInt, Min } from 'class-validator'; // Add IsInt, Min
import { Transform, Type } from 'class-transformer'; // Add Type

export class FindAllPreparationScreensDto {
  @ApiProperty({
    type: String,
    description: 'Filtrar por nombre',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  // Remove the first isActive definition (lines 15-19)

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @IsInt() // Use imported IsInt
  @Min(1) // Use imported Min
  @Type(() => Number) // Use imported Type
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @IsOptional()
  @IsInt() // Use imported IsInt
  @Min(1) // Use imported Min
  @Type(() => Number) // Use imported Type
  limit?: number = 10;

  // Keep the second isActive definition (lines 35-47 in original, now adjusted)
  @ApiPropertyOptional({ // Use ApiPropertyOptional for consistency
    type: Boolean,
    description: 'Filtrar por estado activo',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
