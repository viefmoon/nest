import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm'; // Eliminar 'In'
import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../../product.repository';
import { Product } from '../../../../domain/product';
import { ProductMapper } from '../mappers/product.mapper';
import { ModifierGroupEntity } from '../../../../../modifier-groups/infrastructure/persistence/relational/entities/modifier-group.entity';

@Injectable()
export class ProductRelationalRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ModifierGroupEntity)
    private readonly modifierGroupRepository: Repository<ModifierGroupEntity>,
  ) {}

  async create(product: Product): Promise<Product> {
    const entity = ProductMapper.toEntity(product);
    const savedEntity = await this.productRepository.save(entity);
    return ProductMapper.toDomain(savedEntity);
  }

  async findAll(options: {
    page: number;
    limit: number;
    subCategoryId?: string;
    hasVariants?: boolean;
    isActive?: boolean;
    search?: string;
  }): Promise<[Product[], number]> {
    const where: any = {};

    if (options.subCategoryId) {
      where.subCategoryId = options.subCategoryId;
    }

    if (options.hasVariants !== undefined) {
      where.hasVariants = options.hasVariants;
    }

    if (options.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options.search) {
      where.name = ILike(`%${options.search}%`);
    }

    const [entities, count] = await this.productRepository.findAndCount({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      relations: ['photo', 'subCategory', 'variants', 'modifierGroups'],
    });

    const products = entities.map((entity) => ProductMapper.toDomain(entity));
    return [products, count];
  }

  async findOne(id: string): Promise<Product> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: ['photo', 'subCategory', 'variants', 'modifierGroups'],
    });

    if (!entity) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return ProductMapper.toDomain(entity);
  }

  async update(id: string, product: Product): Promise<Product> {
    const entity = ProductMapper.toEntity(product);
    await this.productRepository.update(id, entity);

    const updatedEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['photo', 'subCategory', 'variants', 'modifierGroups'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return ProductMapper.toDomain(updatedEntity);
  }

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toEntity(product);
    // Asegurarse de que las relaciones (como modifierGroups) estén mapeadas correctamente si es necesario
    // En este caso, el mapeador podría necesitar lógica adicional si el dominio no tiene las entidades TypeORM
    // Pero como el servicio ya está manejando las entidades ModifierGroup, debería funcionar.
    const savedEntity = await this.productRepository.save(entity);
    // Recargar para asegurar que todas las relaciones estén presentes después de guardar
    const reloadedEntity = await this.productRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['photo', 'subCategory', 'variants', 'modifierGroups'],
    });
    if (!reloadedEntity) {
      // Esto no debería suceder si el save fue exitoso, pero es una verificación de seguridad
      throw new NotFoundException(
        `Producto con ID ${savedEntity.id} no encontrado después de guardar`,
      );
    }
    return ProductMapper.toDomain(reloadedEntity);
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.productRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }

  // Los métodos assign/get/removeModifierGroups se eliminan de la implementación
  // ya que la lógica principal está en el servicio usando 'save'.
}
