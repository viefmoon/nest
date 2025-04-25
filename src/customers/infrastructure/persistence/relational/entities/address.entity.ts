import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CustomerEntity } from './customer.entity'; // Importar CustomerEntity

@Entity({
  name: 'address', // Nombre de la tabla
})
export class AddressEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' }) // Columna para la clave foránea
  customerId: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.addresses, {
    nullable: false, // Una dirección siempre debe pertenecer a un cliente
    onDelete: 'CASCADE', // Si se elimina el cliente, se eliminan sus direcciones
  })
  @JoinColumn({ name: 'customer_id' }) // Especificar la columna de unión
  customer: CustomerEntity; // Relación muchos a uno con Customer

  @Column({ type: 'varchar', length: 200 })
  street: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  number: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  interiorNumber: string | null;

  @Column({ type: 'varchar', length: 150 })
  neighborhood: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Index() // Indexar código postal puede ser útil
  @Column({ type: 'varchar', length: 10 })
  zipCode: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'text', nullable: true })
  references: string | null;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
