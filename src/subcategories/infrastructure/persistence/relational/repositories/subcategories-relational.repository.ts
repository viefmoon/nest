import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubcategoryEntity } from '../entities/Subcategory.entity';
import { SubcategoryRepository } from '../../Subcategory.repository';
import { Subcategory } from '../../../../domain/Subcategory';
import { SubcategoryMapper } from '../mappers/Subcategory.mapper';

@Injectable()
export class SubcategoriesRelationalRepository
  implements SubcategoryRepository
{
  constructor(
    @InjectRepository(SubcategoryEntity)
    private readonly subcategoryRepository: Repository<SubcategoryEntity>,
  ) {}

  async create(data: Subcategory): Promise<Subcategory> {
    const entity = SubcategoryMapper.toEntity(data);
    if (!entity) {
      throw new Error('No se pudo crear la entidad de subcategoría');
    }
    const savedEntity = await this.subcategoryRepository.save(entity);
    const domainResult = SubcategoryMapper.toDomain(savedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad guardada a dominio');
    }
    return domainResult;
  }

  async findOne(id: string): Promise<Subcategory> {
    const entity = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['photo', 'category'],
    });

    const domainResult = entity ? SubcategoryMapper.toDomain(entity) : null;
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
  }): Promise<[Subcategory[], number]> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subcategoryRepository
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
      .map(SubcategoryMapper.toDomain)
      .filter((item): item is Subcategory => item !== null);

    return [domainResults, count];
  }

  async update(id: string, data: Subcategory): Promise<Subcategory> {
    const entity = SubcategoryMapper.toEntity(data);
    if (!entity) {
      throw new Error(
        'No se pudo crear la entidad de subcategoría para actualizar',
      );
    }

    await this.subcategoryRepository.update(id, entity);

    const updatedEntity = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['photo', 'category'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
    }

    const domainResult = SubcategoryMapper.toDomain(updatedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad actualizada a dominio');
    }

    return domainResult;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.subcategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subcategoría con ID ${id} no encontrada`);
    }
  }
}
