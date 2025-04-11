import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'; // Add forwardRef
import { PreparationScreen } from './domain/preparation-screen';
import { CreatePreparationScreenDto } from './dto/create-preparation-screen.dto';
import { FindAllPreparationScreensDto } from './dto/find-all-preparation-screens.dto';
import { UpdatePreparationScreenDto } from './dto/update-preparation-screen.dto';
import { PreparationScreenRepository } from './infrastructure/persistence/preparation-screen.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
// Remove ProductRepository import
import { Product } from '../products/domain/product';
import { ProductsService } from '../products/products.service'; // Import ProductsService

@Injectable()
export class PreparationScreensService {
  constructor(
    @Inject('PreparationScreenRepository') // Inject using token
    private readonly preparationScreenRepository: PreparationScreenRepository,
    @Inject(forwardRef(() => ProductsService)) // Use forwardRef for service injection
    private readonly productsService: ProductsService,
  ) {}

  async create(
    createDto: CreatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    const preparationScreen = new PreparationScreen();
    preparationScreen.name = createDto.name;
    preparationScreen.description = createDto.description ?? null;
    preparationScreen.isActive = createDto.isActive ?? true;

    if (createDto.productIds && createDto.productIds.length > 0) {
      const products: Product[] = [];
      const notFoundIds: string[] = [];
      // Iterate and fetch each product using ProductsService.findOne
      for (const productId of createDto.productIds) {
        try {
          const product = await this.productsService.findOne(productId);
          products.push(product);
        } catch (error) {
          if (error instanceof NotFoundException) {
            notFoundIds.push(productId);
          } else {
            // Re-throw unexpected errors
            throw error;
          }
        }
      }
      // If any products were not found, throw an exception
      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `Products with IDs ${notFoundIds.join(', ')} not found.`,
        );
      }
      preparationScreen.products = products;
    } else {
      preparationScreen.products = []; // Initialize as empty array if no IDs provided
    }

    return this.preparationScreenRepository.save(preparationScreen);
  }

  async findAll(
    filterOptions: FindAllPreparationScreensDto,
    paginationOptions: IPaginationOptions,
  ): Promise<[PreparationScreen[], number]> { // Return tuple
    return this.preparationScreenRepository.findAll({
      ...filterOptions, // Spread filter options
      paginationOptions, // Pass pagination options object
    });
  }

  async findOne(id: string): Promise<PreparationScreen> {
    const preparationScreen = await this.preparationScreenRepository.findOne(id); // Use findOne

    if (!preparationScreen) {
      throw new NotFoundException(`Preparation screen with ID ${id} not found`);
    }
    // findOne in the repository now loads relations by default based on our refactoring
    return preparationScreen;
  }

  async update(
    id: string,
    updateDto: UpdatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    const existingScreen = await this.preparationScreenRepository.findOne(id); // Use findOne
    if (!existingScreen) {
      throw new NotFoundException(`Preparation screen with ID ${id} not found`);
    }

    // Update scalar properties
    existingScreen.name = updateDto.name ?? existingScreen.name;
    existingScreen.description =
      updateDto.description !== undefined
        ? updateDto.description
        : existingScreen.description; // Handle null explicitly if needed
    existingScreen.isActive = updateDto.isActive ?? existingScreen.isActive;

    // Handle product relations if productIds is provided
    if (updateDto.productIds !== undefined) {
      if (updateDto.productIds.length > 0) {
        const products: Product[] = [];
        const notFoundIds: string[] = [];
        // Iterate and fetch each product using ProductsService.findOne
        for (const productId of updateDto.productIds) {
          try {
            const product = await this.productsService.findOne(productId);
            products.push(product);
          } catch (error) {
            if (error instanceof NotFoundException) {
              notFoundIds.push(productId);
            } else {
              // Re-throw unexpected errors
              throw error;
            }
          }
        }
        // If any products were not found, throw an exception
        if (notFoundIds.length > 0) {
          throw new NotFoundException(
            `Products with IDs ${notFoundIds.join(', ')} not found during update.`,
          );
        }
        existingScreen.products = products;
      } else {
        // Empty array means remove all relations
        existingScreen.products = [];
      }
    }
    // If productIds is undefined, don't modify the existing relations

    // Save the updated entity using the repository's save method
    return this.preparationScreenRepository.save(existingScreen);
  }

  async remove(id: string): Promise<void> {
    // Ensure the entity exists before attempting to delete (optional but good practice)
    const existingScreen = await this.preparationScreenRepository.findOne(id);
    if (!existingScreen) {
      throw new NotFoundException(`Preparation screen with ID ${id} not found`);
    }
    await this.preparationScreenRepository.softDelete(id); // Use softDelete
  }
}
