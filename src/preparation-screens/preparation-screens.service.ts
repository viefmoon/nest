import { Injectable } from '@nestjs/common';
import { PreparationScreen } from './domain/preparation-screen';
import { CreatePreparationScreenDto } from './dto/create-preparation-screen.dto';
import { FindAllPreparationScreensDto } from './dto/find-all-preparation-screens.dto';
import { UpdatePreparationScreenDto } from './dto/update-preparation-screen.dto';
import { PreparationScreenRepository } from './infrastructure/persistence/preparation-screen.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class PreparationScreensService {
  constructor(
    private readonly preparationScreenRepository: PreparationScreenRepository,
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
    preparationScreen.displayOrder =
      createPreparationScreenDto.displayOrder !== undefined
        ? createPreparationScreenDto.displayOrder
        : 1;
    preparationScreen.color = createPreparationScreenDto.color || null;

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
      await this.preparationScreenRepository.findById(id);

    if (!preparationScreen) {
      throw new Error('Preparation screen not found');
    }

    return preparationScreen;
  }

  async update(
    id: string,
    updatePreparationScreenDto: UpdatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    const updatedPreparationScreen =
      await this.preparationScreenRepository.update(
        id,
        updatePreparationScreenDto,
      );

    if (!updatedPreparationScreen) {
      throw new Error('Preparation screen not found');
    }

    return updatedPreparationScreen;
  }

  async remove(id: string): Promise<void> {
    return this.preparationScreenRepository.remove(id);
  }
}
