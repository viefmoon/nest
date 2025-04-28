import { Injectable } from '@nestjs/common'; // Removed Inject
import { Category } from '../../../../domain/category';
import { CategoryEntity } from '../entities/category.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { SubcategoryMapper } from '../../../../../subcategories/infrastructure/persistence/relational/mappers/subcategory.mapper';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { BaseMapper, mapArray } from '../../../../../common/mappers/base.mapper';

@Injectable()
export class CategoryMapper extends BaseMapper<CategoryEntity, Category> {
  constructor(
    private readonly subcategoryMapper: SubcategoryMapper,
  ) {
    super();
  }

  override toDomain(entity: CategoryEntity): Category | null {
    if (!entity) return null;
    const d = new Category();
    d.id          = entity.id;
    d.name        = entity.name;
    d.description = entity.description;
    d.isActive    = entity.isActive;
    d.photoId     = entity.photoId;
    d.photo       = entity.photo ? FileMapper.toDomain(entity.photo) : null;
    d.subcategories = mapArray(entity.subcategories, (sub) => this.subcategoryMapper.toDomain(sub));
    d.createdAt   = entity.createdAt;
    d.updatedAt   = entity.updatedAt;
    d.deletedAt   = entity.deletedAt;
    return d;
  }

  override toEntity(domain: Category): CategoryEntity | null {
    if (!domain) return null;
    const e = new CategoryEntity();
    if (domain.id) e.id = domain.id;
    e.name        = domain.name;
    e.description = domain.description;
    e.isActive    = domain.isActive;
    e.photo       = domain.photoId ? ({ id: domain.photoId } as FileEntity) : null;
    return e;
  }
}
