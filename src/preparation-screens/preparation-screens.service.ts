import { Injectable, NotFoundException } from '@nestjs/common';
import { PreparationScreen } from './domain/preparation-screen';
import { CreatePreparationScreenDto } from './dto/create-preparation-screen.dto';
import { FindAllPreparationScreensDto } from './dto/find-all-preparation-screens.dto';
import { UpdatePreparationScreenDto } from './dto/update-preparation-screen.dto';
import { PreparationScreenRepository } from './infrastructure/persistence/preparation-screen.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ProductRepository } from '../products/infrastructure/persistence/product.repository'; // Import ProductRepository
import { Product } from '../products/domain/product';

@Injectable()
export class PreparationScreensService {
  constructor(
    private readonly preparationScreenRepository: PreparationScreenRepository,
    private readonly productRepository: ProductRepository, // Inject ProductRepository
  ) {}

  async create(
    createPreparationScreenDto: CreatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    const preparationScreen = new PreparationScreen();
    preparationScreen.name = createPreparationScreenDto.name;
    preparationScreen.description =
      createPreparationScreenDto.description || null;
    preparationScreen.isActive =
      createPreparationScreenDto.isActive !== undefined
        ? createPreparationScreenDto.isActive
        : true;
    let productEntities: Product[] = [];
    if (createPreparationScreenDto.productIds?.length) {
      productEntities = await this.productRepository.findByIds(
        createPreparationScreenDto.productIds,
      );
      if (
        productEntities.length !== createPreparationScreenDto.productIds.length
      ) {
        // Find which IDs were not found
        const foundIds = productEntities.map((p) => p.id);
        const notFoundIds = createPreparationScreenDto.productIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new NotFoundException(
          `Products with IDs ${notFoundIds.join(', ')} not found.`,
        );
      }
    }

    // Assign products before creating
    preparationScreen.products = productEntities;

    return this.preparationScreenRepository.create(preparationScreen);
  }

  async findAll(
    filterOptions: FindAllPreparationScreensDto,
    paginationOptions: IPaginationOptions,
  ): Promise<PreparationScreen[]> {
    return this.preparationScreenRepository.findManyWithPagination({
      filterOptions,
      paginationOptions,
    });
  }

  async findOne(id: string): Promise<PreparationScreen> {
    const preparationScreen =
      // Consider loading relations here if needed, e.g., using repository options
      await this.preparationScreenRepository.findById(id);

    if (!preparationScreen) {
      // Use NestJS standard NotFoundException
      throw new NotFoundException(`Preparation screen with ID ${id} not found`);
    }

    // Optionally load products if not loaded by default in findById
    // if (!preparationScreen.products) {
    //   const screenWithProducts = await this.preparationScreenRepository.findByIdWithProducts(id);
    //   if (!screenWithProducts) throw new NotFoundException(`Preparation screen with ID ${id} not found`);
    //   return screenWithProducts;
    // }

    return preparationScreen;
  }

  async update(
    id: string,
    updatePreparationScreenDto: UpdatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    // Fetch the existing screen first to manage relations
    const existingScreen = await this.preparationScreenRepository.findById(id);
    if (!existingScreen) {
      throw new NotFoundException(`Preparation screen with ID ${id} not found`);
    }

    // Prepare the payload excluding productIds, as we handle relation separately
    const { productIds, ...updatePayload } = updatePreparationScreenDto;

    let productsToAssign: Product[] | undefined = undefined;

    // If productIds is provided (even an empty array), update the relation
    if (productIds !== undefined) {
      if (productIds.length > 0) {
        productsToAssign = await this.productRepository.findByIds(productIds);
        // Verificar si productsToAssign no es undefined antes de acceder a length y map
        if (
          !productsToAssign ||
          productsToAssign.length !== productIds.length
        ) {
          const foundIds = productsToAssign
            ? productsToAssign.map((p) => p.id)
            : [];
          const notFoundIds = productIds.filter(
            (pid) => !foundIds.includes(pid),
          );
          throw new NotFoundException(
            `Products with IDs ${notFoundIds.join(', ')} not found.`,
          );
        }
      } else {
        // If an empty array is provided, remove all relations
        productsToAssign = [];
      }
    }

    // Create the final payload including the products relation if it was updated
    const finalPayload: Partial<PreparationScreen> = {
      ...updatePayload,
      ...(productsToAssign !== undefined && { products: productsToAssign }),
    };

    const updatedPreparationScreen =
      await this.preparationScreenRepository.update(id, finalPayload);

    // The update method in repository should return the updated entity
    // If it returns null, it means the entity wasn't found during the update process itself
    if (!updatedPreparationScreen) {
      throw new NotFoundException(
        `Preparation screen with ID ${id} could not be updated or was not found.`,
      );
    }

    return updatedPreparationScreen;
  }

  async remove(id: string): Promise<void> {
    return this.preparationScreenRepository.remove(id);
  }
}
