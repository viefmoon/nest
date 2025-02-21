import { Column, Entity, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity('area')
export class AreaEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @DeleteDateColumn()
  deletedAt?: Date | null;
} 