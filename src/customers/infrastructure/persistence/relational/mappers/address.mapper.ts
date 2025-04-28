import { Injectable } from '@nestjs/common';
import { Address } from '../../../../domain/address';
import { AddressEntity } from '../entities/address.entity';
import { CustomerEntity } from '../entities/customer.entity';
import { BaseMapper } from '../../../../../common/mappers/base.mapper';

@Injectable()
export class AddressMapper extends BaseMapper<AddressEntity, Address> {
  override toDomain(entity: AddressEntity): Address | null {
    if (!entity) {
      return null;
    }
    const domain = new Address();
    domain.id = entity.id;
    domain.customerId = entity.customerId;
    domain.street = entity.street;
    domain.number = entity.number;
    domain.interiorNumber = entity.interiorNumber;
    domain.neighborhood = entity.neighborhood;
    domain.city = entity.city;
    domain.state = entity.state;
    domain.zipCode = entity.zipCode;
    domain.country = entity.country;
    domain.references = entity.references;
    domain.isDefault = entity.isDefault;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  override toEntity(domain: Address): AddressEntity | null {
    if (!domain) {
      return null;
    }
    const entity = new AddressEntity();
    entity.id = domain.id;
    entity.customer = { id: domain.customerId } as CustomerEntity;
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
    return entity;
  }
}
