import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order';

export class DailyOrderCounter {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: Date,
    example: '2023-01-01',
  })
  date: Date;

  @ApiProperty({
    type: Number,
    example: 42,
    description: 'Número actual del contador',
  })
  currentNumber: number;

  @ApiProperty({
    type: () => [Order],
    description: 'Órdenes asociadas a este contador',
  })
  orders?: Order[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
