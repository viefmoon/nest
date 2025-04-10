import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: Order,
  })
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders that match the filters.',
    type: [Order],
  })
  findAll(
    @Query() filterOptions: FindAllOrdersDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Order[]> {
    const paginationOptions: IPaginationOptions = {
      page: +page,
      limit: +limit,
    };
    return this.ordersService.findAll(filterOptions, paginationOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order with the specified ID.',
    type: Order,
  })
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific order by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
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
  createOrderItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    // Asegurarse de que el orderId en el DTO coincida con el de la URL
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
  updateOrderItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.ordersService.updateOrderItem(id, updateOrderItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a specific order item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The order item has been successfully deleted.',
  })
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
    status: 200,
    description: 'The order item modifier has been successfully deleted.',
  })
  removeOrderItemModifier(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.ordersService.deleteOrderItemModifier(id);
  }
}
