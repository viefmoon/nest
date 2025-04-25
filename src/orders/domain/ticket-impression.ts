import { Order } from './order'; // Importar la entidad Order
import { User } from '../../users/domain/user'; // Importar la entidad User
import { TicketType } from './enums/ticket-type.enum'; // Importar el enum TicketType

export class TicketImpression {
  id: string;

  orderId: string;

  userId: string;

  ticketType: TicketType;

  impressionTime: Date;

  order: Order; 

  user: User;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
