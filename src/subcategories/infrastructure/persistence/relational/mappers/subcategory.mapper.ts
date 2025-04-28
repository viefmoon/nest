import { Injectable } from '@nestjs/common';
import { Subcategory } from '../../../../domain/subcategory';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { CategoryMapper } from '../../../../../categories/infrastructure/persistence/relational/mappers/category.mapper';
import { ProductMapper } from '../../../../../products/infrastructure/persistence/relational/mappers/product.mapper';
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { BaseMapper, mapArray } from '../../../../../common/mappers/base.mapper';

@Injectable()
export class SubcategoryMapper extends BaseMapper<SubcategoryEntity, Subcategory> {
  constructor(
    private readonly categoryMapper: CategoryMapper,
    private readonly fileMapper: FileMapper,
    private readonly productMapper: ProductMapper,
  ) {
    super();
  }

  override toDomain(entity: SubcategoryEntity): Subcategory | null {
    if (!entity) return null;
    const d = new Subcategory();
    d.id          = entity.id;
    d.name        = entity.name;
    d.description = entity.description;
    d.isActive    = entity.isActive;
    d.categoryId  = entity.categoryId;
    d.photoId     = entity.photoId;
    d.category    = entity.category ? this.categoryMapper.toDomain(entity.category) : null;
    d.photo       = entity.photo    ? this.fileMapper.toDomain(entity.photo)       : null;
    d.products    = mapArray(entity.products, (p) => this.productMapper.toDomain(p));
    d.createdAt   = entity.createdAt;
    d.updatedAt   = entity.updatedAt;
    d.deletedAt   = entity.deletedAt;
    return d;
  }

  override toEntity(domain: Subcategory): SubcategoryEntity | null {
    if (!domain) return null;
    const e = new SubcategoryEntity();
    if (domain.id) e.id = domain.id;
    e.name        = domain.name;
    e.description = domain.description;
    e.isActive    = domain.isActive;
    e.category    = { id: domain.categoryId } as CategoryEntity;
    e.photo       = domain.photoId ? ({ id: domain.photoId } as FileEntity) : null;
    return e;
  }
}
