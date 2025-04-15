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

  // NUEVO MÉTODO PARA OBTENER EL MENÚ COMPLETO
  async getFullMenu(): Promise<Category[]> {
    // Aquí asumimos que el repositorio tiene un método para obtener
    // las categorías con todas las relaciones necesarias cargadas (eager/lazy loading o una consulta específica).
    // Es crucial que la implementación del repositorio sea eficiente.
    // Necesitaremos cargar:
    // - subcategories
    // - subcategories.products
    // - subcategories.products.modifierGroups (o la relación producto <-> grupo modificador)
    // - subcategories.products.modifierGroups.modifiers
    // - subcategories.products.variants (si aplica)

    // Idealmente, el repositorio debería manejar esto con una consulta optimizada.
    // Por ejemplo, usando QueryBuilder o find con relaciones anidadas.
    return this.categoryRepository.findFullMenu(); // Llamamos al método implementado en el repositorio
  }
  // FIN NUEVO MÉTODO
}
