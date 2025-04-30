import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ILike,
  Repository,
  DeepPartial as TypeOrmDeepPartial,
} from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerRepository } from '../../customer.repository';
import { Customer } from '../../../../domain/customer';
import { CustomerMapper } from '../mappers/customer.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FindAllCustomersDto } from '../../../../dto/find-all-customers.dto';

@Injectable()
export class CustomerRelationalRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly customerMapper: CustomerMapper, // Injected directly
  ) {}

  async create(
    data: Omit<
      Customer,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'addresses'
    >,
  ): Promise<Customer> {
    const persistenceModel = this.customerMapper.toEntity(data as Customer);
    if (!persistenceModel) {
       throw new Error('Could not map customer domain to entity');
    }
    const newEntity = await this.customerRepository.save(
      this.customerRepository.create(persistenceModel),
    );
    const completeEntity = await this.customerRepository.findOne({
      where: { id: newEntity.id },
      relations: ['addresses'],
    });
    if (!completeEntity) {
      throw new Error(
        `Failed to load created customer with ID ${newEntity.id}`,
      );
    }
    const domainEntity = this.customerMapper.toDomain(completeEntity);
     if (!domainEntity) {
       throw new Error('Could not map customer entity back to domain');
    }
    return domainEntity;
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllCustomersDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<[Customer[], number]> {
    const where: FindOptionsWhere<CustomerEntity> = {};

    if (filterOptions?.firstName) {
      where.firstName = ILike(`%${filterOptions.firstName}%`);
    }
    if (filterOptions?.lastName) {
      where.lastName = ILike(`%${filterOptions.lastName}%`);
    }
    if (filterOptions?.email) {
      where.email = filterOptions.email;
    }
    if (filterOptions?.phoneNumber) {
      where.phoneNumber = filterOptions.phoneNumber;
    }

    const [entities, count] = await this.customerRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['addresses'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });

    const domainEntities = entities
        .map(entity => this.customerMapper.toDomain(entity))
        .filter((item): item is Customer => item !== null);

    return [domainEntities, count];
  }

  async findById(id: Customer['id']): Promise<NullableType<Customer>> {
    const entity = await this.customerRepository.findOne({
      where: { id },
      relations: ['addresses'],
    });
    return entity ? this.customerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Customer['email']): Promise<NullableType<Customer>> {
    if (!email) return null;
    const entity = await this.customerRepository.findOne({
      where: { email },
      relations: ['addresses'],
    });
    return entity ? this.customerMapper.toDomain(entity) : null;
  }

  async findByPhone(
    phone: Customer['phoneNumber'],
  ): Promise<NullableType<Customer>> {
    if (!phone) return null;
    const entity = await this.customerRepository.findOne({
      where: { phoneNumber: phone },
      relations: ['addresses'],
    });
    return entity ? this.customerMapper.toDomain(entity) : null;
  }

  async update(
    id: Customer['id'],
    payload: TypeOrmDeepPartial<Customer>,
  ): Promise<Customer | null> {
    const entity = await this.customerRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    // Note: Using merge and save like this might not update relations correctly.
    // The 'save' method below is generally preferred for handling updates with relations.
    const updatedEntity = await this.customerRepository.save(
      this.customerRepository.merge(
        entity,
        payload as TypeOrmDeepPartial<CustomerEntity>,
      ),
    );
    const completeEntity = await this.customerRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['addresses'],
    });
    if (!completeEntity) {
      throw new Error(
        `Failed to load updated customer with ID ${updatedEntity.id}`,
      );
    }
     const domainEntity = this.customerMapper.toDomain(completeEntity);
     if (!domainEntity) {
       throw new Error('Could not map updated customer entity back to domain');
    }
    return domainEntity;
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = this.customerMapper.toEntity(customer);
     if (!entity) {
       throw new Error('Could not map customer domain to entity for saving');
    }
    const savedEntity = await this.customerRepository.save(entity);
    const completeEntity = await this.customerRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['addresses'],
    });
    if (!completeEntity) {
      throw new Error(
        `Failed to load saved customer with ID ${savedEntity.id}`,
      );
    }
    const domainEntity = this.customerMapper.toDomain(completeEntity);
    if (!domainEntity) {
       throw new Error('Could not map saved customer entity back to domain');
    }
    return domainEntity;
  }

  async remove(id: Customer['id']): Promise<void> {
    const result = await this.customerRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
  }
}
