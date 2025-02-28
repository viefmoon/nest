import { Injectable } from '@nestjs/common';
import { ModifierGroupRepository } from './infrastructure/persistence/modifier-group.repository';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { ModifierGroup } from './domain/modifier-group';
import { FindAllModifierGroupsDto } from './dto/find-all-modifier-groups.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ModifierGroupsService {
  constructor(
    private readonly modifierGroupRepository: ModifierGroupRepository,
  ) {}

  async create(
    createModifierGroupDto: CreateModifierGroupDto,
  ): Promise<ModifierGroup> {
    const data = {
      ...createModifierGroupDto,
      description: createModifierGroupDto.description ?? null,
      minSelections: createModifierGroupDto.minSelections ?? 0,
      isRequired: createModifierGroupDto.isRequired ?? false,
      allowMultipleSelections:
        createModifierGroupDto.allowMultipleSelections ?? false,
      isActive: createModifierGroupDto.isActive ?? true,
      productModifiers: [],
      products: [],
    };

    return this.modifierGroupRepository.create(data);
  }

  async findAll(
    findAllModifierGroupsDto: FindAllModifierGroupsDto,
  ): Promise<ModifierGroup[]> {
    const paginationOptions: IPaginationOptions = {
      page: findAllModifierGroupsDto.page ?? 1,
      limit: findAllModifierGroupsDto.limit ?? 10,
    };

    return this.modifierGroupRepository.findManyWithPagination({
      filterOptions: findAllModifierGroupsDto,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<ModifierGroup> {
    const modifierGroup = await this.modifierGroupRepository.findById(id);

    if (!modifierGroup) {
      throw new Error('Grupo de modificadores no encontrado');
    }

    return modifierGroup;
  }

  async update(
    id: string,
    updateModifierGroupDto: UpdateModifierGroupDto,
  ): Promise<ModifierGroup> {
    const modifierGroup = await this.modifierGroupRepository.update(
      id,
      updateModifierGroupDto,
    );

    if (!modifierGroup) {
      throw new Error('Grupo de modificadores no encontrado');
    }

    return modifierGroup;
  }

  async remove(id: string): Promise<void> {
    const modifierGroup = await this.modifierGroupRepository.findById(id);

    if (!modifierGroup) {
      throw new Error('Grupo de modificadores no encontrado');
    }

    await this.modifierGroupRepository.remove(id);
  }
}
