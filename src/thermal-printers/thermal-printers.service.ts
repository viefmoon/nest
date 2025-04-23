import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ThermalPrinterRepository } from './infrastructure/persistence/thermal-printer.repository';
import { CreateThermalPrinterDto } from './dto/create-thermal-printer.dto';
import { UpdateThermalPrinterDto } from './dto/update-thermal-printer.dto';
import { ThermalPrinter } from './domain/thermal-printer';
import { FindAllThermalPrintersDto } from './dto/find-all-thermal-printers.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ThermalPrintersService {
  constructor(
    private readonly thermalPrinterRepository: ThermalPrinterRepository,
  ) {}

  async create(createDto: CreateThermalPrinterDto): Promise<ThermalPrinter> {
    // Check if a printer with the same name already exists
    const existingPrinter = await this.thermalPrinterRepository.findByName(
      createDto.name,
    );
    if (existingPrinter) {
      throw new ConflictException(
        `Ya existe una impresora con el nombre '${createDto.name}'`,
      );
    }

    const printer = new ThermalPrinter();
    printer.name = createDto.name;
    printer.connectionType = createDto.connectionType;
    printer.ipAddress = createDto.ipAddress || null;
    printer.port = createDto.port || null;
    printer.path = createDto.path || null;
    printer.isActive = createDto.isActive ?? true;
    printer.macAddress = createDto.macAddress || null;

    return this.thermalPrinterRepository.create(printer);
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
        throw new ConflictException(
          `Ya existe otra impresora con el nombre '${updateDto.name}'`,
        );
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

    return updatedPrinter;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensures printer exists before attempting removal
    return this.thermalPrinterRepository.remove(id);
  }
}
