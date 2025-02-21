import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AreaEntity } from './area.entity';

@Entity('table')
export class TableEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isTemporary: boolean;

  @Column({ type: 'int', nullable: true })
  @Index()
  parentTableId?: number | null;

  @ManyToOne(() => AreaEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  area: AreaEntity;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 