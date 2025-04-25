import { Product } from '../../domain/product';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(options: {
    page: number;
    limit: number;
    subcategoryId?: string;
    hasVariants?: boolean;
    isActive?: boolean;
    search?: string;
  }): Promise<[Product[], number]>;
  findOne(id: string): Promise<Product | null>; // findOne puede retornar null
  findByIds(ids: string[]): Promise<Product[]>; // Añadir findByIds
  update(id: string, product: Partial<Product>): Promise<Product | null>; // update puede retornar null si no se encuentra
  save(product: Product): Promise<Product>; // Añadir método save para actualizaciones completas con relaciones
  softDelete(id: string): Promise<void>;

  // Los métodos específicos para grupos de modificadores se eliminan de la interfaz
  // ya que la lógica principal está en el servicio usando 'save'.
}
