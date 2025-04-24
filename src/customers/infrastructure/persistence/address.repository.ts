import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { Address } from '../../domain/address';

export abstract class AddressRepository {
  abstract create(
    data: Omit<
      Address,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'customer'
    >,
  ): Promise<Address>;

  abstract findById(id: Address['id']): Promise<NullableType<Address>>;
  abstract findByCustomerId(
    customerId: Address['customerId'],
  ): Promise<Address[]>;

  abstract update(
    id: Address['id'],
    payload: DeepPartial<Address>,
  ): Promise<Address | null>;

  // Método save para manejar actualizaciones completas si es necesario
  abstract save(address: Address): Promise<Address>;

  abstract remove(id: Address['id']): Promise<void>;
  abstract removeMany(ids: Address['id'][]): Promise<void>; // Para eliminar múltiples direcciones
}
