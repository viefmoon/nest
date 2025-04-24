import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Customer } from '../../domain/customer';
import { FindAllCustomersDto } from '../../dto/find-all-customers.dto'; // Importar DTO de filtro

export abstract class CustomerRepository {
  abstract create(
    data: Omit<
      Customer,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'addresses'
    >,
  ): Promise<Customer>;

  abstract findManyWithPagination({
    filterOptions, // Añadir filterOptions
    paginationOptions,
  }: {
    filterOptions?: FindAllCustomersDto | null; // Usar el DTO importado
    paginationOptions: IPaginationOptions;
  }): Promise<[Customer[], number]>; // Devolver también el conteo total

  abstract findById(id: Customer['id']): Promise<NullableType<Customer>>;
  abstract findByEmail(
    email: Customer['email'],
  ): Promise<NullableType<Customer>>;
  abstract findByPhone(
    phone: Customer['phoneNumber'],
  ): Promise<NullableType<Customer>>; // Añadir búsqueda por teléfono

  abstract update(
    id: Customer['id'],
    payload: DeepPartial<Customer>,
  ): Promise<Customer | null>;

  // Método save para manejar actualizaciones que incluyen relaciones (direcciones)
  abstract save(customer: Customer): Promise<Customer>;

  abstract remove(id: Customer['id']): Promise<void>;
}
