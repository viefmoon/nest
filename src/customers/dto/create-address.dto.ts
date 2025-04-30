import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  // No incluimos customerId aquí, se asignará en el servicio
  // @ApiProperty({ type: String, example: '...', description: 'ID del cliente' })
  // @IsNotEmpty()
  // @IsUUID()
  // customerId: string;

  @ApiProperty({
    type: String,
    example: 'Calle Falsa',
    description: 'Nombre de la calle',
  })
  @IsNotEmpty({ message: 'La calle es obligatoria' })
  @IsString()
  @MaxLength(200)
  street: string;

  @ApiPropertyOptional({
    type: String,
    example: '123',
    description: 'Número exterior',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  number?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'A',
    description: 'Número interior o departamento',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  interiorNumber?: string;

  @ApiProperty({
    type: String,
    example: 'Colonia Centro',
    description: 'Colonia o barrio',
  })
  @IsNotEmpty({ message: 'La colonia es obligatoria' })
  @IsString()
  @MaxLength(150)
  neighborhood: string;

  @ApiProperty({
    type: String,
    example: 'Ciudad Ejemplo',
    description: 'Ciudad',
  })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    type: String,
    example: 'Estado Ejemplo',
    description: 'Estado o provincia',
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({
    type: String,
    example: '12345',
    description: 'Código postal',
  })
  @IsNotEmpty({ message: 'El código postal es obligatorio' })
  @IsString()
  @MaxLength(10)
  zipCode: string;

  @ApiProperty({
    type: String,
    example: 'México',
    description: 'País',
  })
  @IsNotEmpty({ message: 'El país es obligatorio' })
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Entre Calle A y Calle B, portón verde',
    description: 'Referencias adicionales para la entrega',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  references?: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: false,
    default: false,
    description: 'Indica si es la dirección predeterminada del cliente',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
