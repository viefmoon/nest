import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Order } from '../../domain/order';
import { FindAllOrdersDto } from '../../dto/find-all-orders.dto';

export abstract class OrderRepository {
  abstract create(data: {
    userId: string;
    tableId: string | null;
    scheduledAt?: Date | null;
    orderStatus: string;
    orderType: string;
    subtotal: number;
    total: number;
    notes?: string;
  }): Promise<Order>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FindAllOrdersDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Order[]>;

  abstract findById(id: Order['id']): Promise<NullableType<Order>>;
  abstract findByUserId(userId: Order['userId']): Promise<Order[]>;
  abstract findByTableId(tableId: Order['tableId']): Promise<Order[]>;
  abstract findByDailyOrderCounterId(
    dailyOrderCounterId: Order['dailyOrderCounterId'],
  ): Promise<Order[]>;
  abstract findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;

  abstract update(
    id: Order['id'],
    payload: DeepPartial<Order>,
  ): Promise<Order | null>;

  abstract remove(id: Order['id']): Promise<void>;
}
