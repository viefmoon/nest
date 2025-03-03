import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PreparationScreen } from '../../domain/preparation-screen';
import { FindAllPreparationScreensDto } from '../../dto/find-all-preparation-screens.dto';

export abstract class PreparationScreenRepository {
  abstract create(
    data: Omit<
      PreparationScreen,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<PreparationScreen>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllPreparationScreensDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PreparationScreen[]>;

  abstract findById(
    id: PreparationScreen['id'],
  ): Promise<NullableType<PreparationScreen>>;
  abstract findByName(
    name: PreparationScreen['name'],
  ): Promise<NullableType<PreparationScreen>>;

  abstract update(
    id: PreparationScreen['id'],
    payload: DeepPartial<PreparationScreen>,
  ): Promise<PreparationScreen | null>;

  abstract remove(id: PreparationScreen['id']): Promise<void>;
}
