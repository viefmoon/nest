import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AreaEntity } from '../../../../../areas/infrastructure/persistence/relational/entities/area.entity';

@Entity({
  name: 'table',
})
export class TableEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: false })
  areaId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isTemporary: boolean;

  @Column({ type: 'varchar', nullable: true })
  temporaryIdentifier: string | null;

  @ManyToOne(() => AreaEntity, (area) => area.tables, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'areaId' })
  area: AreaEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
