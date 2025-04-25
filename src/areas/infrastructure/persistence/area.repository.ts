import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Area } from '../../domain/area';
import { FindAllAreasDto } from '../../dto/find-all-areas.dto';
import { Paginated } from '../../../common/types/paginated.type';

export abstract class AreaRepository {
  abstract create(
    data: Omit<Area, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Area>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllAreasDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Paginated<Area>>;

  abstract findById(id: Area['id']): Promise<NullableType<Area>>;
  abstract findByName(name: Area['name']): Promise<NullableType<Area>>;

  abstract update(
    id: Area['id'],
    payload: DeepPartial<Area>,
  ): Promise<Area | null>;

  abstract remove(id: Area['id']): Promise<void>;
}
