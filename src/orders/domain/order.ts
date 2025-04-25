import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Table } from '../../tables/domain/table';
import { DailyOrderCounter } from './daily-order-counter';
import { OrderStatus } from './enums/order-status.enum';
import { OrderType } from './enums/order-type.enum';
import { Payment } from '../../payments/domain/payment';

export class Order {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  tableId: string | null;

  @ApiProperty({
    type: Number,
    example: 123,
  })
  dailyNumber: number;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  dailyOrderCounterId: string;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
    nullable: true,
  })
  scheduledAt: Date | null;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @ApiProperty({
    enum: OrderType,
    example: OrderType.DINE_IN,
  })
  orderType: OrderType;

  @ApiProperty({
    type: Number,
    example: 150.5,
  })
  subtotal: number;

  @ApiProperty({
    type: Number,
    example: 177.59,
  })
  total: number;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: () => Table,
    nullable: true,
  })
  table?: Table;

  @ApiProperty({
    type: () => DailyOrderCounter,
  })
  dailyOrderCounter: DailyOrderCounter;

  @ApiProperty({
    type: () => [Payment],
    description: 'Pagos asociados a la orden',
  })
  payments?: Payment[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    type: String,
    example: 'Additional notes',
    nullable: true,
  })
  notes?: string;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    description: 'Número de teléfono para la entrega',
    nullable: true,
    required: false,
  })
  phoneNumber?: string | null;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'Customer name for take-away orders',
    nullable: true,
    required: false, // Conditionally required in DTOs
  })
  customerName?: string | null;

  @ApiProperty({
    type: String,
    example: '123 Main St, Anytown, USA 12345',
    description: 'Delivery address for delivery orders',
    nullable: true,
    required: false, // Conditionally required in DTOs
  })
  deliveryAddress?: string | null;
}
