import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '../domain/enums/order-type.enum';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario que realiza la orden',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la mesa (opcional para órdenes que no son en el local)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T14:30:00.000Z',
    description: 'Fecha y hora programada para la orden (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @ApiProperty({
    enum: OrderType,
    example: OrderType.DINE_IN,
    description: 'Tipo de orden (obligatorio)',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({
    type: Number,
    example: 150.5,
    description: 'Subtotal de la orden',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty({
    type: Number,
    example: 177.59,
    description: 'Total de la orden',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Items de la orden',
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
