import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 'Grande',
    description: 'Nombre de la variante',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 55.5,
    description: 'Precio de la variante',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 1,
    description: 'ID del producto al que pertenece',
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;
} 