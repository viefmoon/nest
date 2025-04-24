import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AddressEntity } from './address.entity'; // Importar AddressEntity

@Entity({
  name: 'customer',
})
export class CustomerEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Index({ unique: true, where: 'email IS NOT NULL' }) // Índice único condicional
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @OneToMany(() => AddressEntity, (address) => address.customer)
  addresses: AddressEntity[]; // Relación uno a muchos con direcciones

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
