import { Inject, Injectable } from '@nestjs/common';
import { SubCategoryRepository } from './infrastructure/persistence/subcategory.repository';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { SubCategory } from './domain/subcategory';
import { FindAllSubCategoriesDto } from './dto/find-all-subcategories.dto';

@Injectable()
export class SubCategoriesService {
  constructor(
    @Inject('SubCategoryRepository')
    private readonly subCategoryRepository: SubCategoryRepository,
  ) {}

  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const subCategory = new SubCategory();
    subCategory.name = createSubCategoryDto.name;
    subCategory.description = createSubCategoryDto.description || null;
    subCategory.isActive = createSubCategoryDto.isActive ?? true;
    subCategory.categoryId = createSubCategoryDto.categoryId;

    if (createSubCategoryDto.photoId) {
      subCategory.photo = {
        id: createSubCategoryDto.photoId,
        path: '',
      };
    }

    return this.subCategoryRepository.create(subCategory);
  }

  async findAll(
    findAllSubCategoriesDto: FindAllSubCategoriesDto,
  ): Promise<[SubCategory[], number]> {
    return this.subCategoryRepository.findAll({
      page: findAllSubCategoriesDto.page,
      limit: findAllSubCategoriesDto.limit,
      categoryId: findAllSubCategoriesDto.categoryId,
      isActive: findAllSubCategoriesDto.isActive,
    });
  }

  async findOne(id: string): Promise<SubCategory> {
    return this.subCategoryRepository.findOne(id);
  }

  async update(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const existingSubCategory = await this.subCategoryRepository.findOne(id);

    const subCategory = new SubCategory();
    subCategory.id = id;
    subCategory.name = updateSubCategoryDto.name ?? existingSubCategory.name;
    subCategory.description =
      updateSubCategoryDto.description ?? existingSubCategory.description;
    subCategory.isActive =
      updateSubCategoryDto.isActive ?? existingSubCategory.isActive;
    subCategory.categoryId =
      updateSubCategoryDto.categoryId ?? existingSubCategory.categoryId;

    if (updateSubCategoryDto.photoId !== undefined) {
      subCategory.photo = updateSubCategoryDto.photoId
        ? {
            id: updateSubCategoryDto.photoId,
            path: '',
          }
        : null;
    } else if (existingSubCategory.photo) {
      subCategory.photo = {
        id: existingSubCategory.photo.id,
        path: '',
      };
    }

    return this.subCategoryRepository.update(id, subCategory);
  }

  async remove(id: string): Promise<void> {
    return this.subCategoryRepository.softDelete(id);
  }
}
