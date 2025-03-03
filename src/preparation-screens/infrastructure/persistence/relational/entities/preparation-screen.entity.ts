import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'preparation_screens' })
export class PreparationScreenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 1 })
  displayOrder: number;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // La relación con productos se implementará cuando se actualice la entidad de productos
  // @OneToMany(() => ProductEntity, (product) => product.preparationScreen)
  // products: ProductEntity[];
}
