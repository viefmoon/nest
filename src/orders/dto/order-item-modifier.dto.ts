import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class OrderItemModifierDto {
  @IsNotEmpty()
  @IsUUID()
  modifierId: string;

  @IsNotEmpty()
  @IsUUID()
  modifierOptionId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
