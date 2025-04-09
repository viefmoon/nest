import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Order } from '../../../../domain/order';
import { FindAllOrdersDto } from '../../../../dto/find-all-orders.dto';
import { OrderRepository } from '../../order.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { DailyOrderCounterRepository } from '../../daily-order-counter.repository';

@Injectable()
export class OrdersRelationalRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @Inject('DailyOrderCounterRepository')
    private readonly dailyOrderCounterRepository: DailyOrderCounterRepository,
  ) {}

  async create(
    data: Omit<
      Order,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'dailyNumber'
    >,
  ): Promise<Order> {
    // Obtener o crear el contador diario para la fecha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counter =
      await this.dailyOrderCounterRepository.findOrCreateByDate(today);

    // Incrementar el contador
    const updatedCounter =
      await this.dailyOrderCounterRepository.incrementCounter(counter.id);

    // Crear la orden con el número diario asignado
    const orderToCreate = {
      ...data,
      dailyNumber: updatedCounter.currentNumber,
      dailyOrderCounterId: updatedCounter.id,
    };

    const persistenceModel = OrderMapper.toPersistence(orderToCreate as Order);
    const newEntity = await this.ordersRepository.save(
      this.ordersRepository.create(persistenceModel),
    );

    // Cargar la entidad completa con todas las relaciones
    const completeEntity = await this.ordersRepository.findOne({
      where: { id: newEntity.id },
      relations: ['user', 'table', 'dailyOrderCounter'],
    });

    if (!completeEntity) {
      throw new Error(
        `No se pudo cargar la orden creada con ID ${newEntity.id}`,
      );
    }

    return OrderMapper.toDomain(completeEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllOrdersDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Order[]> {
    const where: FindOptionsWhere<OrderEntity> = {};

    if (filterOptions?.userId) {
      where.userId = filterOptions.userId;
    }

    if (filterOptions?.tableId) {
      where.tableId = filterOptions.tableId;
    }

    if (filterOptions?.dailyOrderCounterId) {
      where.dailyOrderCounterId = filterOptions.dailyOrderCounterId;
    }

    if (filterOptions?.orderStatus) {
      where.orderStatus = filterOptions.orderStatus;
    }

    if (filterOptions?.orderType) {
      where.orderType = filterOptions.orderType;
    }

    // Manejar filtros de rango de fechas
    if (filterOptions?.startDate && filterOptions?.endDate) {
      const startDate = new Date(filterOptions.startDate);
      const endDate = new Date(filterOptions.endDate);
      where.createdAt = Between(startDate, endDate);
    } else if (filterOptions?.startDate) {
      const startDate = new Date(filterOptions.startDate);
      where.createdAt = Between(startDate, new Date());
    } else if (filterOptions?.endDate) {
      const endDate = new Date(filterOptions.endDate);
      const startDate = new Date(0); // Fecha mínima
      where.createdAt = Between(startDate, endDate);
    }

    const entities = await this.ordersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['user', 'table', 'dailyOrderCounter'],
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  async findById(id: Order['id']): Promise<NullableType<Order>> {
    const entity = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'table', 'dailyOrderCounter'],
    });

    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: Order['userId']): Promise<Order[]> {
    const entities = await this.ordersRepository.find({
      where: { userId },
      relations: ['user', 'table', 'dailyOrderCounter'],
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  async findByTableId(tableId: Order['tableId']): Promise<Order[]> {
    if (tableId === null) {
      return [];
    }

    const entities = await this.ordersRepository.find({
      where: { tableId },
      relations: ['user', 'table', 'dailyOrderCounter'],
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  async findByDailyOrderCounterId(
    dailyOrderCounterId: Order['dailyOrderCounterId'],
  ): Promise<Order[]> {
    const entities = await this.ordersRepository.find({
      where: { dailyOrderCounterId },
      relations: ['user', 'table', 'dailyOrderCounter'],
      order: {
        dailyNumber: 'ASC',
      },
    });

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const entities = await this.ordersRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['user', 'table', 'dailyOrderCounter'],
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  async update(id: Order['id'], payload: Partial<Order>): Promise<Order> {
    const entity = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'table', 'dailyOrderCounter'],
    });

    if (!entity) {
      throw new Error('Order not found');
    }

    // Proteger los campos relacionados con el contador diario
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dailyNumber, dailyOrderCounterId, ...updateData } = payload;

    const updatedEntity = await this.ordersRepository.save(
      this.ordersRepository.create({
        ...OrderMapper.toPersistence({
          ...OrderMapper.toDomain(entity),
          ...updateData,
        }),
      }),
    );

    // Cargar la entidad actualizada con todas las relaciones
    const completeEntity = await this.ordersRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['user', 'table', 'dailyOrderCounter'],
    });

    if (!completeEntity) {
      throw new Error(
        `No se pudo cargar la orden actualizada con ID ${updatedEntity.id}`,
      );
    }

    return OrderMapper.toDomain(completeEntity);
  }

  async remove(id: Order['id']): Promise<void> {
    await this.ordersRepository.softDelete(id);
  }
}
