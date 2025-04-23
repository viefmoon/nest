import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  // ServiceUnavailableException, // Eliminado ya que no se usa directamente
  Logger, // Asegurar que Logger esté importado
} from '@nestjs/common';
import { ThermalPrinterRepository } from './infrastructure/persistence/thermal-printer.repository';
import { CreateThermalPrinterDto } from './dto/create-thermal-printer.dto';
import { UpdateThermalPrinterDto } from './dto/update-thermal-printer.dto';
import {
  ThermalPrinter,
  PrinterConnectionType,
} from './domain/thermal-printer'; // Asegurar que PrinterConnectionType esté importado
import { FindAllThermalPrintersDto } from './dto/find-all-thermal-printers.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import net from 'net'; // Asegurar que net esté importado
import { QueryFailedError } from 'typeorm'; // Importar QueryFailedError
import { ERROR_CODES } from '../common/constants/error-codes.constants'; // Importar códigos de error

@Injectable()
export class ThermalPrintersService {
  private readonly logger = new Logger(ThermalPrintersService.name); // Mover la declaración del logger aquí

  constructor(
    private readonly thermalPrinterRepository: ThermalPrinterRepository,
  ) {}

  async create(createDto: CreateThermalPrinterDto): Promise<ThermalPrinter> {
    // Check if a printer with the same name already exists
    const existingPrinterByName =
      await this.thermalPrinterRepository.findByName(createDto.name);
    if (existingPrinterByName) {
      throw new ConflictException({
        code: ERROR_CODES.THERMAL_PRINTER_DUPLICATE_FIELD,
        message: `Ya existe una impresora con el nombre '${createDto.name}'.`,
        details: { field: 'name' },
      });
    }

    // Check for IP address conflict only for NETWORK printers
    if (
      createDto.connectionType === PrinterConnectionType.NETWORK &&
      createDto.ipAddress
    ) {
      const existingPrinterByIp =
        await this.thermalPrinterRepository.findByIpAddress(
          createDto.ipAddress,
        );
      if (existingPrinterByIp) {
        throw new ConflictException({
          code: ERROR_CODES.THERMAL_PRINTER_DUPLICATE_FIELD,
          message: `Ya existe una impresora con la dirección IP '${createDto.ipAddress}'.`,
          details: { field: 'ipAddress' },
        });
      }
    }

    const printer = new ThermalPrinter();
    printer.name = createDto.name;
    printer.connectionType = createDto.connectionType;
    printer.ipAddress = createDto.ipAddress || null;
    printer.port = createDto.port || null;
    printer.path = createDto.path || null;
    printer.isActive = createDto.isActive ?? true;
    printer.macAddress = createDto.macAddress || null;

    try {
      return await this.thermalPrinterRepository.create(printer);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        // Asumiendo código '23505' para violación de unicidad en PostgreSQL
        // Extraer el campo duplicado del mensaje de error si es posible (puede variar)
        const detail = error.driverError?.detail || '';
        let field = 'desconocido';
        if (detail.includes('ipAddress')) {
          field = 'dirección IP';
        } else if (detail.includes('name')) {
          field = 'nombre';
        }
        // ... añadir más campos únicos si existen

        throw new ConflictException({
          code: ERROR_CODES.THERMAL_PRINTER_DUPLICATE_FIELD,
          message: `Ya existe una impresora con el mismo ${field}.`,
          details: { field: field },
        });
      }
      // this.logger.error(`Error no manejado al crear impresora: ${error.message}`, error.stack, error); // Loguear el error completo
      throw error; // Relanzar otros errores
    }
  }

  async findAll(
    filterOptions: FindAllThermalPrintersDto,
    paginationOptions: IPaginationOptions,
  ): Promise<[ThermalPrinter[], number]> {
    return this.thermalPrinterRepository.findManyWithPagination({
      filterOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<ThermalPrinter> {
    const printer = await this.thermalPrinterRepository.findById(id);
    if (!printer) {
      throw new NotFoundException(`Impresora con ID ${id} no encontrada.`);
    }
    return printer;
  }

  async update(
    id: string,
    updateDto: UpdateThermalPrinterDto,
  ): Promise<ThermalPrinter> {
    const existingPrinter = await this.findOne(id); // Ensures printer exists

    // Check for name conflict if name is being updated
    if (updateDto.name && updateDto.name !== existingPrinter.name) {
      const conflictingPrinter = await this.thermalPrinterRepository.findByName(
        updateDto.name,
      );
      if (conflictingPrinter && conflictingPrinter.id !== id) {
        throw new ConflictException({
          code: ERROR_CODES.THERMAL_PRINTER_DUPLICATE_FIELD,
          message: `Ya existe otra impresora con el nombre '${updateDto.name}'.`,
          details: { field: 'name' },
        });
      }
    }

    // Check for IP address conflict if IP is being updated for a NETWORK printer
    if (
      (updateDto.connectionType === PrinterConnectionType.NETWORK ||
        (updateDto.connectionType === undefined &&
          existingPrinter.connectionType === PrinterConnectionType.NETWORK)) &&
      updateDto.ipAddress &&
      updateDto.ipAddress !== existingPrinter.ipAddress
    ) {
      const conflictingPrinterByIp =
        await this.thermalPrinterRepository.findByIpAddress(
          updateDto.ipAddress,
        );
      if (conflictingPrinterByIp && conflictingPrinterByIp.id !== id) {
        throw new ConflictException({
          code: ERROR_CODES.THERMAL_PRINTER_DUPLICATE_FIELD,
          message: `Ya existe otra impresora con la dirección IP '${updateDto.ipAddress}'.`,
          details: { field: 'ipAddress' },
        });
      }
    }

    // Create a partial update payload
    const updatePayload: Partial<ThermalPrinter> = {
      name: updateDto.name,
      connectionType: updateDto.connectionType,
      ipAddress: updateDto.ipAddress,
      port: updateDto.port,
      path: updateDto.path,
      isActive: updateDto.isActive,
      macAddress: updateDto.macAddress,
    };

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(updatePayload).forEach(
      (key) => updatePayload[key] === undefined && delete updatePayload[key],
    );

    const updatedPrinter = await this.thermalPrinterRepository.update(
      id,
      updatePayload,
    );

    if (!updatedPrinter) {
      throw new NotFoundException(`Impresora con ID ${id} no encontrada.`);
    }

    try {
      const updatedPrinter = await this.thermalPrinterRepository.update(
        id,
        updatePayload,
      );

      if (!updatedPrinter) {
        // Esto no debería ocurrir si findOne no lanzó error, pero por seguridad
        throw new NotFoundException(
          `Impresora con ID ${id} no encontrada después de intentar actualizar.`,
        );
      }

      return updatedPrinter;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        const detail = error.driverError?.detail || '';
        let field = 'desconocido';
        if (detail.includes('ipAddress')) {
          field = 'dirección IP';
        } else if (detail.includes('name')) {
          field = 'nombre';
        }
        // ... añadir más campos únicos si existen

        throw new ConflictException({
          code: ERROR_CODES.THERMAL_PRINTER_DUPLICATE_FIELD,
          message: `Ya existe otra impresora con el mismo ${field}.`,
          details: { field: field },
        });
      }
      // this.logger.error(`Error no manejado al actualizar impresora ${id}: ${error.message}`, error.stack, error); // Loguear el error completo
      throw error; // Relanzar otros errores
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensures printer exists before attempting removal
    return this.thermalPrinterRepository.remove(id);
  }

  async pingPrinter(id: string): Promise<{ status: string }> {
    this.logger.log(`Intentando hacer ping a la impresora con ID: ${id}`);
    const printer = await this.findOne(id); // Reutiliza findOne que ya lanza NotFoundException

    if (printer.connectionType !== PrinterConnectionType.NETWORK) {
      this.logger.warn(
        `Ping no aplicable para tipo de conexión: ${printer.connectionType}`,
      );
      throw new BadRequestException(
        `La prueba de ping solo es aplicable a impresoras con conexión NETWORK.`,
      );
    }

    if (!printer.ipAddress || !printer.port) {
      this.logger.error(
        `La impresora ${id} es NETWORK pero no tiene IP o puerto configurado.`,
      );
      throw new BadRequestException(
        'La impresora no tiene configurada una dirección IP o puerto para realizar el ping.',
      );
    }

    const host = printer.ipAddress;
    const port = printer.port;
    const timeout = 2000; // Timeout de 2 segundos

    return new Promise((resolve) => {
      const socket = new net.Socket();
      let connected = false;

      socket.setTimeout(timeout);

      socket.on('connect', () => {
        connected = true;
        this.logger.log(`Ping exitoso a ${host}:${port}`);
        socket.end();
        resolve({ status: 'online' });
      });

      socket.on('timeout', () => {
        this.logger.warn(`Timeout al intentar conectar a ${host}:${port}`);
        socket.destroy();
        // Considerar lanzar ServiceUnavailableException si se prefiere un error HTTP
        resolve({ status: 'offline' });
        // throw new ServiceUnavailableException(`Timeout al conectar con la impresora ${host}:${port}`);
      });

      socket.on('error', (err) => {
        this.logger.error(
          `Error de conexión a ${host}:${port}: ${err.message}`,
        );
        socket.destroy();
        // Considerar lanzar ServiceUnavailableException si se prefiere un error HTTP
        resolve({ status: 'offline' });
        // throw new ServiceUnavailableException(`Error al conectar con la impresora ${host}:${port}: ${err.message}`);
      });

      // Asegurarse de resolver como offline si se cierra sin conectar
      socket.on('close', () => {
        if (!connected) {
          this.logger.log(`Socket cerrado sin conexión a ${host}:${port}`);
          resolve({ status: 'offline' });
        }
      });

      this.logger.log(`Intentando conexión TCP a ${host}:${port}...`);
      socket.connect(port, host);
    });
  }
}
