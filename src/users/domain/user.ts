import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';
import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from '../enums/gender.enum';

const idType = Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @ApiProperty({
    type: String,
    example: 'johndoe',
  })
  @Expose({ groups: ['me', 'admin'] })
  username: string;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: Date,
    example: '1990-01-01',
    required: false,
  })
  birthDate: Date | null;

  @ApiProperty({
    enum: GenderEnum,
    enumName: 'GenderEnum',
    example: GenderEnum.PREFER_NOT_TO_SAY,
    required: false,
  })
  gender: GenderEnum | null;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    required: false,
  })
  phoneNumber: string | null;

  @ApiProperty({
    type: String,
    example: '123 Main St',
    required: false,
  })
  address: string | null;

  @ApiProperty({
    type: String,
    example: 'New York',
    required: false,
  })
  city: string | null;

  @ApiProperty({
    type: String,
    example: 'NY',
    required: false,
  })
  state: string | null;

  @ApiProperty({
    type: String,
    example: 'USA',
    required: false,
  })
  country: string | null;

  @ApiProperty({
    type: String,
    example: '10001',
    required: false,
  })
  zipCode: string | null;

  @ApiProperty({
    type: Object,
    example: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phoneNumber: '+1987654321',
    },
    required: false,
  })
  emergencyContact: Record<string, any> | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiProperty({
    type: () => Status,
  })
  status?: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
