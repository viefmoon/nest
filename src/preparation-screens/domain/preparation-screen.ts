export class PreparationScreen {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  static create(
    id: string,
    name: string,
    description: string | null,
    isActive: boolean,
    displayOrder: number,
    color: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): PreparationScreen {
    const preparationScreen = new PreparationScreen();
    preparationScreen.id = id;
    preparationScreen.name = name;
    preparationScreen.description = description;
    preparationScreen.isActive = isActive;
    preparationScreen.displayOrder = displayOrder;
    preparationScreen.color = color;
    preparationScreen.createdAt = createdAt;
    preparationScreen.updatedAt = updatedAt;
    preparationScreen.deletedAt = deletedAt;
    return preparationScreen;
  }
}
