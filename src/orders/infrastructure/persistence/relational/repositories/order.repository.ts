import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfDay, endOfDay } from 'date-fns'; // Importar desde date-fns
import { toZonedTime } from 'date-fns-tz';
import { Between, FindOptionsWhere, Repository } from 'typeorm'; // Importar Not e In
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Order } from '../../../../domain/order';
import { FindAllOrdersDto } from '../../../../dto/find-all-orders.dto';
import { OrderRepository } from '../../order.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { DailyOrderCounterRepository } from '../../daily-order-counter.repository';
import { OrderStatus } from '../../../../domain/enums/order-status.enum'; // Importar OrderStatus

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
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ],
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
  }): Promise<[Order[], number]> {
    // Cambiado el tipo de retorno
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

    // Usar findAndCount en lugar de find
    const [entities, count] = await this.ordersRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ], 
      order: {
        createdAt: 'DESC',
      },
    });

    // Devolver la tupla [datos, conteo]
    return [entities.map((order) => OrderMapper.toDomain(order)), count];
  }

  async findById(id: Order['id']): Promise<NullableType<Order>> {
    const entity = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.product', // Añadir relación anidada para cargar el producto
        'orderItems.productVariant', // Añadir relación anidada para cargar la variante
        'orderItems.modifiers',
        'payments',
      ],
    });

    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: Order['userId']): Promise<Order[]> {
    const entities = await this.ordersRepository.find({
      where: { userId },
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ],
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
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ],
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
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ],
      order: {
        dailyNumber: 'ASC',
      },
    });

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  // Implementación del nuevo método
  async findOpenOrdersByDate(date: Date): Promise<Order[]> {
    const timeZone = 'America/Mexico_City'; // TODO: Considerar obtener de ConfigService

    // 1) Llevamos la fecha al “día local” (por si date trae hora distinta):
    // 1) Llevamos la fecha al “día local” (por si date trae hora distinta):
    const localDate = toZonedTime(date, timeZone); // Usar toZonedTime

    // 2) Calculamos el inicio y fin de ese día *en hora local*:
    const startLocal = startOfDay(localDate); // startOfDay de date-fns
    const endLocal = endOfDay(localDate); // endOfDay de date-fns

    // 3) Convertimos esos instantes al equivalente UTC:
    // Los objetos Date startLocal y endLocal ya representan el instante UTC correcto
    // correspondiente al inicio/fin del día en la zona horaria.
    const startUtc = startLocal; // Ya es el instante UTC correcto
    const endUtc = endLocal; // Ya es el instante UTC correcto

    // 4) Hacemos la consulta sobre createdAt (almacenado en UTC)
    // 4) Hacemos la consulta sobre createdAt (almacenado en UTC)
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.modifiers', 'modifiers')
      .leftJoinAndSelect('order.payments', 'payments')
      // Filtrar por rango de fecha UTC y estado (usando >= y < en lugar de BETWEEN)
      .where('order.createdAt >= :start', { start: startUtc })
      .andWhere('order.createdAt < :end', { end: endUtc }) // Usar '<' para el final del día
      .andWhere('order.orderStatus NOT IN (:...excludedStatuses)', {
        excludedStatuses: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      })
      // Ordenar
      .orderBy('order.dailyNumber', 'ASC');

    const entities = await queryBuilder.getMany();

    return entities.map((order) => OrderMapper.toDomain(order));
  }

  async update(id: Order['id'], payload: Partial<Order>): Promise<Order> {
    const entity = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ],
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
      relations: [
        'user',
        'table',
        'dailyOrderCounter',
        'orderItems',
        'orderItems.modifiers',
        'payments',
      ],
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
