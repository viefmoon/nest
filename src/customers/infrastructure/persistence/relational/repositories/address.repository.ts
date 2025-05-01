import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, FindOptionsWhere } from 'typeorm'; // Añadir FindOptionsWhere
import { AddressEntity } from '../entities/address.entity';
import { AddressRepository } from '../../address.repository';
import { Address } from '../../../../domain/address';
import { AddressMapper } from '../mappers/address.mapper';
import { BaseRelationalRepository } from '../../../../../common/infrastructure/persistence/relational/base-relational.repository'; // Importar Base
import { CreateAddressDto } from '../../../../dto/create-address.dto'; // Importar DTOs
import { UpdateAddressDto } from '../../../../dto/update-address.dto';
import { FindAllAddressesDto } from '../../../../dto/find-all-addresses.dto'; // Importar el DTO real
import { ILike } from 'typeorm'; // Importar ILike para búsqueda parcial

// Eliminar el tipo placeholder

@Injectable()
export class AddressRelationalRepository
  extends BaseRelationalRepository< // Extender BaseRelationalRepository
    AddressEntity,
    Address,
    FindAllAddressesDto, // Usar el DTO de filtro real
    CreateAddressDto,
    UpdateAddressDto
  >
  implements AddressRepository // Implementar la interfaz AddressRepository
{
  constructor(
    @InjectRepository(AddressEntity)
    ormRepo: Repository<AddressEntity>, // Cambiar nombre de variable inyectada
    mapper: AddressMapper, // Cambiar nombre de variable inyectada
  ) {
    super(ormRepo, mapper); // Llamar al constructor de la clase base
  }

  // Implementar buildWhere para manejar filtros específicos de Address
  protected override buildWhere(
    filter?: FindAllAddressesDto,
  ): FindOptionsWhere<AddressEntity> | undefined {
    const where: FindOptionsWhere<AddressEntity> = {};

    if (filter?.customerId) {
      where.customerId = filter.customerId;
    }
    if (filter?.isDefault !== undefined) {
      where.isDefault = filter.isDefault;
    }
    if (filter?.zipCode) {
      where.zipCode = filter.zipCode;
    }
    if (filter?.city) { // Añadir filtro por ciudad
      where.city = ILike(`%${filter.city}%`);
    }
    // Añadir más filtros si es necesario (street, state, etc.)

    return Object.keys(where).length > 0 ? where : undefined;
  }

  // Mantener métodos específicos de AddressRepository
  async findByCustomerId(
    customerId: Address['customerId'],
  ): Promise<Address[]> {
    // Se puede implementar usando findAll con el filtro adecuado
    return this.findAll({ customerId });
    /* // O mantener la implementación original si se necesita orden específico u otra lógica
    const entities = await this.ormRepo.find({
      where: { customerId },
      relations: ['customer'], // Asegurar que las relaciones necesarias estén cargadas si el mapper las usa
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
    return entities
      .map((entity) => this.mapper.toDomain(entity))
      .filter((address): address is Address => address !== null);
    */
  }

  // Mantener save si es necesario para lógica compleja de relaciones
  async save(address: Address): Promise<Address> {
    const entity = this.mapper.toEntity(address);
     if (!entity) {
      throw new InternalServerErrorException('Could not map address domain to entity for saving');
    }
    const savedEntity = await this.ormRepo.save(entity);
    // Recargar la entidad completa para asegurar que las relaciones (como customer) estén presentes
    const completeEntity = await this.ormRepo.findOne({
      where: { id: savedEntity.id },
      relations: ['customer'], // Cargar relaciones necesarias para el mapper
    });
    if (!completeEntity) {
      throw new Error(`Failed to load saved address with ID ${savedEntity.id}`);
    }
    const domainEntity = this.mapper.toDomain(completeEntity);
    if (!domainEntity) {
      throw new InternalServerErrorException(
        `Failed to map saved address with ID ${savedEntity.id} to domain`,
      );
    }
    return domainEntity;
  }

  // Mantener removeMany
  async removeMany(ids: Address['id'][]): Promise<void> {
    if (ids.length === 0) return;
    await this.ormRepo.softDelete({ id: In(ids) });
  }

  // Los métodos create, findById, findAll (sin paginación), update, remove son heredados.
}
