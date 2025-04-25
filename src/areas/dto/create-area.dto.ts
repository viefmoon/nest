import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransformDefault } from '../../utils/transformers/transform-default.decorator';

export class CreateAreaDto {
  @ApiProperty({
    type: String,
    example: 'Terraza',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Área al aire libre con vista panorámica',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
    default: true, // Keep for Swagger documentation clarity
  })
  @TransformDefault(true) // Apply default value if undefined
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
