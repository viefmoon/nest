import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { PrintOrderDto } from './dto/print-order.dto';
import { ThermalPrintersService } from './thermal-printers.service'; // Importar servicio
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'; // Importar librería
import { PrinterConnectionType } from './domain/thermal-printer'; // Importar enum

@Injectable()
export class PrintingService {
  private readonly logger = new Logger(PrintingService.name);

  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
    @Inject(ThermalPrintersService) // Inyectar ThermalPrintersService
    private readonly thermalPrintersService: ThermalPrintersService,
  ) {}

  async printKitchenTicket(printOrderDto: PrintOrderDto): Promise<void> {
    // Renombrar función
    const { orderId, printerId } = printOrderDto;

    // 1. Obtener detalles de la orden
    const order = await this.ordersService.findOne(orderId); // findOne ya lanza error si no existe
    this.logger.log(`Orden ${orderId} encontrada.`);

    // 2. Obtener detalles de la impresora (si se proporcionó ID)
    if (!printerId) {
      this.logger.error('No se proporcionó ID de impresora para la impresión.');
      throw new BadRequestException('Se requiere el ID de la impresora.');
    }

    const printerDetails = await this.thermalPrintersService.findOne(printerId);
    if (!printerDetails.isActive) {
      throw new BadRequestException(
        `La impresora ${printerId} no está activa.`,
      );
    }

    // Validar que sea impresora de red (Ethernet)
    if (
      printerDetails.connectionType !== PrinterConnectionType.NETWORK ||
      !printerDetails.ipAddress ||
      !printerDetails.port
    ) {
      throw new BadRequestException(
        `La impresora ${printerId} no es una impresora de red válida (IP/Puerto).`,
      );
    }

    this.logger.log(
      `Usando impresora: ${printerDetails.name} (${printerDetails.ipAddress}:${printerDetails.port})`,
    );

    // 3. Configurar e imprimir usando node-thermal-printer
    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // Ajustar según el tipo de impresora real (EPSON es común)
      interface: `tcp://${printerDetails.ipAddress}:${printerDetails.port}`,
      // options: { // Opciones adicionales si son necesarias
      //   timeout: 3000
      // }
    });

    try {
      const isConnected = await printer.isPrinterConnected();
      if (!isConnected) {
        this.logger.error(
          `No se pudo conectar a la impresora ${printerDetails.name} en ${printerDetails.ipAddress}:${printerDetails.port}`,
        );
        throw new InternalServerErrorException(
          'No se pudo conectar a la impresora.',
        );
      }

      this.logger.log(
        `Conectado a la impresora ${printerDetails.name}. Imprimiendo ticket de cocina...`,
      );

      // --- Contenido del Ticket de Cocina ---
      printer.alignCenter();
      printer.bold(true);
      printer.println('*** TICKET DE COCINA ***');
      printer.bold(false);
      printer.newLine();

      printer.alignLeft();
      printer.println(`Orden ID: ${order.id}`);
      printer.println(`Folio del día: ${order.dailyNumber}`); // Usar dailyNumber

      // Aquí añadirías más detalles de la orden si fuera necesario (items, notas, etc.)
      // Por ahora, solo ID y Folio como solicitado.

      printer.cut(); // Cortar papel

      // --- Fin Contenido ---

      await printer.execute(); // Enviar comandos a la impresora
      this.logger.log(
        `Ticket de cocina para orden ${orderId} enviado a ${printerDetails.name} exitosamente.`,
      );
    } catch (error) {
      this.logger.error(
        `Error al imprimir en ${printerDetails.name}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Error al enviar la impresión: ${error.message}`,
      );
    }
  }
}
