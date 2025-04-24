import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DeepPartial as TypeOrmDeepPartial } from 'typeorm'; // Importar DeepPartial de typeorm y renombrar
import { AddressEntity } from '../entities/address.entity';
import { AddressRepository } from '../../address.repository';
import { Address } from '../../../../domain/address';
import { AddressMapper } from '../mappers/address.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
// Eliminar la importación del DeepPartial personalizado
// import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class AddressRelationalRepository implements AddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async create(
    data: Omit<
      Address,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'customer'
    >,
  ): Promise<Address> {
    const persistenceModel = AddressMapper.toPersistence(data as Address);
    const newEntity = await this.addressRepository.save(
      this.addressRepository.create(persistenceModel),
    );
    // Recargar para obtener relaciones (customer)
    const completeEntity = await this.addressRepository.findOne({
      where: { id: newEntity.id },
      relations: ['customer'],
    });
    if (!completeEntity) {
      throw new Error(`Failed to load created address with ID ${newEntity.id}`);
    }
    const domainEntity = AddressMapper.toDomain(completeEntity);
    if (!domainEntity) {
      throw new Error(
        `Failed to map created address with ID ${newEntity.id} to domain`,
      );
    }
    return domainEntity;
  }

  async findById(id: Address['id']): Promise<NullableType<Address>> {
    const entity = await this.addressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async findByCustomerId(
    customerId: Address['customerId'],
  ): Promise<Address[]> {
    const entities = await this.addressRepository.find({
      where: { customerId },
      relations: ['customer'], // Opcional cargar el cliente aquí
      order: { isDefault: 'DESC', createdAt: 'ASC' }, // Predeterminada primero, luego por fecha
    });
    return entities
      .map((entity) => AddressMapper.toDomain(entity))
      .filter((address): address is Address => address !== null);
  }

  async update(
    id: Address['id'],
    payload: TypeOrmDeepPartial<Address>, // Usar el DeepPartial de TypeORM aquí
  ): Promise<Address | null> {
    const entity = await this.addressRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    const updatedEntity = await this.addressRepository.save(
      this.addressRepository.merge(
        entity,
        payload as TypeOrmDeepPartial<AddressEntity>, // Usar el DeepPartial de TypeORM aquí también
      ),
    );
    // Recargar para obtener relaciones actualizadas
    const completeEntity = await this.addressRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['customer'],
    });
    if (!completeEntity) {
      throw new Error(
        `Failed to load updated address with ID ${updatedEntity.id}`,
      );
    }
    const domainEntity = AddressMapper.toDomain(completeEntity);
    if (!domainEntity) {
      throw new Error(
        `Failed to map updated address with ID ${updatedEntity.id} to domain`,
      );
    }
    return domainEntity;
  }

  async save(address: Address): Promise<Address> {
    const entity = AddressMapper.toPersistence(address);
    const savedEntity = await this.addressRepository.save(entity);
    // Recargar para obtener relaciones
    const completeEntity = await this.addressRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['customer'],
    });
    if (!completeEntity) {
      throw new Error(`Failed to load saved address with ID ${savedEntity.id}`);
    }
    const domainEntity = AddressMapper.toDomain(completeEntity);
    if (!domainEntity) {
      throw new Error(
        `Failed to map saved address with ID ${savedEntity.id} to domain`,
      );
    }
    return domainEntity;
  }

  async remove(id: Address['id']): Promise<void> {
    const result = await this.addressRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found.`);
    }
  }

  async removeMany(ids: Address['id'][]): Promise<void> {
    if (ids.length === 0) return;
    await this.addressRepository.softDelete({ id: In(ids) });
  }
}
