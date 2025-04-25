import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { Area } from './domain/area';
import { CreateAreaDto } from './dto/create-area.dto';
import { FindAllAreasDto } from './dto/find-all-areas.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaRepository } from './infrastructure/persistence/area.repository'; // Keep type for interface
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AREA_REPOSITORY } from '../common/tokens';
import { Paginated } from '../common/types/paginated.type';

@Injectable()
export class AreasService {
  constructor(
    @Inject(AREA_REPOSITORY) private readonly areaRepository: AreaRepository,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    
    const existingArea = await this.areaRepository.findByName(
      createAreaDto.name,
    );
    if (existingArea) {
      throw new ConflictException(
        `Ya existe un área con el nombre '${createAreaDto.name}'`,
      );
    }

    const area = new Area();
    area.name = createAreaDto.name;
    area.description = createAreaDto.description || null;
    area.isActive =
      createAreaDto.isActive !== undefined ? createAreaDto.isActive : true;

    return this.areaRepository.create(area);
  }

  async findAll(
    filterOptions: FindAllAreasDto,
    paginationOptions: IPaginationOptions,
  ): Promise<Paginated<Area>> {
    return this.areaRepository.findManyWithPagination({
      filterOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areaRepository.findById(id);

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    
    if (updateAreaDto.name) {
      const existingArea = await this.areaRepository.findByName(
        updateAreaDto.name,
      );
      if (existingArea && existingArea.id !== id) {
        throw new ConflictException(
          `Ya existe un área con el nombre '${updateAreaDto.name}'`,
        );
      }
    }

    const updatedArea = await this.areaRepository.update(id, updateAreaDto);

    if (!updatedArea) {
      throw new NotFoundException('Area not found');
    }

    return updatedArea;
  }

  async remove(id: string): Promise<void> {
    return this.areaRepository.remove(id);
  }
}
