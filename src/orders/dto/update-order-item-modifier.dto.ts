import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateOrderItemModifierDto {
  @IsOptional()
  @IsUUID()
  modifierId?: string;

  @IsOptional()
  @IsUUID()
  modifierOptionId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
