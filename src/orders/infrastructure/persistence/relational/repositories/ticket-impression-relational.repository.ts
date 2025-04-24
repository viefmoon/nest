import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { TicketImpression } from '../../../../domain/ticket-impression';
import { TicketImpressionRepository } from '../../ticket-impression.repository';
import { TicketImpressionEntity } from '../entities/ticket-impression.entity';
import { TicketImpressionMapper } from '../mappers/ticket-impression.mapper';
import { TicketType } from '../../../../domain/enums/ticket-type.enum'; // Importar TicketType

@Injectable()
export class TicketImpressionRelationalRepository
  implements TicketImpressionRepository
{
  constructor(
    @InjectRepository(TicketImpressionEntity)
    private readonly repository: Repository<TicketImpressionEntity>,
  ) {}

  async create(
    data: Omit<
      TicketImpression,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'order' | 'user'
    >,
  ): Promise<TicketImpression> {
    const persistenceModel = TicketImpressionMapper.toPersistence(
      data as TicketImpression,
    );
    const newEntity = await this.repository.save(
      this.repository.create(persistenceModel),
    );
    // Recargar para obtener relaciones
    const completeEntity = await this.repository.findOne({
      where: { id: newEntity.id },
      relations: ['order', 'user'],
    });
    if (!completeEntity) {
      throw new Error('Failed to load created ticket impression');
    }
    return TicketImpressionMapper.toDomain(completeEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: {
      orderId?: string;
      userId?: string;
      ticketType?: string;
    } | null;
    paginationOptions: IPaginationOptions;
  }): Promise<TicketImpression[]> {
    const where: FindOptionsWhere<TicketImpressionEntity> = {};

    if (filterOptions?.orderId) {
      where.orderId = filterOptions.orderId;
    }
    if (filterOptions?.userId) {
      where.userId = filterOptions.userId;
    }
    if (filterOptions?.ticketType) {
      where.ticketType = filterOptions.ticketType as TicketType; // Castear a TicketType
    }

    const entities = await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['order', 'user'],
      order: {
        impressionTime: 'DESC', // Ordenar por fecha de impresión descendente
      },
    });

    return entities.map((entity) => TicketImpressionMapper.toDomain(entity));
  }

  async findById(
    id: TicketImpression['id'],
  ): Promise<NullableType<TicketImpression>> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['order', 'user'],
    });

    return entity ? TicketImpressionMapper.toDomain(entity) : null;
  }

  async findByOrderId(
    orderId: TicketImpression['orderId'],
  ): Promise<TicketImpression[]> {
    const entities = await this.repository.find({
      where: { orderId },
      relations: ['order', 'user'],
      order: {
        impressionTime: 'DESC',
      },
    });

    return entities.map((entity) => TicketImpressionMapper.toDomain(entity));
  }
}
