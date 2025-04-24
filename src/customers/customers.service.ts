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
import { FindAllCustomersDto } from './dto/find-all-customers.dto'; // Importar DTO de filtro
import { DeepPartial } from '../utils/types/deep-partial.type';
import { ERROR_CODES } from '../common/constants/error-codes.constants';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CustomerRepository) // Inyectar usando el token/clase abstracta
    private readonly customerRepository: CustomerRepository,
    @Inject(AddressRepository) // Inyectar usando el token/clase abstracta
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Validar email único si se proporciona
    if (createCustomerDto.email) {
      const existingByEmail = await this.customerRepository.findByEmail(
        createCustomerDto.email,
      );
      if (existingByEmail) {
        throw new ConflictException({
          code: ERROR_CODES.AUTH_DUPLICATE_EMAIL, // Reutilizar código si aplica
          message: `El correo electrónico '${createCustomerDto.email}' ya está registrado.`,
          details: { field: 'email' },
        });
      }
    }
    // Validar teléfono único si se proporciona
    if (createCustomerDto.phoneNumber) {
      const existingByPhone = await this.customerRepository.findByPhone(
        createCustomerDto.phoneNumber,
      );
      if (existingByPhone) {
        throw new ConflictException({
          code: 'CUSTOMER_DUPLICATE_PHONE', // Código específico
          message: `El número de teléfono '${createCustomerDto.phoneNumber}' ya está registrado.`,
          details: { field: 'phoneNumber' },
        });
      }
    }

    const customer = new Customer();
    customer.firstName = createCustomerDto.firstName;
    customer.lastName = createCustomerDto.lastName;
    customer.phoneNumber = createCustomerDto.phoneNumber ?? null;
    customer.email = createCustomerDto.email ?? null;

    const createdCustomer = await this.customerRepository.create(customer);

    // Crear direcciones si se proporcionan
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
        const newAddress = await this.addAddressToCustomer(
          createdCustomer.id,
          addressDto,
        );
        createdAddresses.push(newAddress);
      }
      createdCustomer.addresses = createdAddresses;
    }

    return createdCustomer; // Devolver el cliente con las direcciones creadas
  }

  async findAll(
    paginationOptions: IPaginationOptions,
    filterOptions?: FindAllCustomersDto, // Añadir filterOptions aquí
  ): Promise<[Customer[], number]> {
    return this.customerRepository.findManyWithPagination({
      paginationOptions,
      filterOptions, // Pasar filterOptions al repositorio
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id); // Asegura que el cliente existe

    // Validar email único si se está cambiando
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingByEmail = await this.customerRepository.findByEmail(
        updateCustomerDto.email,
      );
      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictException({
          code: ERROR_CODES.AUTH_DUPLICATE_EMAIL,
          message: `El correo electrónico '${updateCustomerDto.email}' ya está registrado por otro cliente.`,
          details: { field: 'email' },
        });
      }
      customer.email = updateCustomerDto.email;
    } else if (updateCustomerDto.email === null) {
      customer.email = null;
    }

    // Validar teléfono único si se está cambiando
    if (
      updateCustomerDto.phoneNumber &&
      updateCustomerDto.phoneNumber !== customer.phoneNumber
    ) {
      const existingByPhone = await this.customerRepository.findByPhone(
        updateCustomerDto.phoneNumber,
      );
      if (existingByPhone && existingByPhone.id !== id) {
        throw new ConflictException({
          code: 'CUSTOMER_DUPLICATE_PHONE',
          message: `El número de teléfono '${updateCustomerDto.phoneNumber}' ya está registrado por otro cliente.`,
          details: { field: 'phoneNumber' },
        });
      }
      customer.phoneNumber = updateCustomerDto.phoneNumber;
    } else if (updateCustomerDto.phoneNumber === null) {
      customer.phoneNumber = null;
    }

    // Actualizar otros campos
    customer.firstName = updateCustomerDto.firstName ?? customer.firstName;
    customer.lastName = updateCustomerDto.lastName ?? customer.lastName;

    // --- Sincronización de Direcciones ---
    if (updateCustomerDto.addresses !== undefined) {
      await this.syncAddresses(customer, updateCustomerDto.addresses);
    }
    // --- Fin Sincronización de Direcciones ---

    // Guardar el cliente actualizado (incluyendo potencialmente las relaciones de dirección actualizadas)
    // Usamos 'save' para que TypeORM maneje las relaciones correctamente.
    const updatedCustomer = await this.customerRepository.save(customer);

    // Recargar para asegurar que las direcciones estén actualizadas en el objeto devuelto
    return this.findOne(updatedCustomer.id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Asegura que existe antes de intentar eliminar
    // La eliminación en cascada debería manejar las direcciones si está configurada en la entidad Address
    await this.customerRepository.remove(id);
  }

  // --- Métodos específicos para Direcciones ---

  async addAddressToCustomer(
    customerId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    await this.findOne(customerId); // Verificar que el cliente existe

    if (createAddressDto.isDefault) {
      // Si esta será la predeterminada, quitar la marca de las otras
      await this.unsetDefaultForOtherAddresses(customerId);
    }

    const address = new Address();
    address.id = uuidv4(); // Generar ID para la nueva dirección
    address.customerId = customerId;
    address.street = createAddressDto.street;
    address.number = createAddressDto.number;
    address.interiorNumber = createAddressDto.interiorNumber;
    address.neighborhood = createAddressDto.neighborhood;
    address.city = createAddressDto.city;
    address.state = createAddressDto.state;
    address.zipCode = createAddressDto.zipCode;
    address.country = createAddressDto.country;
    address.references = createAddressDto.references;
    address.isDefault = createAddressDto.isDefault ?? false;

    return this.addressRepository.create(address);
  }

  async updateCustomerAddress(
    customerId: string, // Aunque no se usa directamente, valida pertenencia
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
      // Si se está marcando como predeterminada, quitar la marca de las otras
      await this.unsetDefaultForOtherAddresses(customerId, addressId);
    } else if (updateAddressDto.isDefault === false && address.isDefault) {
      // No permitir desmarcar la única dirección predeterminada si solo hay una o si es la única marcada
      const customerAddresses =
        await this.addressRepository.findByCustomerId(customerId);
      const defaultAddresses = customerAddresses.filter((a) => a.isDefault);
      if (defaultAddresses.length <= 1) {
        throw new BadRequestException(
          'No se puede desmarcar la única dirección predeterminada.',
        );
      }
    }

    // Aplicar actualizaciones parciales
    const updatePayload: DeepPartial<Address> = {};
    if (updateAddressDto.street !== undefined)
      updatePayload.street = updateAddressDto.street;
    if (updateAddressDto.number !== undefined)
      updatePayload.number = updateAddressDto.number;
    if (updateAddressDto.interiorNumber !== undefined)
      updatePayload.interiorNumber = updateAddressDto.interiorNumber;
    if (updateAddressDto.neighborhood !== undefined)
      updatePayload.neighborhood = updateAddressDto.neighborhood;
    if (updateAddressDto.city !== undefined)
      updatePayload.city = updateAddressDto.city;
    if (updateAddressDto.state !== undefined)
      updatePayload.state = updateAddressDto.state;
    if (updateAddressDto.zipCode !== undefined)
      updatePayload.zipCode = updateAddressDto.zipCode;
    if (updateAddressDto.country !== undefined)
      updatePayload.country = updateAddressDto.country;
    if (updateAddressDto.references !== undefined)
      updatePayload.references = updateAddressDto.references;
    if (updateAddressDto.isDefault !== undefined)
      updatePayload.isDefault = updateAddressDto.isDefault;

    const updatedAddress = await this.addressRepository.update(
      addressId,
      updatePayload,
    );
    if (!updatedAddress) {
      throw new NotFoundException( // Asegurarse de que la actualización devolvió algo
        `No se pudo actualizar la dirección con ID ${addressId}.`,
      );
    }
    return updatedAddress;
  }

  async removeCustomerAddress(
    customerId: string, // Validar pertenencia
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
    await this.addressRepository.remove(addressId);
  }

  async setDefaultAddress(
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
      return; // Ya es la predeterminada
    }

    await this.unsetDefaultForOtherAddresses(customerId, addressId);
    await this.addressRepository.update(addressId, { isDefault: true });
  }

  private async unsetDefaultForOtherAddresses(
    customerId: string,
    excludeAddressId?: string,
  ): Promise<void> {
    const currentAddresses =
      await this.addressRepository.findByCustomerId(customerId);
    for (const addr of currentAddresses) {
      if (addr.isDefault && addr.id !== excludeAddressId) {
        await this.addressRepository.update(addr.id, { isDefault: false });
      }
    }
  }

  private async syncAddresses(
    customer: Customer,
    incomingAddressesData: UpdateAddressDto[],
  ): Promise<void> {
    const currentAddresses = await this.addressRepository.findByCustomerId(
      customer.id,
    );
    const currentAddressIds = currentAddresses.map((a) => a.id);
    const incomingAddressIds = new Set(
      incomingAddressesData.filter((dto) => dto.id).map((dto) => dto.id),
    );

    let hasDefault = false;
    const addressesToProcess = incomingAddressesData.map((dto) => {
      if (dto.isDefault) {
        if (hasDefault)
          throw new BadRequestException(
            'Solo puede haber una dirección predeterminada.',
          );
        hasDefault = true;
      }
      return { ...dto, customerId: customer.id }; // Asegurar que customerId esté presente
    });

    // Si no hay ninguna dirección marcada como predeterminada en la entrada,
    // y hay direcciones, marcar la primera como predeterminada si no hay ya una.
    if (!hasDefault && addressesToProcess.length > 0) {
      const existingDefault = currentAddresses.find(
        (a) => a.isDefault && incomingAddressIds.has(a.id),
      );
      if (!existingDefault) {
        addressesToProcess[0].isDefault = true;
        hasDefault = true; // Marcar que ya tenemos una default
      } else {
        hasDefault = true; // Ya existe una default que se mantiene
      }
    } else if (addressesToProcess.length === 0 && currentAddresses.length > 0) {
      // Si se eliminan todas las direcciones, no hacemos nada aquí respecto a isDefault
    } else if (
      !hasDefault &&
      addressesToProcess.length === 0 &&
      currentAddresses.length === 0
    ) {
      // No hay direcciones nuevas ni existentes, no hay default
    }

    // 1. Actualizar o Crear direcciones entrantes
    const processedAddresses: Address[] = [];
    for (const addressDto of addressesToProcess) {
      let processedAddress: Address | null = null;
      if (addressDto.id) {
        // Actualizar dirección existente
        if (currentAddressIds.includes(addressDto.id)) {
          processedAddress = await this.updateCustomerAddress(
            customer.id,
            addressDto.id,
            addressDto,
          );
        } else {
          console.warn(
            `Address with ID ${addressDto.id} provided for update but does not belong to customer ${customer.id}. Skipping.`,
          );
        }
      } else {
        // Crear nueva dirección
        processedAddress = await this.addAddressToCustomer(
          customer.id,
          addressDto as CreateAddressDto,
        ); // Castear si es necesario
      }
      if (processedAddress) {
        processedAddresses.push(processedAddress);
      }
    }

    // 2. Eliminar direcciones antiguas no incluidas en la petición
    const addressIdsToDelete = currentAddressIds.filter(
      (id) => !incomingAddressIds.has(id),
    );
    if (addressIdsToDelete.length > 0) {
      // Verificar que no se esté eliminando la predeterminada si es la única
      const defaultAddress = currentAddresses.find((a) => a.isDefault);
      if (
        defaultAddress &&
        addressIdsToDelete.includes(defaultAddress.id) &&
        processedAddresses.filter((a) => a.isDefault).length === 0
      ) {
        // Si se intenta eliminar la única default y no se asigna una nueva, lanzar error o reasignar.
        // Por ahora, lanzaremos un error para simplicidad.
        throw new BadRequestException(
          'No se puede eliminar la única dirección predeterminada sin asignar una nueva.',
        );
      }
      await this.addressRepository.removeMany(addressIdsToDelete);
    }

    // Actualizar la relación en el objeto customer (opcional, 'save' debería manejarlo)
    customer.addresses = processedAddresses;
  }
}
