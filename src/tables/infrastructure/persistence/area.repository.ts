import { NullableType } from '../../../utils/types/nullable.type';
import { Area } from '../../domain/area';

export abstract class AreaRepository {
  abstract create(data: Omit<Area, 'id'>): Promise<Area>;
  abstract findById(id: Area['id']): Promise<NullableType<Area>>;
  abstract findAll(): Promise<Area[]>;
  abstract update(id: Area['id'], data: Partial<Area>): Promise<Area>;
  abstract remove(id: Area['id']): Promise<void>;
} 