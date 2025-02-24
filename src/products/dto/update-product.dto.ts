import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    type: String,
    example: 'Hamburguesa Clásica',
    description: 'Nombre del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: Number,
    example: 10.99,
    description: 'Precio del producto (puede ser nulo si tiene variantes)',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Indica si el producto tiene variantes',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indica si el producto está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la subcategoría a la que pertenece el producto',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la foto del producto',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  photoId?: string | null;

  @ApiProperty({
    type: Number,
    example: 15,
    description: 'Tiempo estimado de preparación en minutos',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedPrepTime?: number;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la pantalla de preparación',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  preparationScreenId?: string | null;
}
