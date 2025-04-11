import { NullableType } from '../../../utils/types/nullable.type';
import { PreparationScreen } from '../../domain/preparation-screen';
import { FindAllPreparationScreensDto } from '../../dto/find-all-preparation-screens.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options'; // Ensure pagination options are imported

// Define a combined type for findAll options for clarity
export type FindPreparationScreensRepositoryDto = FindAllPreparationScreensDto & {
  paginationOptions: IPaginationOptions;
};

export interface PreparationScreenRepository {
  /**
   * Saves a preparation screen entity (creates if no id, updates otherwise).
   * Handles relations automatically.
   * @param preparationScreen The preparation screen domain entity to save.
   * @returns The saved preparation screen domain entity.
   */
  save(preparationScreen: PreparationScreen): Promise<PreparationScreen>;

  /**
   * Finds all preparation screens matching the criteria, with pagination.
   * @param options Combined filter and pagination options.
   * @returns A tuple containing the list of preparation screens and the total count.
   */
  findAll(
    options: FindPreparationScreensRepositoryDto,
  ): Promise<[PreparationScreen[], number]>;

  /**
   * Finds a single preparation screen by its ID.
   * @param id The ID of the preparation screen.
   * @returns The preparation screen domain entity or null if not found.
   */
  findOne(id: string): Promise<NullableType<PreparationScreen>>;

  /**
   * Finds multiple preparation screens by their IDs.
   * @param ids An array of preparation screen IDs.
   * @returns An array of found preparation screen domain entities.
   */
  findByIds(ids: string[]): Promise<PreparationScreen[]>;

  /**
   * Soft deletes a preparation screen by its ID.
   * @param id The ID of the preparation screen to soft delete.
   * @returns A promise that resolves when the operation is complete.
   */
  softDelete(id: string): Promise<void>;
}
