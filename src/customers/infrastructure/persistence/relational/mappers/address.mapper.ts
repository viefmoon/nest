import { Address } from '../../../../domain/address';
import { AddressEntity } from '../entities/address.entity';
// import { CustomerMapper } from './customer.mapper'; // Comentar o eliminar esta línea

export class AddressMapper {
  static toDomain(entity: AddressEntity): Address | null {
    if (!entity) {
      return null;
    }
    const address = new Address();
    address.id = entity.id;
    address.customerId = entity.customerId;
    address.street = entity.street;
    address.number = entity.number;
    address.interiorNumber = entity.interiorNumber;
    address.neighborhood = entity.neighborhood;
    address.city = entity.city;
    address.state = entity.state;
    address.zipCode = entity.zipCode;
    address.country = entity.country;
    address.references = entity.references;
    address.isDefault = entity.isDefault;
    address.createdAt = entity.createdAt;
    address.updatedAt = entity.updatedAt;
    address.deletedAt = entity.deletedAt;

    // Mapear cliente si existe y está cargado
    // Evitar bucle infinito no mapeando las direcciones del cliente aquí
    if (entity.customer) {
      // Crear un objeto Customer básico solo con el ID si es necesario,
      // o mapear sin las direcciones para evitar recursión.
      // Por simplicidad, aquí no incluimos el mapeo completo del cliente
      // si no es estrictamente necesario para el dominio Address.
      // Si se necesita el cliente completo, asegurarse de manejar la recursión.
      // address.customer = CustomerMapper.toDomain(entity.customer); // Cuidado con la recursión
    }

    return address;
  }

  static toPersistence(domain: Address): AddressEntity {
    const entity = new AddressEntity();
    entity.id = domain.id;
    entity.customerId = domain.customerId;
    entity.street = domain.street;
    entity.number = domain.number ?? null;
    entity.interiorNumber = domain.interiorNumber ?? null;
    entity.neighborhood = domain.neighborhood;
    entity.city = domain.city;
    entity.state = domain.state;
    entity.zipCode = domain.zipCode;
    entity.country = domain.country;
    entity.references = domain.references ?? null;
    entity.isDefault = domain.isDefault;
    // No mapeamos createdAt, updatedAt, deletedAt
    // No mapeamos la relación 'customer' aquí, se maneja por JoinColumn
    return entity;
  }
}
