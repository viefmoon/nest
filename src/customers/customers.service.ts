import { Transactional } from 'typeorm-transactional-cls-hooked'; // Importar Transactional
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepository } from './infrastructure/persistence/customer.repository';
import { AddressRepository } from './infrastructure/persistence/address.repository';
import { Customer } from './domain/customer';
import { Address } from './domain/address';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FindAllCustomersDto } from './dto/find-all-customers.dto';
import { DeepPartial } from '../utils/types/deep-partial.type'; // Mantener si se usa en métodos específicos
import { ERROR_CODES } from '../common/constants/error-codes.constants';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { v4 as uuidv4 } from 'uuid';
import { ADDRESS_REPOSITORY, CUSTOMER_REPOSITORY } from '../common/tokens';
import { BaseCrudService } from '../common/application/base-crud.service'; // Importar BaseCrudService

@Injectable()
export class CustomersService extends BaseCrudService< // Extender BaseCrudService
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  FindAllCustomersDto // Usar FindAllCustomersDto como filtro base
> {
  constructor(
    // Inyectar solo el repositorio principal (CustomerRepository)
    @Inject(CUSTOMER_REPOSITORY)
    protected readonly repo: CustomerRepository, // Cambiar nombre a 'repo' como en BaseCrudService
    // Inyectar AddressRepository por separado para la lógica específica de direcciones
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: AddressRepository,
    // Inyectar AddressesService para usar su lógica específica
    private readonly addressesService: AddressesService,
  ) {
    super(repo); // Pasar el repositorio principal al constructor base
  }

  // Sobrescribir 'create' para añadir lógica de validación y creación de direcciones
  @Transactional() // Añadir decorador para transacción
  override async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Se eliminan las validaciones preventivas de email y teléfono.
    // La base de datos y el UniqueViolationFilter se encargarán de la unicidad.

    // Llamar al 'create' base para crear el cliente sin direcciones inicialmente
    // Nota: El 'create' base espera un DTO que coincida con CreateCustomerDto.
    // Si CreateCustomerDto incluye 'addresses', necesitamos pasarlo sin él o ajustar el repo base.
    // Asumiendo que el repo.create ignora 'addresses' o maneja un DTO sin él.
    // O, creamos el objeto Customer manualmente como antes y usamos repo.save si es necesario.
    // Vamos a mantener la creación manual por ahora para asegurar el flujo con direcciones.

    // El método repo.create espera un CreateCustomerDto.
    // Pasamos directamente el DTO completo.
    const createdCustomer = await this.repo.create(createCustomerDto);


    // Crear direcciones si se proporcionan (usando la lógica existente)
    if (createCustomerDto.addresses && createCustomerDto.addresses.length > 0) {
      const createdAddresses: Address[] = [];
      let hasDefault = false;
      for (const addressDto of createCustomerDto.addresses) {
        if (addressDto.isDefault) {
          if (hasDefault) {
            throw new BadRequestException(
              'Solo puede haber una dirección predeterminada.',
            );
          }
          hasDefault = true;
        }
        // Usar el método específico addAddressToCustomer
        const newAddress = await this.addAddressToCustomer(
          createdCustomer.id,
          addressDto,
        );
        createdAddresses.push(newAddress);
      }
      // Recargar el cliente para obtener las direcciones asociadas
       return this.findOne(createdCustomer.id); // findOne ya está heredado
    }

    return createdCustomer; // Devolver cliente sin direcciones si no se proporcionaron
  }

  // Se elimina findAll con paginación. El findAll heredado de BaseCrudService no tiene paginación.

  // findOne es heredado de BaseCrudService

  // Sobrescribir 'update' para añadir lógica de validación y sincronización de direcciones
  override async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    // findOne es heredado, lo usamos para obtener y validar la existencia del cliente
    const customer = await this.findOne(id);

    // Se eliminan las validaciones preventivas de email y teléfono para la actualización.
    // La base de datos y el UniqueViolationFilter se encargarán de la unicidad.

    // Preparar payload para el update base (solo campos del cliente)
    const customerUpdatePayload: UpdateCustomerDto = {
        firstName: updateCustomerDto.firstName,
        lastName: updateCustomerDto.lastName,
        phoneNumber: updateCustomerDto.phoneNumber,
        email: updateCustomerDto.email,
        // Excluir 'addresses' del payload para el update base
    };


    // Llamar al update base para actualizar los campos del cliente
    // Nota: El update base podría devolver null si no encuentra la entidad, pero findOne ya lo valida.
    await super.update(id, customerUpdatePayload); // Llamar al update de BaseCrudService


    // Se elimina la lógica de sincronización de direcciones (if block y syncAddresses call)
    // ya que UpdateCustomerDto no incluye 'addresses'.
    // El super.update ya guardó los campos básicos del cliente.


    // Recargar y devolver el cliente actualizado completo (con sus direcciones existentes si las tuviera)
    return this.findOne(id);
  }

  // remove es heredado de BaseCrudService

  // --- Métodos específicos para Direcciones (mantenerlos) ---

  async addAddressToCustomer(
    customerId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    await this.findOne(customerId); // Verificar que el cliente existe (findOne heredado)

    if (createAddressDto.isDefault) {
      // Usar addressesService para quitar la marca default de otras direcciones
      await this.addressesService.unsetDefaultForOtherAddresses(customerId);
    }

    // El repositorio espera un CreateAddressDto.
    // Pasamos el DTO directamente, asegurándonos de que los tipos coincidan.
    // No necesitamos construir el objeto Address manualmente aquí.
    // El addressRepository.create debería devolver el objeto Address creado.

    // Usar el repositorio de direcciones directamente con el DTO
    // Nota: Asumimos que addressRepository.create internamente asigna el customerId
    // o que se modifica el DTO antes de llamar a create si es necesario.
    // Por simplicidad y siguiendo el patrón BaseRepository, pasamos el DTO original.
    // Si la creación falla por falta de customerId, habría que ajustar aquí o en el repo.
    return this.addressRepository.create(createAddressDto);
  }

  async updateCustomerAddress(
    customerId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.addressRepository.findById(addressId);
    if (!address || address.customerId !== customerId) {
      throw new NotFoundException(
        `Dirección con ID ${addressId} no encontrada o no pertenece al cliente ${customerId}.`,
      );
    }

    if (updateAddressDto.isDefault && !address.isDefault) {
      // Usar addressesService para quitar la marca default de otras direcciones
      await this.addressesService.unsetDefaultForOtherAddresses(customerId, addressId);
    } else if (updateAddressDto.isDefault === false && address.isDefault) {
      const customerAddresses =
        await this.addressRepository.findByCustomerId(customerId); // Necesitamos addressRepository aquí aún
      const defaultAddresses = customerAddresses.filter((a) => a.isDefault);
      if (defaultAddresses.length <= 1) {
        throw new BadRequestException(
          'No se puede desmarcar la única dirección predeterminada.',
        );
      }
    }

    // El método update del repositorio base espera un UpdateAddressDto.
    // Pasamos directamente el updateAddressDto, excluyendo el 'id' si existe.
    const { id: dtoId, ...updateData } = updateAddressDto;

    // Usar el repositorio de direcciones directamente con el DTO ajustado
    const updatedAddress = await this.addressRepository.update(
      addressId,
      updateData,
    );
    if (!updatedAddress) {
      // El update base podría devolver null, manejarlo aquí o asegurar que findOne lo haga
       throw new NotFoundException(
         `No se pudo actualizar la dirección con ID ${addressId}.`,
       );
    }
    return updatedAddress;
  }

  async removeCustomerAddress(
    customerId: string,
    addressId: string,
  ): Promise<void> {
    const address = await this.addressRepository.findById(addressId);
    if (!address || address.customerId !== customerId) {
      throw new NotFoundException(
        `Dirección con ID ${addressId} no encontrada o no pertenece al cliente ${customerId}.`,
      );
    }
    if (address.isDefault) {
      throw new BadRequestException(
        'No se puede eliminar la dirección predeterminada.',
      );
    }
    // Usar el repositorio de direcciones directamente
    await this.addressRepository.remove(addressId);
  }

  // Se elimina el método syncAddresses
}
