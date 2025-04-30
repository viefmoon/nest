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

@ApiTags('Customers')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // Asumiendo que solo admin puede crear clientes directamente
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado.', type: Customer })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // Asumiendo que solo admin puede listar todos los clientes
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener lista paginada de clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes.',
    type: InfinityPaginationResponse(Customer),
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query() filterDto: FindAllCustomersDto,
  ): Promise<InfinityPaginationResponseDto<Customer>> {
    limit = limit > 50 ? 50 : limit;
    const [data] = await this.customersService.findAll(
      { page, limit },
      filterDto,
    );
    return infinityPagination(data, { page, limit });
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // Asumiendo que solo admin puede ver cualquier cliente por ID
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado.',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // Asumiendo que solo admin puede actualizar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un cliente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado.',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // Asumiendo que solo admin puede eliminar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente por ID' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customersService.remove(id);
  }

  @Post(':customerId/addresses')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // O ajustar si los usuarios pueden añadir sus propias direcciones
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Añadir una dirección a un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiResponse({
    status: 201,
    description: 'Dirección añadida.',
    type: Address,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  addAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.customersService.addAddressToCustomer(
      customerId,
      createAddressDto,
    );
  }

  @Patch(':customerId/addresses/:addressId')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // O ajustar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar una dirección específica de un cliente',
  })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiParam({
    name: 'addressId',
    description: 'ID de la dirección',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Dirección actualizada.',
    type: Address,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente o dirección no encontrada.',
  })
  updateAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.customersService.updateCustomerAddress(
      customerId,
      addressId,
      updateAddressDto,
    );
  }

  @Delete(':customerId/addresses/:addressId')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // O ajustar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una dirección específica de un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiParam({
    name: 'addressId',
    description: 'ID de la dirección',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Dirección eliminada.' })
  @ApiResponse({
    status: 404,
    description: 'Cliente o dirección no encontrada.',
  })
  removeAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ): Promise<void> {
    return this.customersService.removeCustomerAddress(customerId, addressId);
  }

  @Patch(':customerId/addresses/:addressId/set-default')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin) // O ajustar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Establecer una dirección como predeterminada' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente', type: String })
  @ApiParam({
    name: 'addressId',
    description: 'ID de la dirección',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Dirección establecida como predeterminada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente o dirección no encontrada.',
  })
  setDefaultAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ): Promise<void> {
    return this.customersService.setDefaultAddress(customerId, addressId);
  }
}
