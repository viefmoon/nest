import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../roles/domain/role';
// Eliminada la importación de Status
import { GenderEnum } from '../enums/gender.enum';
// Eliminada la importación de FileType

export class User {
  id: string; // Cambiado a string para reflejar el tipo UUID

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Expose({ groups: ['me', 'admin'] })
  username: string;

  @Exclude({ toPlainOnly: true })
  password?: string;

  firstName: string | null;

  lastName: string | null;

  birthDate: Date | null;

  gender: GenderEnum | null;

  phoneNumber: string | null;

  address: string | null;

  city: string | null;

  state: string | null;

  country: string | null;

  zipCode: string | null;

  emergencyContact: Record<string, any> | null;


  role: Role | null;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
