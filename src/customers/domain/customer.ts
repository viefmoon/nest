import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from './address'; // Importaremos Address más adelante

export class Customer {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único del cliente',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Juan',
    description: 'Nombre del cliente',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Pérez',
    description: 'Apellido del cliente',
  })
  lastName: string;

  @ApiPropertyOptional({
    type: String,
    example: '+525512345678',
    description: 'Número de teléfono del cliente',
  })
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del cliente (único)',
  })
  email?: string | null;

  @ApiPropertyOptional({
    type: () => [Address], // Relación con direcciones
    description: 'Lista de direcciones asociadas al cliente',
  })
  addresses?: Address[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}
