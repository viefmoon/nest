import { NullableType } from '../../../utils/types/nullable.type';
import { Address } from '../../domain/address';
import { IBaseRepository } from '../../../common/domain/repositories/base.repository'; // Importar IBaseRepository
import { CreateAddressDto } from '../../dto/create-address.dto'; // Importar DTOs
import { UpdateAddressDto } from '../../dto/update-address.dto';
import { FindAllAddressesDto } from '../../dto/find-all-addresses.dto'; // Importar el DTO real

// Eliminar el tipo placeholder


// Implementar IBaseRepository con los tipos específicos
export abstract class AddressRepository
  implements IBaseRepository< // Cambiado 'extends' por 'implements'
    Address,
    FindAllAddressesDto, // Usar el DTO de filtro real
    CreateAddressDto,
    UpdateAddressDto
  >
{
  // Declarar los métodos abstractos de IBaseRepository que faltan
  abstract create(data: CreateAddressDto): Promise<Address>;
  abstract findById(id: Address['id']): Promise<NullableType<Address>>;
  abstract findAll(filter?: FindAllAddressesDto): Promise<Address[]>;
  abstract update(id: Address['id'], payload: UpdateAddressDto): Promise<NullableType<Address>>;
  abstract remove(id: Address['id']): Promise<void>;

  // Mantener métodos específicos que no están en IBaseRepository
  abstract findByCustomerId(
    customerId: Address['customerId'],
  ): Promise<Address[]>;

  // Mantener 'save' si se necesita específicamente para manejar relaciones complejas
  abstract save(address: Address): Promise<Address>;

  // Mantener 'removeMany' si es necesario
  abstract removeMany(ids: Address['id'][]): Promise<void>;

  // findAll(filter?: FindAllAddressesDto): Promise<Address[]>; // Ya heredado
}
