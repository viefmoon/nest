import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModifierGroupEntity } from '../entities/modifier-group.entity';
import { ModifierGroupRepository } from '../../modifier-group.repository';
import { ModifierGroup } from '../../../../domain/modifier-group';
import { FindAllModifierGroupsDto } from '../../../../dto/find-all-modifier-groups.dto';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class ModifierGroupsRelationalRepository
  implements ModifierGroupRepository
{
  constructor(
    @InjectRepository(ModifierGroupEntity)
    private readonly modifierGroupRepository: Repository<ModifierGroupEntity>,
  ) {}

  async create(
    data: Omit<ModifierGroup, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<ModifierGroup> {
    const entityData = {
      ...data,
      productModifiers: [],
      products: [],
    };

    const newModifierGroup = this.modifierGroupRepository.create(
      entityData as any,
    );

    const savedModifierGroup =
      await this.modifierGroupRepository.save(newModifierGroup);

    const entityToMap = Array.isArray(savedModifierGroup)
      ? savedModifierGroup[0]
      : savedModifierGroup;

    return this.mapEntityToDomain(entityToMap);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllModifierGroupsDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<ModifierGroup[]> {
    const queryBuilder =
      this.modifierGroupRepository.createQueryBuilder('modifierGroup');

    if (filterOptions?.name) {
      queryBuilder.andWhere('modifierGroup.name ILIKE :name', {
        name: `%${filterOptions.name}%`,
      });
    }

    if (filterOptions?.isRequired !== undefined) {
      queryBuilder.andWhere('modifierGroup.isRequired = :isRequired', {
        isRequired: filterOptions.isRequired,
      });
    }

    if (filterOptions?.allowMultipleSelections !== undefined) {
      queryBuilder.andWhere(
        'modifierGroup.allowMultipleSelections = :allowMultipleSelections',
        {
          allowMultipleSelections: filterOptions.allowMultipleSelections,
        },
      );
    }

    if (filterOptions?.isActive !== undefined) {
      queryBuilder.andWhere('modifierGroup.isActive = :isActive', {
        isActive: filterOptions.isActive,
      });
    }

    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    queryBuilder.skip(skip);
    queryBuilder.take(paginationOptions.limit);

    const modifierGroups = await queryBuilder.getMany();
    return modifierGroups.map(this.mapEntityToDomain);
  }

  async findById(
    id: ModifierGroup['id'],
  ): Promise<NullableType<ModifierGroup>> {
    const modifierGroup = await this.modifierGroupRepository.findOne({
      where: { id },
    });

    return modifierGroup ? this.mapEntityToDomain(modifierGroup) : null;
  }

  async findByName(
    name: ModifierGroup['name'],
  ): Promise<NullableType<ModifierGroup>> {
    const modifierGroup = await this.modifierGroupRepository.findOne({
      where: { name },
    });

    return modifierGroup ? this.mapEntityToDomain(modifierGroup) : null;
  }

  async update(
    id: ModifierGroup['id'],
    payload: DeepPartial<ModifierGroup>,
  ): Promise<ModifierGroup | null> {
    const modifierGroup = await this.modifierGroupRepository.findOne({
      where: { id },
    });

    if (!modifierGroup) {
      return null;
    }

    const updatedModifierGroup = await this.modifierGroupRepository.save({
      ...modifierGroup,
      ...payload,
    } as any);

    const entityToMap = Array.isArray(updatedModifierGroup)
      ? updatedModifierGroup[0]
      : updatedModifierGroup;

    return this.mapEntityToDomain(entityToMap);
  }

  async remove(id: ModifierGroup['id']): Promise<void> {
    await this.modifierGroupRepository.softDelete(id);
  }

  private mapEntityToDomain(entity: ModifierGroupEntity): ModifierGroup {
    const modifierGroup = new ModifierGroup();
    modifierGroup.id = entity.id;
    modifierGroup.name = entity.name;
    modifierGroup.description = entity.description;
    modifierGroup.minSelections = entity.minSelections;
    modifierGroup.maxSelections = entity.maxSelections;
    modifierGroup.isRequired = entity.isRequired;
    modifierGroup.allowMultipleSelections = entity.allowMultipleSelections;
    modifierGroup.isActive = entity.isActive;
    modifierGroup.createdAt = entity.createdAt;
    modifierGroup.updatedAt = entity.updatedAt;
    modifierGroup.deletedAt = entity.deletedAt;
    modifierGroup.productModifiers = [];
    modifierGroup.products = [];

    return modifierGroup;
  }
}
