import { PreparationScreen } from '../../domain/preparation-screen';

export interface PreparationScreenRepository {
  create(data: PreparationScreen): Promise<PreparationScreen>;
  findOne(id: string): Promise<PreparationScreen>;
  findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<[PreparationScreen[], number]>;
  update(id: string, data: PreparationScreen): Promise<PreparationScreen>;
  softDelete(id: string): Promise<void>;
}
