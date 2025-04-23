import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  // UseGuards, // Descomentar si se añade seguridad
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  // ApiBearerAuth, // Descomentar si se añade seguridad
} from '@nestjs/swagger';
import { PrintingService } from './printing.service';
import { PrintOrderDto } from './dto/print-order.dto';
// import { AuthGuard } from '@nestjs/passport'; // Descomentar si se añade seguridad
// import { RolesGuard } from '../roles/roles.guard'; // Descomentar si se añade seguridad
// import { Roles } from '../roles/roles.decorator'; // Descomentar si se añade seguridad
// import { RoleEnum } from '../roles/roles.enum'; // Descomentar si se añade seguridad

@ApiTags('Printing') // Etiqueta para Swagger
@Controller({
  path: 'print', // Ruta base para este controlador
  version: '1',
})
export class PrintingController {
  constructor(private readonly printingService: PrintingService) {}

  @Post('order') // Endpoint específico: POST /api/v1/print/order
  @HttpCode(HttpStatus.ACCEPTED) // Usamos 202 Accepted ya que la impresión puede ser asíncrona
  @ApiOperation({ summary: 'Enviar una orden a imprimir en una impresora térmica' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'La solicitud de impresión ha sido aceptada.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden o impresora no encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor durante la impresión.',
  })
  // @ApiBearerAuth() // Descomentar para requerir autenticación
  // @UseGuards(AuthGuard('jwt'), RolesGuard) // Descomentar para añadir guardias
  // @Roles(RoleEnum.admin) // Descomentar y ajustar roles según sea necesario
  async printOrder(@Body() printOrderDto: PrintOrderDto): Promise<{ message: string }> {
    // Llamamos al servicio para manejar la lógica de impresión
    await this.printingService.printOrder(printOrderDto);
    // Devolvemos una respuesta simple indicando que la solicitud fue aceptada
    return { message: 'Solicitud de impresión aceptada.' };
  }
}