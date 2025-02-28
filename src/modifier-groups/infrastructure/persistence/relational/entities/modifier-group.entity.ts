import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductModifierEntity } from '../../../../../product-modifiers/infrastructure/persistence/relational/entities/product-modifier.entity';
import { ProductEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product.entity';

@Entity({
  name: 'modifier_group',
})
export class ModifierGroupEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  minSelections: number;

  @Column({ type: 'int' })
  maxSelections: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: false })
  allowMultipleSelections: boolean;

  @Column({ default: true })
  isActive: boolean;

  // Relación con ProductModifier
  @OneToMany(
    () => ProductModifierEntity,
    (productModifier) => productModifier.group,
  )
  productModifiers: ProductModifierEntity[];

  @ManyToMany(() => ProductEntity, (product) => product.modifierGroups)
  products: ProductEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
