import { Customer } from './customer';

export class Address {
  id: string;

  customerId: string;

  street: string;

  number: string | null; // Mantener null por DTOs/lógica

  interiorNumber?: string; // Opcional

  neighborhood?: string; // Opcional

  city?: string; // Opcional

  state?: string; // Opcional

  zipCode?: string; // Opcional

  country?: string; // Opcional

  references?: string; // Opcional

  isDefault: boolean;

  customer: Customer;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
