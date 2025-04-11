import { Product } from '../../products/domain/product';

export class PreparationScreen {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  products?: Product[]; // Añadir la relación con productos
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  static create(
    id: string,
    name: string,
    description: string | null,
    isActive: boolean,
    // products?: Product[], // Opcional, puede cargarse después
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): PreparationScreen {
    const preparationScreen = new PreparationScreen();
    preparationScreen.id = id;
    preparationScreen.name = name;
    preparationScreen.description = description;
    preparationScreen.isActive = isActive;
    // preparationScreen.products = products; // Asignar si se pasa
    preparationScreen.createdAt = createdAt;
    preparationScreen.updatedAt = updatedAt;
    preparationScreen.deletedAt = deletedAt;
    return preparationScreen;
  }
}
