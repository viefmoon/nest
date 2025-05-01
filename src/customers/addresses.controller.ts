import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudControllerFactory } from '../common/presentation/crud-controller.factory';
import { Address } from './domain/address';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { FindAllAddressesDto } from './dto/find-all-addresses.dto';
import { AddressesService } from './addresses.service';
import { RoleEnum } from '../roles/roles.enum';

// Eliminar el tipo placeholder

// Crear el controlador base usando la factory
const BaseAddressesController = CrudControllerFactory<
  Address,
  CreateAddressDto,
  UpdateAddressDto,
  FindAllAddressesDto, // Usar el DTO de filtro real
  AddressesService
>({
  // Ruta anidada bajo customers
  path: 'customers/:customerId/addresses',
  swaggerTag: 'Customer Addresses', // Etiqueta específica para Swagger
  // Ajustar roles si es necesario (por defecto Admin para CUD)
  // createRoles: [RoleEnum.admin],
  // updateRoles: [RoleEnum.admin],
  // removeRoles: [RoleEnum.admin],
});

@ApiTags('Customer Addresses') // Mantener ApiTags
@Controller() // El path ya está definido en la factory
export class AddressesController extends BaseAddressesController {
  // El constructor con la inyección del servicio es manejado por la factory y la herencia.
  // No se necesita constructor aquí a menos que se añadan otras dependencias o lógica.

  // Los endpoints CRUD básicos (POST /, GET /, GET /:id, PATCH /:id, DELETE /:id)
  // para la ruta 'customers/:customerId/addresses' son heredados.
  // La factory NO maneja automáticamente la relación con 'customerId'.
  // Necesitaríamos sobrescribir los métodos para asegurar que las operaciones
  // se realicen en el contexto del customerId correcto.

  // TODO: Sobrescribir métodos CRUD para inyectar/validar customerId.
  // Por ahora, la factory crea los endpoints, pero podrían no funcionar
  // correctamente sin la lógica de customerId. Esto se abordará si es necesario
  // o si la lógica se maneja completamente dentro del AddressesService.
}