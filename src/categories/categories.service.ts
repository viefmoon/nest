import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './domain/category';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description || null;
    category.isActive = createCategoryDto.isActive ?? true;

    if (createCategoryDto.photoId) {
      category.photo = {
        id: createCategoryDto.photoId,
        path: '',
      };
    }

    return this.categoryRepository.create(category);
  }

  async findAll(
    findAllCategoriesDto: FindAllCategoriesDto,
  ): Promise<[Category[], number]> {
    return this.categoryRepository.findAll({
      page: findAllCategoriesDto.page,
      limit: findAllCategoriesDto.limit,
      isActive: findAllCategoriesDto.isActive,
    });
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne(id);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne(id);

    const category = new Category();
    category.id = id;
    category.name = updateCategoryDto.name ?? existingCategory.name;
    category.description =
      updateCategoryDto.description ?? existingCategory.description;
    category.isActive = updateCategoryDto.isActive ?? existingCategory.isActive;

    if (updateCategoryDto.photoId !== undefined) {
      category.photo = updateCategoryDto.photoId
        ? {
            id: updateCategoryDto.photoId,
            path: '',
          }
        : null;
    } else if (existingCategory.photo) {
      category.photo = {
        id: existingCategory.photo.id,
        path: '',
      };
    }

    return this.categoryRepository.update(id, category);
  }

  async remove(id: string): Promise<void> {
    return this.categoryRepository.softDelete(id);
  }
}
