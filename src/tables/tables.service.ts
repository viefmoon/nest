import { Injectable, UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { TableRepository } from './infrastructure/persistence/table.repository';
import { Table } from './domain/table';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { NullableType } from '../utils/types/nullable.type';

/**
 * Servicio principal para Mesas.
 */
@Injectable()
export class TablesService {
  constructor(private readonly tableRepository: TableRepository) {}

  async createTable(dto: CreateTableDto): Promise<Table> {
    // Validar lógica: p.ej. que el areaId exista, etc. 
    // (esa parte normalmente se haría con un repositorio de áreas o hooking a un service)

    const tableToCreate: Omit<Table, 'id'> = {
      name: dto.name,
      isTemporary: dto.isTemporary ?? false,
      parentTableId: dto.parentTableId ?? null,
      // "area" se setea con un domain minimal, 
      // asumiendo que la verificación del areaId se hace en AreasService, 
      // o en otra capa de validación
      area: { id: dto.areaId, name: '', description: '' },
    };

    return this.tableRepository.create(tableToCreate);
  }

  async findAll(): Promise<Table[]> {
    return this.tableRepository.findAll();
  }

  async findById(id: number): Promise<NullableType<Table>> {
    return this.tableRepository.findById(id);
  }

  async updateTable(id: number, dto: UpdateTableDto): Promise<Table> {
    // Si cambia el areaId, habría que validarlo, etc.
    const partialUpdate: Partial<Table> = {
      name: dto.name,
      isTemporary: dto.isTemporary,
      parentTableId: dto.parentTableId,
    };

    if (dto.areaId !== undefined) {
      partialUpdate.area = { id: dto.areaId, name: '' };
    }

    return this.tableRepository.update(id, partialUpdate);
  }

  async removeTable(id: number): Promise<void> {
    // Verificar si la mesa tiene órdenes activas, etc. 
    // De no haber problemas, la "borramos" lógicamente:
    await this.tableRepository.remove(id);
  }

  async mergeTables(parentId: number, childrenIds: number[]): Promise<void> {
    if (!childrenIds.length) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'No child table IDs provided',
      });
    }
    await this.tableRepository.mergeTables(parentId, childrenIds);
  }

  async splitTables(tableId: number): Promise<void> {
    await this.tableRepository.splitTables(tableId);
  }
} 