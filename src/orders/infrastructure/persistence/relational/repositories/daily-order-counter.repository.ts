import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DailyOrderCounter } from '../../../../domain/daily-order-counter';
import { DailyOrderCounterRepository } from '../../daily-order-counter.repository';
import { DailyOrderCounterEntity } from '../entities/daily-order-counter.entity';
import { DailyOrderCounterMapper } from '../mappers/daily-order-counter.mapper';

@Injectable()
export class DailyOrderCounterRelationalRepository
  implements DailyOrderCounterRepository
{
  constructor(
    @InjectRepository(DailyOrderCounterEntity)
    private readonly dailyOrderCounterRepository: Repository<DailyOrderCounterEntity>,
  ) {}

  async create(
    data: Omit<
      DailyOrderCounter,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'orders'
    >,
  ): Promise<DailyOrderCounter> {
    const persistenceModel = DailyOrderCounterMapper.toPersistence(
      data as DailyOrderCounter,
    );
    const newEntity = await this.dailyOrderCounterRepository.save(
      this.dailyOrderCounterRepository.create(persistenceModel),
    );

    const completeEntity = await this.dailyOrderCounterRepository.findOne({
      where: { id: newEntity.id },
      relations: ['orders'],
    });

    if (!completeEntity) {
      throw new Error(
        `No se pudo cargar el contador diario creado con ID ${newEntity.id}`,
      );
    }

    return DailyOrderCounterMapper.toDomain(completeEntity);
  }

  async findById(
    id: DailyOrderCounter['id'],
  ): Promise<NullableType<DailyOrderCounter>> {
    const entity = await this.dailyOrderCounterRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    return entity ? DailyOrderCounterMapper.toDomain(entity) : null;
  }

  async findByDate(date: Date): Promise<NullableType<DailyOrderCounter>> {
    // Normalizamos la fecha para buscar solo por día
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const entity = await this.dailyOrderCounterRepository.findOne({
      where: {
        date: searchDate,
      },
      relations: ['orders'],
    });

    return entity ? DailyOrderCounterMapper.toDomain(entity) : null;
  }

  async findOrCreateByDate(date: Date): Promise<DailyOrderCounter> {
    // Normalizamos la fecha para buscar solo por día
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    let counter = await this.findByDate(searchDate);

    if (!counter) {
      // Si no existe el contador para esta fecha, lo creamos
      const newCounter = new DailyOrderCounter();
      newCounter.date = searchDate;
      newCounter.currentNumber = 0;
      counter = await this.create(newCounter);
    }

    return counter;
  }

  async incrementCounter(
    id: DailyOrderCounter['id'],
  ): Promise<DailyOrderCounter> {
    // Incrementamos el contador de forma atómica utilizando una consulta SQL
    await this.dailyOrderCounterRepository.query(
      `UPDATE daily_order_counter SET "currentNumber" = "currentNumber" + 1 WHERE id = $1`,
      [id],
    );

    // Obtener el contador actualizado
    const updatedCounter = await this.findById(id);
    if (!updatedCounter) {
      throw new Error(
        `No se pudo encontrar el contador con ID ${id} después de incrementarlo`,
      );
    }

    return updatedCounter;
  }

  async update(
    id: DailyOrderCounter['id'],
    payload: Partial<DailyOrderCounter>,
  ): Promise<DailyOrderCounter> {
    const entity = await this.dailyOrderCounterRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!entity) {
      throw new Error('Daily order counter not found');
    }

    const updatedEntity = await this.dailyOrderCounterRepository.save(
      this.dailyOrderCounterRepository.create({
        ...DailyOrderCounterMapper.toPersistence({
          ...DailyOrderCounterMapper.toDomain(entity),
          ...payload,
        }),
      }),
    );

    // Cargar la entidad actualizada con todas las relaciones
    const completeEntity = await this.dailyOrderCounterRepository.findOne({
      where: { id: updatedEntity.id },
      relations: ['orders'],
    });

    if (!completeEntity) {
      throw new Error(
        `No se pudo cargar el contador actualizado con ID ${updatedEntity.id}`,
      );
    }

    return DailyOrderCounterMapper.toDomain(completeEntity);
  }

  async remove(id: DailyOrderCounter['id']): Promise<void> {
    await this.dailyOrderCounterRepository.softDelete(id);
  }
}
