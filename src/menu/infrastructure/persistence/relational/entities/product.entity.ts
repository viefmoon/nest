import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SubCategoryEntity } from './subcategory.entity';
import { ProductVariantEntity } from './product-variant.entity';

@Entity('product')
export class ProductEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'float' })
  price?: number;

  @Column({ default: false })
  hasVariants: boolean;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => SubCategoryEntity, (subcat) => subcat.products, { eager: true })
  subCategory: SubCategoryEntity;

  @Column({ nullable: true })
  photoId?: string;

  @Column({ nullable: true })
  estimatedPrepTime?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product)
  variants: ProductVariantEntity[];
} 