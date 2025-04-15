import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreparationScreenEntity } from '../entities/preparation-screen.entity';
import { PreparationScreenRepository } from '../../preparation-screen.repository';
import { PreparationScreen } from '../../../../domain/preparation-screen';
import { PreparationScreenMapper } from '../mappers/preparation-screen.mapper';

@Injectable()
export class PreparationScreensRelationalRepository
  implements PreparationScreenRepository
{
  constructor(
    @InjectRepository(PreparationScreenEntity)
    private readonly preparationScreenRepository: Repository<PreparationScreenEntity>,
  ) {}

  async create(data: PreparationScreen): Promise<PreparationScreen> {
    const entity = PreparationScreenMapper.toPersistence(data);
    if (!entity) {
      throw new Error('No se pudo crear la entidad de pantalla de preparación');
    }
    const savedEntity = await this.preparationScreenRepository.save(entity);
    const domainResult = PreparationScreenMapper.toDomain(savedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad guardada a dominio');
    }
    return domainResult;
  }

  async findOne(id: string): Promise<PreparationScreen> {
    const entity = await this.preparationScreenRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!entity) {
      throw new NotFoundException(
        `Pantalla de preparación con ID ${id} no encontrada`,
      );
    }
    const domainResult = PreparationScreenMapper.toDomain(entity);
    if (!domainResult) {
      // Esto no debería ocurrir si la entidad existe y el mapper es correcto
      throw new Error(`Error al mapear la entidad con ID ${id} a dominio.`);
    }
    return domainResult;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<[PreparationScreen[], number]> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.preparationScreenRepository
      .createQueryBuilder('preparationScreen')
      .leftJoinAndSelect('preparationScreen.products', 'products')
      .skip(skip)
      .take(limit)
      .orderBy('preparationScreen.name', 'ASC');

    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('preparationScreen.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    const [entities, count] = await queryBuilder.getManyAndCount();

    const domainResults = entities
      .map(PreparationScreenMapper.toDomain)
      .filter((item): item is PreparationScreen => item !== null);

    return [domainResults, count];
  }

  async update(
    id: string,
    data: PreparationScreen,
  ): Promise<PreparationScreen> {
    const entity = PreparationScreenMapper.toPersistence(data);
    if (!entity) {
      throw new Error(
        'No se pudo crear la entidad de pantalla de preparación para actualizar',
      );
    }

    await this.preparationScreenRepository.update(id, entity);

    const updatedEntity = await this.preparationScreenRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(
        `Pantalla de preparación con ID ${id} no encontrada`,
      );
    }

    const domainResult = PreparationScreenMapper.toDomain(updatedEntity);
    if (!domainResult) {
      throw new Error('No se pudo mapear la entidad actualizada a dominio');
    }

    return domainResult;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.preparationScreenRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Pantalla de preparación con ID ${id} no encontrada`,
      );
    }
  }
}
