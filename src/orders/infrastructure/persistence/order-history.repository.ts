// src/orders/infrastructure/persistence/order-history.repository.ts
import { OrderHistoryEntity } from './relational/entities/order-history.entity';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class OrderHistoryRepository {
  // No necesitamos 'create' ya que lo maneja el subscriber directamente con el EntityManager

  /**
   * Busca registros de historial para una orden específica, con paginación.
   * @param orderId - El ID de la orden.
   * @param paginationOptions - Opciones de paginación (page, limit).
   * @returns Una tupla con la lista de registros de historial y el conteo total.
   */
  abstract findByOrderId(
    orderId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<[OrderHistoryEntity[], number]>;
}
