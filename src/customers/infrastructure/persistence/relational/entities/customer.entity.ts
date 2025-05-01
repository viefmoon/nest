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
import { AddressEntity } from './address.entity';

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

  // Usar un índice explícito nombrado para phoneNumber en lugar de unique: true en @Column
  // Esto asegura un nombre de restricción predecible (uq_customer_phone)
  @Index('uq_customer_phone', { unique: true, where: '"phoneNumber" IS NOT NULL' }) // Usar comillas si el nombre de columna difiere o contiene mayúsculas
  @Column({ type: 'varchar', length: 20, nullable: true }) // Quitar unique: true de aquí
  phoneNumber: string | null;

  @Index('uq_customer_email', { unique: true, where: 'email IS NOT NULL' }) // Mantener índice nombrado para email
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @OneToMany(() => AddressEntity, (address) => address.customer)
  addresses: AddressEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
