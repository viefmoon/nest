import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { FindAllCustomersDto } from './dto/find-all-customers.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Customer } from './domain/customer';
import { Address } from './domain/address';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { CrudControllerFactory } from '../common/presentation/crud-controller.factory'; // Importar Factory
import { AddressesService } from './addresses.service'; // Importar AddressesService

// Crear el controlador base usando la factory
const BaseCustomersController = CrudControllerFactory<
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  FindAllCustomersDto, // Usar FindAllCustomersDto como DTO de filtro base
  CustomersService
>({
  path: 'customers', // Ruta base (la factory añade /:id etc.)
  swaggerTag: 'Customers', // Etiqueta para Swagger
  // Roles por defecto de la factory (Admin para CUD) son adecuados aquí
});


@ApiTags('Customers') // Mantener ApiTags aquí o mover a la factory si se prefiere
@Controller() // El path ya está definido en la factory
export class CustomersController extends BaseCustomersController { // Extender el controlador base
  // Inyectar ambos servicios
  constructor(
      protected service: CustomersService, // El servicio principal (requerido por la factory)
      private addressesService: AddressesService // El servicio de direcciones
  ) {
    super(service); // Llamar al constructor base con el servicio principal
  }

  // Los métodos create, findOne, update, remove son heredados de BaseCustomersController

  // Se elimina el endpoint GET /customers con paginación infinita.
  // El endpoint GET / heredado de BaseCustomersController (sin paginación) tomará efecto si se necesita.


  // --- Endpoints específicos para Direcciones ---
  // Mantener estos endpoints ya que no son parte del CRUD básico de Customer

  @Post(':customerId/addresses')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Añadir una dirección a un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiResponse({ status: 201, description: 'Dirección añadida.', type: Address })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  addAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    // Usar this.service (CustomersService) que tiene la lógica para añadir direcciones
    return this.service.addAddressToCustomer(
      customerId,
      createAddressDto,
    );
  }

  @Patch(':customerId/addresses/:addressId')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una dirección específica de un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiParam({ name: 'addressId', description: 'ID de la dirección', type: String })
  @ApiResponse({ status: 200, description: 'Dirección actualizada.', type: Address })
  @ApiResponse({ status: 404, description: 'Cliente o dirección no encontrada.' })
  updateAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    // Usar this.service (CustomersService)
    return this.service.updateCustomerAddress(
      customerId,
      addressId,
      updateAddressDto,
    );
  }

  @Delete(':customerId/addresses/:addressId')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una dirección específica de un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiParam({ name: 'addressId', description: 'ID de la dirección', type: String })
  @ApiResponse({ status: 204, description: 'Dirección eliminada.' })
  @ApiResponse({ status: 404, description: 'Cliente o dirección no encontrada.' })
  removeAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ): Promise<void> {
    // Usar this.service (CustomersService)
    return this.service.removeCustomerAddress(customerId, addressId);
  }

  @Patch(':customerId/addresses/:addressId/set-default')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Establecer una dirección como predeterminada' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiParam({ name: 'addressId', description: 'ID de la dirección', type: String })
  @ApiResponse({ status: 204, description: 'Dirección establecida como predeterminada.' })
  @ApiResponse({ status: 404, description: 'Cliente o dirección no encontrada.' })
  setDefaultAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ): Promise<void> {
    // Usar this.addressesService ya que la lógica se movió allí
    return this.addressesService.setDefaultAddress(customerId, addressId);
  }
}
