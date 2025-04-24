import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { OrderEntity } from './order.entity'; // Importar OrderEntity
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity'; // Importar UserEntity
import { TicketType } from '../../../../domain/enums/ticket-type.enum'; // Importar TicketType

@Entity({ name: 'ticket_impression' })
export class TicketImpressionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'user_id', type: 'uuid' }) // Asegurarse que el tipo coincida con UserEntity.id
  userId: string;

  @Column({ type: 'enum', enum: TicketType })
  ticketType: TicketType;

  @Column({ name: 'impression_time', type: 'timestamp with time zone' }) // Usar timestamp con zona horaria
  impressionTime: Date;

  @ManyToOne(() => OrderEntity, (order) => order.ticketImpressions, {
    // Añadir relación inversa si es necesario en OrderEntity
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => UserEntity, {
    // No se necesita relación inversa en UserEntity generalmente
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
