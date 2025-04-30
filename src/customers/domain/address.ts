import { Customer } from './customer';

export class Address {
  id: string;

  customerId: string;

  street: string;

  number: string | null;

  interiorNumber: string | null;

  neighborhood: string;

  city: string;

  state: string;

  zipCode: string;

  country: string;

  references: string | null;

  isDefault: boolean;

  customer: Customer;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
