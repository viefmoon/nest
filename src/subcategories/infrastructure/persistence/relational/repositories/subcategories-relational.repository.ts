import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategoryEntity } from '../entities/subcategory.entity';
import { SubCategoryRepository } from '../../subcategory.repository';
import { SubCategory } from '../../../../domain/subcategory';
import { SubCategoryMapper } from '../mappers/subcategory.mapper';

@Injectable()
export class SubCategoriesRelationalRepository
  implements SubCategoryRepository
{
  constructor(
    @InjectRepository(SubCategoryEntity)
    private readonly subCategoryRepository: Repository<SubCategoryEntity>,
  ) {}

  async create(data: SubCategory): Promise<SubCategory> {
    const entity = SubCategoryMapper.toEntity(data);
    if (!entity) {
      throw new Error('No se pudo crear la entidad de subcategoría');
    }
    const savedEntity = await this.subCategoryRepository.save(entity);
    const domainResult = SubCategoryMapper.toDomain(savedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad guardada a dominio');
    }
    return domainResult;
  }

  async findOne(id: string): Promise<SubCategory> {
    const entity = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['photo', 'category'],
    });

    const domainResult = entity ? SubCategoryMapper.toDomain(entity) : null;
    if (!domainResult) {
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
    }
    return domainResult;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<[SubCategory[], number]> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subCategoryRepository
      .createQueryBuilder('subcategory')
      .leftJoinAndSelect('subcategory.photo', 'photo')
      .leftJoinAndSelect('subcategory.category', 'category')
      .skip(skip)
      .take(limit);

    if (options?.categoryId) {
      queryBuilder.andWhere('subcategory.categoryId = :categoryId', {
        categoryId: options.categoryId,
      });
    }

    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('subcategory.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    const [entities, count] = await queryBuilder.getManyAndCount();

    const domainResults = entities
      .map(SubCategoryMapper.toDomain)
      .filter((item): item is SubCategory => item !== null);

    return [domainResults, count];
  }

  async update(id: string, data: SubCategory): Promise<SubCategory> {
    const entity = SubCategoryMapper.toEntity(data);
    if (!entity) {
      throw new Error(
        'No se pudo crear la entidad de subcategoría para actualizar',
      );
    }

    await this.subCategoryRepository.update(id, entity);

    const updatedEntity = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['photo', 'category'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
    }

    const domainResult = SubCategoryMapper.toDomain(updatedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad actualizada a dominio');
    }

    return domainResult;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.subCategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
    }
  }
}
