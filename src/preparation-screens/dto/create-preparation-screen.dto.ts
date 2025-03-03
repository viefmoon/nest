import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePreparationScreenDto {
  @ApiProperty({
    type: String,
    example: 'Cocina Principal',
    description: 'Nombre de la pantalla de preparación',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    example: 'Pantalla para preparación de platos principales',
    description: 'Descripción de la pantalla de preparación (opcional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indica si la pantalla está activa',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Orden de prioridad para mostrar en la interfaz',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  displayOrder?: number;

  @ApiProperty({
    type: String,
    example: '#FF5733',
    description: 'Color para identificar la pantalla en la interfaz (opcional)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsHexColor()
  color?: string | null;
}
