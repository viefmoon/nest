import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Customer } from './customer'; // Importar Customer

export class Address {
  @ApiProperty({
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID único de la dirección',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del cliente al que pertenece la dirección',
  })
  customerId: string;

  @ApiProperty({
    type: String,
    example: 'Calle Falsa',
    description: 'Nombre de la calle',
  })
  street: string;

  @ApiPropertyOptional({
    type: String,
    example: '123',
    description: 'Número exterior',
  })
  number?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'A',
    description: 'Número interior o departamento',
  })
  interiorNumber?: string | null;

  @ApiProperty({
    type: String,
    example: 'Colonia Centro',
    description: 'Colonia o barrio',
  })
  neighborhood: string;

  @ApiProperty({
    type: String,
    example: 'Ciudad Ejemplo',
    description: 'Ciudad',
  })
  city: string;

  @ApiProperty({
    type: String,
    example: 'Estado Ejemplo',
    description: 'Estado o provincia',
  })
  state: string;

  @ApiProperty({
    type: String,
    example: '12345',
    description: 'Código postal',
  })
  zipCode: string;

  @ApiProperty({
    type: String,
    example: 'México',
    description: 'País',
  })
  country: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Entre Calle A y Calle B, portón verde',
    description: 'Referencias adicionales para la entrega',
  })
  references?: string | null;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
    description: 'Indica si es la dirección predeterminada del cliente',
  })
  isDefault: boolean;

  @ApiProperty({ type: () => Customer }) // Relación con Customer
  customer?: Customer;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}
