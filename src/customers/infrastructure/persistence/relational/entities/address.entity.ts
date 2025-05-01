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
  RelationId,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CustomerEntity } from './customer.entity';

@Entity({
  name: 'address', 
})
export class AddressEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @RelationId((address: AddressEntity) => address.customer)
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
  number: string | null; // Nullable (corresponde a string | null en dominio)

  @Column({ type: 'varchar', length: 50, nullable: true })
  interiorNumber: string | null; // Nullable (corresponde a interiorNumber?: string)

  @Column({ type: 'varchar', length: 150, nullable: true })
  neighborhood: string | null; // Nullable (corresponde a neighborhood?: string)

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null; // Nullable (corresponde a city?: string)

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null; // Nullable (corresponde a state?: string)

  @Index()
  @Column({ type: 'varchar', length: 10, nullable: true })
  zipCode: string | null; // Nullable (corresponde a zipCode?: string)

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null; // Nullable (corresponde a country?: string)

  @Column({ type: 'text', nullable: true })
  references: string | null; // Nullable (corresponde a references?: string)

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
