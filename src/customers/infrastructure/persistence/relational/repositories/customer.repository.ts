import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ILike,
  Repository,
  DeepPartial as TypeOrmDeepPartial,
} from 'typeorm'; // Importar y renombrar DeepPartial
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerRepository } from '../../customer.repository';
import { Customer } from '../../../../domain/customer';
import { CustomerMapper } from '../mappers/customer.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';
// Eliminar importación de DeepPartial personalizado
// import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { FindAllCustomersDto } from '../../../../dto/find-all-customers.dto';

@Injectable()
export class CustomerRelationalRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(
    data: Omit<
      Customer,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'addresses'
    >,
  ): Promise<Customer> {
    const persistenceModel = CustomerMapper.toPersistence(data as Customer);
    const newEntity = await this.customerRepository.save(
      this.customerRepository.create(persistenceModel),
    );
    // Recargar para obtener relaciones (aunque no hay directas aquí, es buena práctica)
    const completeEntity = await this.customerRepository.findOne({
      where: { id: newEntity.id },
      relations: ['addresses'], // Cargar direcciones al devolver
    });
    if (!completeEntity) {
      throw new Error(
        `Failed to load created customer with ID ${newEntity.id}`,
      );
    }
    return CustomerMapper.toDomain(completeEntity);
  }

  async findManyWithPagination({
    filterOptions, // Usar filterOptions
    paginationOptions,
  }: {
    filterOptions?: FindAllCustomersDto | null; // Usar el DTO
    paginationOptions: IPaginationOptions;
  }): Promise<[Customer[], number]> {
    const where: FindOptionsWhere<CustomerEntity> = {};

    // Implementar lógica de filtro
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
      relations: ['addresses'], // Cargar direcciones
      order: { lastName: 'ASC', firstName: 'ASC' }, // Ordenar por apellido y nombre
    });

    return [entities.map((entity) => CustomerMapper.toDomain(entity)), count];
  }

  async findById(id: Customer['id']): Promise<NullableType<Customer>> {
    const entity = await this.customerRepository.findOne({
      where: { id },
      relations: ['addresses'], // Cargar direcciones
    });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Customer['email']): Promise<NullableType<Customer>> {
    if (!email) return null;
    const entity = await this.customerRepository.findOne({
      where: { email },
      relations: ['addresses'],
    });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByPhone(
    phone: Customer['phoneNumber'],
  ): Promise<NullableType<Customer>> {
    if (!phone) return null;
    const entity = await this.customerRepository.findOne({
      where: { phoneNumber: phone },
      relations: ['addresses'],
    });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async update(
    id: Customer['id'],
    payload: TypeOrmDeepPartial<Customer>, // Usar TypeOrmDeepPartial
  ): Promise<Customer | null> {
    // El método save maneja la actualización y relaciones, usarlo en su lugar
    // para consistencia con la interfaz y manejo de relaciones.
    // Este método update básico de TypeORM no maneja relaciones fácilmente.
    // Considerar eliminar este método de la interfaz si 'save' es suficiente.
    const entity = await this.customerRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    const updatedEntity = await this.customerRepository.save(
      this.customerRepository.merge(
        entity,
        payload as TypeOrmDeepPartial<CustomerEntity>, // Usar TypeOrmDeepPartial
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
    return CustomerMapper.toDomain(completeEntity);
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toPersistence(customer);
    // Asegurarse de que las direcciones también se mapeen si es necesario gestionarlas aquí
    // (Aunque normalmente se gestionan a través del repositorio de Address)
    const savedEntity = await this.customerRepository.save(entity);
    // Recargar para obtener el estado final con relaciones
    const completeEntity = await this.customerRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['addresses'],
    });
    if (!completeEntity) {
      throw new Error(
        `Failed to load saved customer with ID ${savedEntity.id}`,
      );
    }
    return CustomerMapper.toDomain(completeEntity);
  }

  async remove(id: Customer['id']): Promise<void> {
    const result = await this.customerRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
  }
}
