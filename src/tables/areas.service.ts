import { Injectable, NotFoundException } from '@nestjs/common';
import { AreaRepository } from './infrastructure/persistence/area.repository';
import { Area } from './domain/area';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class AreasService {
  constructor(private readonly areaRepository: AreaRepository) {}

  async createArea(dto: CreateAreaDto): Promise<Area> {
    const areaToCreate: Omit<Area, 'id'> = {
      name: dto.name,
      description: dto.description ?? null,
    };
    return this.areaRepository.create(areaToCreate);
  }

  async findAll(): Promise<Area[]> {
    return this.areaRepository.findAll();
  }

  async findById(id: number): Promise<NullableType<Area>> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }
    return area;
  }

  async updateArea(id: number, dto: UpdateAreaDto): Promise<Area> {
    // validaciones adicionales (ej: no renombrar a un nombre duplicado, etc.)
    return this.areaRepository.update(id, {
      name: dto.name,
      description: dto.description,
    });
  }

  async removeArea(id: number): Promise<void> {
    // Chequeo extra: si hay mesas en esa área. 
    // En caso real, tendrías un repositorio de Tables para verificar.
    await this.areaRepository.remove(id);
  }
} 