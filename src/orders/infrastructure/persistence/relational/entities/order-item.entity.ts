import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product.entity';
import { ProductVariantEntity } from '../../../../../product-variants/infrastructure/persistence/relational/entities/product-variant.entity';
import { OrderItemModifierEntity } from './order-item-modifier.entity';
import { PreparationStatus } from '../../../../domain/order-item';

@Entity({
  name: 'order_item',
})
export class OrderItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  orderId: string;

  @Column({ nullable: false })
  productId: string;

  @Column({ nullable: true })
  productVariantId: string | null;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  finalPrice: number;

  @Column({
    type: 'enum',
    enum: PreparationStatus,
    default: PreparationStatus.PENDING,
  })
  preparationStatus: PreparationStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  statusChangedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  preparationNotes: string | null;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(
    () => ProductVariantEntity,
    (productVariant) => productVariant.orderItems,
    {
      eager: true,
      nullable: true,
    },
  )
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariantEntity | null;

  @OneToMany(
    () => OrderItemModifierEntity,
    (orderItemModifier) => orderItemModifier.orderItem,
  )
  modifiers: OrderItemModifierEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
