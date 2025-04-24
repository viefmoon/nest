import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order'; // Importar la entidad Order
import { User } from '../../users/domain/user'; // Importar la entidad User
import { TicketType } from './enums/ticket-type.enum'; // Importar el enum TicketType

export class TicketImpression {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único de la impresión del ticket',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la orden asociada',
  })
  orderId: string;

  @ApiProperty({
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // UUID de ejemplo
    description: 'ID del usuario que realizó la impresión',
  })
  userId: string;

  @ApiProperty({
    enum: TicketType,
    example: TicketType.KITCHEN,
    description: 'Tipo de ticket impreso',
  })
  ticketType: TicketType;

  @ApiProperty({
    type: Date,
    description: 'Fecha y hora de la impresión',
  })
  impressionTime: Date;

  @ApiProperty({
    type: () => Order,
    description: 'Orden asociada a esta impresión',
  })
  order?: Order; // Relación opcional en el dominio

  @ApiProperty({
    type: () => User,
    description: 'Usuario que realizó la impresión',
  })
  user?: User; // Relación opcional en el dominio

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}
