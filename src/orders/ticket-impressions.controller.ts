import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards, // Importar UseGuards si se requiere autenticación/autorización
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Importar ApiBearerAuth
import { OrdersService } from './orders.service';
import { TicketImpression } from './domain/ticket-impression';
import { AuthGuard } from '@nestjs/passport'; // Importar AuthGuard
import { RolesGuard } from '../roles/roles.guard'; // Importar RolesGuard
import { Roles } from '../roles/roles.decorator'; // Importar Roles
import { RoleEnum } from '../roles/roles.enum'; // Importar RoleEnum

@ApiTags('Order Ticket Impressions') // Etiqueta para Swagger
@Controller({
  path: 'orders/:orderId/ticket-impressions', // Ruta anidada bajo orders
  version: '1',
})
export class TicketImpressionsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiBearerAuth() // Añadir si se requiere autenticación
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Añadir guardias
  @Roles(RoleEnum.admin, RoleEnum.user) // Definir roles permitidos (ajustar según necesidad)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Obtener todas las impresiones de tickets para una orden específica',
  })
  @ApiParam({ name: 'orderId', description: 'ID de la orden', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de impresiones de tickets para la orden.',
    type: [TicketImpression],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada.',
  })
  findAllByOrderId(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<TicketImpression[]> {
    // Se necesita un método en OrdersService para esto
    return this.ordersService.findImpressionsByOrderId(orderId);
  }

  // Aquí se podrían añadir más endpoints si fueran necesarios (ej. GET /ticket-impressions/:impressionId)
}
