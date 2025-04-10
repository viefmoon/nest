import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantRepository } from '../../product-variant.repository';
import { ProductVariant } from '../../../../domain/product-variant';
import { ProductVariantMapper } from '../mappers/product-variant.mapper';

@Injectable()
export class ProductVariantRelationalRepository
  implements ProductVariantRepository
{
  constructor(
    @InjectRepository(ProductVariantEntity)
    private readonly productVariantRepository: Repository<ProductVariantEntity>,
  ) {}

  async create(productVariant: ProductVariant): Promise<ProductVariant> {
    const entity = ProductVariantMapper.toEntity(productVariant);
    const savedEntity = await this.productVariantRepository.save(entity);
    return ProductVariantMapper.toDomain(savedEntity);
  }

  async findAll(options: {
    page: number;
    limit: number;
    productId?: string;
    isActive?: boolean;
  }): Promise<[ProductVariant[], number]> {
    const where: any = {};

    if (options.productId) {
      where.productId = options.productId;
    }

    if (options.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    const [entities, count] = await this.productVariantRepository.findAndCount({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      relations: ['product'],
    });

    const productVariants = entities.map((entity) =>
      ProductVariantMapper.toDomain(entity),
    );
    return [productVariants, count];
  }

  async findOne(id: string): Promise<ProductVariant> {
    const entity = await this.productVariantRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!entity) {
      throw new NotFoundException(
        `Variante de producto con ID ${id} no encontrada`,
      );
    }

    return ProductVariantMapper.toDomain(entity);
  }

  async update(
    id: string,
    productVariant: ProductVariant,
  ): Promise<ProductVariant> {
    const entity = ProductVariantMapper.toEntity(productVariant);
    await this.productVariantRepository.update(id, entity);

    const updatedEntity = await this.productVariantRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!updatedEntity) {
      throw new NotFoundException(
        `Variante de producto con ID ${id} no encontrada`,
      );
    }

    return ProductVariantMapper.toDomain(updatedEntity);
  }

  async save(productVariant: ProductVariant): Promise<ProductVariant> {
    const entity = ProductVariantMapper.toEntity(productVariant);
    const savedEntity = await this.productVariantRepository.save(entity);
    // Recargar para asegurar que las relaciones estén actualizadas
    const reloadedEntity = await this.productVariantRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['product'],
    });
    if (!reloadedEntity) {
      throw new NotFoundException(
        `Variante con ID ${savedEntity.id} no encontrada después de guardar`,
      );
    }
    return ProductVariantMapper.toDomain(reloadedEntity);
  }

  async findAllByProductId(productId: string): Promise<ProductVariant[]> {
    const entities = await this.productVariantRepository.find({
      where: { productId },
      relations: ['product'],
    });
    return entities.map((entity) => ProductVariantMapper.toDomain(entity));
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.productVariantRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Variante de producto con ID ${id} no encontrada`,
      );
    }
  }
}
