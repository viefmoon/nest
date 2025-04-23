import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TableEntity } from '../../../../../tables/infrastructure/persistence/relational/entities/table.entity';
import { DailyOrderCounterEntity } from './daily-order-counter.entity';
import { OrderStatus } from '../../../../domain/enums/order-status.enum';
import { OrderType } from '../../../../domain/enums/order-type.enum';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from '../../../../../payments/infrastructure/persistence/relational/entities/payment.entity';

@Entity({
  name: 'orders',
})
export class OrderEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'daily_number' })
  dailyNumber: number;

  @Column({ name: 'daily_order_counter_id' })
  dailyOrderCounterId: string;

  @ManyToOne(() => DailyOrderCounterEntity, (counter) => counter.orders)
  @JoinColumn({ name: 'daily_order_counter_id' })
  dailyOrderCounter: DailyOrderCounterEntity;

  @Column({ name: 'user_id', type: 'uuid' }) // Especificar tipo UUID
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'table_id', nullable: true })
  tableId: string | null;

  @ManyToOne(() => TableEntity, { nullable: true })
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.DINE_IN,
  })
  orderType: OrderType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Nueva columna para el número de teléfono
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string | null;

  // New column for customer name
  @Column({ name: 'customer_name', type: 'varchar', nullable: true })
  customer_name: string | null;

  // New column for delivery address
  @Column({ name: 'delivery_address', type: 'text', nullable: true })
  delivery_address: string | null;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
