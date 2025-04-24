import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from './update-address.dto'; // Importar DTO de actualización

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Juan',
    description: 'Nombre del cliente',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Pérez',
    description: 'Apellido del cliente',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    type: String,
    example: '+525512345678',
    description: 'Número de teléfono del cliente',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'El número de teléfono no es válido' })
  phoneNumber?: string | null; // Permitir null para borrar

  @ApiPropertyOptional({
    type: String,
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del cliente (debe ser único)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(255)
  email?: string | null; // Permitir null para borrar

  @ApiPropertyOptional({
    type: () => [UpdateAddressDto],
    description:
      'Lista completa de direcciones deseadas. Las direcciones existentes no incluidas aquí serán eliminadas. Incluir "id" para actualizar una existente, omitirlo para crear una nueva.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  addresses?: UpdateAddressDto[];
}
