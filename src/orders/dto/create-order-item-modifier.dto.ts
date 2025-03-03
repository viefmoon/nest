import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemModifierDto {
  @ApiProperty({
    description: 'ID del ProductModifier asociado',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  productModifierId: string;

  @ApiProperty({
    description: 'Cantidad del modificador',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Precio del modificador (puede ser nulo)',
    example: 2.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number | null;
}
