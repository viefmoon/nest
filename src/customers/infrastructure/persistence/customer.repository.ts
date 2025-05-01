import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Customer } from '../../domain/customer';
import { FindAllCustomersDto } from '../../dto/find-all-customers.dto';
import { IBaseRepository } from '../../../common/domain/repositories/base.repository'; // Importar IBaseRepository
import { CreateCustomerDto } from '../../dto/create-customer.dto'; // Importar DTOs
import { UpdateCustomerDto } from '../../dto/update-customer.dto';
import { DeepPartial } from 'typeorm'; // Usar DeepPartial de typeorm si es necesario para save

// Extender IBaseRepository con los tipos específicos
export abstract class CustomerRepository
  implements IBaseRepository< // Cambiado 'extends' por 'implements'
    Customer,
    FindAllCustomersDto,
    CreateCustomerDto,
    UpdateCustomerDto
  >
{
  // Los métodos create, findById, findAll (sin paginación), update, remove son heredados.

  // Mantener métodos específicos que no están en IBaseRepository
  // Se elimina findManyWithPagination

  abstract findByEmail(
    email: Customer['email'],
  ): Promise<NullableType<Customer>>;

  abstract findByPhone(
    phone: Customer['phoneNumber'],
  ): Promise<NullableType<Customer>>;

  // Mantener 'save' si se necesita específicamente para manejar relaciones complejas
  // que 'update' de IBaseRepository no cubre adecuadamente.
  abstract save(customer: Customer): Promise<Customer>;

  // findAll(filter?: FindAllCustomersDto): Promise<Customer[]>; // Ya heredado
}
