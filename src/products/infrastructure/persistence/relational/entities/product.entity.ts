import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SubCategoryEntity } from '../../../../../subcategories/infrastructure/persistence/relational/entities/subcategory.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { ProductVariantEntity } from '../../../../../product-variants/infrastructure/persistence/relational/entities/product-variant.entity';
import { ModifierGroupEntity } from '../../../../../modifier-groups/infrastructure/persistence/relational/entities/modifier-group.entity';
import { OrderItemEntity } from '../../../../../orders/infrastructure/persistence/relational/entities/order-item.entity';
import { PreparationScreenEntity } from '../../../../../preparation-screens/infrastructure/persistence/relational/entities/preparation-screen.entity';

@Entity({
  name: 'product',
})
export class ProductEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Column({ default: false })
  hasVariants: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  subCategoryId: string;

  @Column({ nullable: true })
  photoId: string | null;

  @Column()
  estimatedPrepTime: number;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'photoId' })
  photo: FileEntity | null;

  @ManyToOne(() => SubCategoryEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategoryEntity;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product)
  variants: ProductVariantEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemEntity[];

  @ManyToMany(() => ModifierGroupEntity)
  @JoinTable({
    name: 'product_modifier_group',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'modifier_group_id',
      referencedColumnName: 'id',
    },
  })
  modifierGroups: ModifierGroupEntity[];

  @ManyToOne(
    () => PreparationScreenEntity,
    (preparationScreen) => preparationScreen.products,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'preparationScreenId' })
  preparationScreen: PreparationScreenEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
