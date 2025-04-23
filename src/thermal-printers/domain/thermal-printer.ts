import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PrinterConnectionType {
  NETWORK = 'NETWORK',
  USB = 'USB',
  SERIAL = 'SERIAL',
  BLUETOOTH = 'BLUETOOTH',
}

export class ThermalPrinter {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Cocina Principal',
    description: 'Nombre descriptivo de la impresora',
  })
  name: string;

  @ApiProperty({
    enum: PrinterConnectionType,
    example: PrinterConnectionType.NETWORK,
    description: 'Tipo de conexión de la impresora',
  })
  connectionType: PrinterConnectionType;

  @ApiProperty({
    type: String,
    example: '192.168.1.100',
    description: 'Dirección IP (si es NETWORK)',
    nullable: true,
  })
  ipAddress: string | null;

  @ApiProperty({
    type: Number,
    example: 9100,
    description: 'Puerto (si es NETWORK)',
    nullable: true,
  })
  port: number | null;

  @ApiProperty({
    type: String,
    example: '/dev/usb/lp0',
    description:
      'Ruta o identificador del dispositivo (si es USB/SERIAL/BLUETOOTH)',
    nullable: true,
  })
  path: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indica si la impresora está activa',
  })
  isActive: boolean;

  @ApiPropertyOptional({
    type: String,
    example: '00:1A:2B:3C:4D:5E',
    description:
      'Dirección MAC de la impresora (opcional, útil para algunas conexiones)',
    nullable: true,
  })
  macAddress: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}
