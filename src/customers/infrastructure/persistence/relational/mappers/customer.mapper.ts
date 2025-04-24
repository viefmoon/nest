import { Customer } from '../../../../domain/customer';
import { CustomerEntity } from '../entities/customer.entity';
import { AddressMapper } from './address.mapper'; // Importar AddressMapper

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): Customer {
    const customer = new Customer();
    customer.id = entity.id;
    customer.firstName = entity.firstName;
    customer.lastName = entity.lastName;
    customer.phoneNumber = entity.phoneNumber;
    customer.email = entity.email;
    customer.createdAt = entity.createdAt;
    customer.updatedAt = entity.updatedAt;
    customer.deletedAt = entity.deletedAt;

    // Mapear direcciones si existen y están cargadas
    if (entity.addresses) {
      customer.addresses = entity.addresses
        .map((addressEntity) => AddressMapper.toDomain(addressEntity))
        .filter(
          (address): address is NonNullable<typeof address> => address !== null,
        ); // Filtrar nulos si AddressMapper puede devolver null
    } else {
      customer.addresses = []; // Asegurar que siempre sea un array
    }

    return customer;
  }

  static toPersistence(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.id;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.phoneNumber = domain.phoneNumber ?? null;
    entity.email = domain.email ?? null;
    // No mapeamos createdAt, updatedAt, deletedAt (manejados por TypeORM)
    // No mapeamos la relación 'addresses' aquí, TypeORM la maneja
    // a través de la relación en AddressEntity.
    return entity;
  }
}
