// src/orders/orders.controller.ts
import {
  DefaultValuePipe, // Añadir DefaultValuePipe
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe, // Mantener ParseUUIDPipe
  ParseIntPipe, // Añadir ParseIntPipe
  HttpCode, // Añadir HttpCode
  HttpStatus, // Añadir HttpStatus
  UseGuards, // Asegurar que UseGuards esté importado
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { Order } from './domain/order';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './domain/order-item';
import { OrderItemModifier } from './domain/order-item-modifier';
import { UpdateOrderItemModifierDto } from './dto/update-order-item-modifier.dto';
import { OrderItemModifierDto } from './dto/order-item-modifier.dto';
import {
  ApiBearerAuth, // Añadir ApiBearerAuth
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Añadir AuthGuard
import { RolesGuard } from '../roles/roles.guard'; // Añadir RolesGuard
import { Roles } from '../roles/roles.decorator'; // Añadir Roles
import { RoleEnum } from '../roles/roles.enum'; // Añadir RoleEnum
import {
  OrderChangeLogService,
  EnrichedOrderHistoryDto,
} from './order-change-log.service'; // Importar servicio y DTO
import {
  OrderItemChangeLogService,
  EnrichedOrderItemHistoryDto,
} from './order-item-change-log.service'; // Importar servicio y DTO
import {
  InfinityPaginationResponseDto,
  InfinityPaginationResponse,
} from '../utils/dto/infinity-pagination-response.dto'; // Importar paginación
import { infinityPagination } from '../utils/infinity-pagination'; // Importar helper

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderChangeLogService: OrderChangeLogService, // Inyectar servicio de historial de orden
    private readonly orderItemChangeLogService: OrderItemChangeLogService, // Inyectar servicio de historial de item
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: Order,
  })
  @ApiBearerAuth() // Asumiendo que crear órdenes requiere autenticación
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Asumiendo guardias estándar
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles según sea necesario
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders that match the filters.',
    type: InfinityPaginationResponse(Order), // Usar DTO de paginación
  })
  @ApiBearerAuth() // Asumiendo que listar órdenes requiere autenticación
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  async findAll(
    @Query() filterOptions: FindAllOrdersDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResponseDto<Order>> {
    const paginationOptions: IPaginationOptions = {
      page,
      limit: limit > 50 ? 50 : limit, // Limitar el máximo de resultados
    };
    //findAll ahora devuelve [data, totalCount]
    const [data] = await this.ordersService.findAll(
      filterOptions,
      paginationOptions,
    ); // Solo necesitamos data aquí
    //Llamar a infinityPagination solo con data y options
    return infinityPagination(data, paginationOptions); // Devolver respuesta paginada
  }

  @Get('open-today') // Nueva ruta
  @ApiOperation({ summary: 'Obtener las órdenes abiertas del día actual' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes abiertas del día actual.',
    type: [Order], // Devuelve un array de órdenes
  })
  @ApiBearerAuth() // Asumiendo que se requiere autenticación
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles según sea necesario
  @HttpCode(HttpStatus.OK)
  findOpenOrders(): Promise<Order[]> {
    return this.ordersService.findOpenOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order with the specified ID.',
    type: Order,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: Order,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles si solo admin puede actualizar
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific order by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT, // Cambiado a 204 No Content
    description: 'The order has been successfully deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT) // Añadir HttpCode
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin) // Asumiendo que solo admin puede eliminar
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ordersService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all orders for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders for the specified user.',
    type: [Order],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Permitir al propio usuario o admin ver sus órdenes
  findByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Order[]> {
    return this.ordersService.findByUserId(userId);
  }

  @Get('table/:tableId')
  @ApiOperation({ summary: 'Get all orders for a specific table' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders for the specified table.',
    type: [Order],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  findByTableId(
    @Param('tableId', ParseUUIDPipe) tableId: string,
  ): Promise<Order[]> {
    return this.ordersService.findByTableId(tableId);
  }

  @Get('counter/:counterId')
  @ApiOperation({ summary: 'Get all orders for a specific daily counter' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders for the specified daily counter.',
    type: [Order],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin) // Probablemente solo admin necesita esto
  findByDailyOrderCounterId(
    @Param('counterId', ParseUUIDPipe) counterId: string,
  ): Promise<Order[]> {
    return this.ordersService.findByDailyOrderCounterId(counterId);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get all orders within a date range' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders within the specified date range.',
    type: [Order],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin) // Probablemente solo admin necesita esto
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Order[]> {
    return this.ordersService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }
  // OrderItem endpoints
  @Post(':orderId/items')
  @ApiOperation({ summary: 'Create a new order item for an order' })
  @ApiResponse({
    status: 201,
    description: 'The order item has been successfully created.',
    type: OrderItem,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  createOrderItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    createOrderItemDto.orderId = orderId;
    return this.ordersService.createOrderItem(createOrderItemDto);
  }

  @Get(':orderId/items')
  @ApiOperation({ summary: 'Get all order items for a specific order' })
  @ApiResponse({
    status: 200,
    description: 'Return all order items for the specified order.',
    type: [OrderItem],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  findOrderItemsByOrderId(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderItem[]> {
    return this.ordersService.findOrderItemsByOrderId(orderId);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get a specific order item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order item with the specified ID.',
    type: OrderItem,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  findOrderItemById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderItem> {
    return this.ordersService.findOrderItemById(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a specific order item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order item has been successfully updated.',
    type: OrderItem,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  updateOrderItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.ordersService.updateOrderItem(id, updateOrderItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a specific order item by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT, // Cambiado a 204 No Content
    description: 'The order item has been successfully deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT) // Añadir HttpCode
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  removeOrderItem(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ordersService.deleteOrderItem(id);
  }
  // OrderItemModifier endpoints
  @Post('items/:orderItemId/modifiers')
  @ApiOperation({ summary: 'Create a new modifier for an order item' })
  @ApiResponse({
    status: 201,
    description: 'The order item modifier has been successfully created.',
    type: OrderItemModifier,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  createOrderItemModifier(
    @Param('orderItemId', ParseUUIDPipe) orderItemId: string,
    @Body() orderItemModifierDto: OrderItemModifierDto,
  ): Promise<OrderItemModifier> {
    return this.ordersService.createOrderItemModifier(
      orderItemId,
      orderItemModifierDto.modifierId,
      orderItemModifierDto.modifierOptionId,
      orderItemModifierDto.quantity,
      orderItemModifierDto.price,
    );
  }

  @Get('items/:orderItemId/modifiers')
  @ApiOperation({ summary: 'Get all modifiers for a specific order item' })
  @ApiResponse({
    status: 200,
    description: 'Return all modifiers for the specified order item.',
    type: [OrderItemModifier],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  findOrderItemModifiersByOrderItemId(
    @Param('orderItemId', ParseUUIDPipe) orderItemId: string,
  ): Promise<OrderItemModifier[]> {
    return this.ordersService.findOrderItemModifiersByOrderItemId(orderItemId);
  }

  @Get('items/modifiers/:id')
  @ApiOperation({ summary: 'Get a specific order item modifier by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order item modifier with the specified ID.',
    type: OrderItemModifier,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  findOrderItemModifierById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderItemModifier> {
    return this.ordersService.findOrderItemModifierById(id);
  }

  @Patch('items/modifiers/:id')
  @ApiOperation({ summary: 'Update a specific order item modifier by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order item modifier has been successfully updated.',
    type: OrderItemModifier,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  updateOrderItemModifier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderItemModifierDto: UpdateOrderItemModifierDto,
  ): Promise<OrderItemModifier> {
    return this.ordersService.updateOrderItemModifier(
      id,
      updateOrderItemModifierDto,
    );
  }

  @Delete('items/modifiers/:id')
  @ApiOperation({ summary: 'Delete a specific order item modifier by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT, // Cambiado a 204 No Content
    description: 'The order item modifier has been successfully deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT) // Añadir HttpCode
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user) // Ajustar roles
  removeOrderItemModifier(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.ordersService.deleteOrderItemModifier(id);
  }

  // --- Historial Endpoints ---

  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get history for a specific order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the history log for the specified order.',
    type: InfinityPaginationResponse(EnrichedOrderHistoryDto),
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  async getOrderHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResponseDto<EnrichedOrderHistoryDto>> {
    const paginationOptions: IPaginationOptions = {
      page,
      limit: limit > 50 ? 50 : limit,
    };
    const [data] = await this.orderChangeLogService.findByOrderId(
      id,
      paginationOptions,
    );
    // Llamar a infinityPagination solo con data y options
    return infinityPagination(data, paginationOptions);
  }

  @Get('items/:id/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get history for a specific order item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the history log for the specified order item.',
    type: InfinityPaginationResponse(EnrichedOrderItemHistoryDto),
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  async getOrderItemHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResponseDto<EnrichedOrderItemHistoryDto>> {
    const paginationOptions: IPaginationOptions = {
      page,
      limit: limit > 50 ? 50 : limit,
    };
    const [data] = await this.orderItemChangeLogService.findByOrderItemId(
      id,
      paginationOptions,
    );
    // Llamar a infinityPagination solo con data y options
    return infinityPagination(data, paginationOptions);
  }
}
