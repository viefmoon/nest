import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator'; // Añadir IsUUID

export class UserDto {
  @ApiProperty({
    type: String,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Ejemplo de UUID
  })
  @IsNotEmpty()
  @IsUUID() // Añadir validador UUID
  id: string; // Cambiar a string
}
