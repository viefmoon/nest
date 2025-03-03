import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemModifierDto } from './create-order-item-modifier.dto';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'ID de la variante del producto (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  productVariantId?: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Precio base del producto',
    example: 10.5,
  })
  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @ApiProperty({
    description: 'Precio final del producto (incluyendo modificadores)',
    example: 12.5,
  })
  @IsNumber()
  @IsNotEmpty()
  finalPrice: number;

  @ApiProperty({
    description: 'Notas de preparación (opcional)',
    example: 'Sin cebolla',
    required: false,
  })
  @IsOptional()
  @IsString()
  preparationNotes?: string;

  @ApiProperty({
    description: 'Modificadores del item',
    type: [OrderItemModifierDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemModifierDto)
  modifiers?: OrderItemModifierDto[];
}
