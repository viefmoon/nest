import { Address } from './address'; // Importaremos Address más adelante

export class Customer {
  id: string;

  firstName: string;

  lastName: string;

  phoneNumber: string | null;

  email: string | null;

  addresses: Address[] | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
