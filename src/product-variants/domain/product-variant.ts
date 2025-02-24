import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/domain/product';

export class ProductVariant {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    type: String,
    example: 'Grande',
  })
  name: string;

  @ApiProperty({
    type: Number,
    example: 12.99,
  })
  price: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    default: true,
    description: 'Indica si la variante está activa',
  })
  isActive: boolean;

  @ApiProperty({
    type: () => Product,
    nullable: true,
  })
  product: Product | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
  })
  deletedAt: Date | null;
}
