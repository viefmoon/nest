import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './domain/product';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ProductVariantsService } from '../product-variants/product-variants.service';
import { ProductVariant } from '../product-variants/domain/product-variant';
// import { AssignModifierGroupsDto } from './dto/assign-modifier-groups.dto'; // Ya no se usa
import { ModifierGroupsService } from '../modifier-groups/modifier-groups.service';
import { ModifierGroup } from '../modifier-groups/domain/modifier-group';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productVariantsService: ProductVariantsService,
    private readonly modifierGroupsService: ModifierGroupsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price ?? null;
    product.hasVariants = createProductDto.hasVariants ?? false;
    product.isActive = createProductDto.isActive ?? true;
    product.subCategoryId = createProductDto.subCategoryId;
    product.estimatedPrepTime = createProductDto.estimatedPrepTime;
    product.preparationScreenId = createProductDto.preparationScreenId ?? null;
    product.photoId = createProductDto.photoId ?? null;

    if (createProductDto.photoId) {
      product.photo = {
        id: createProductDto.photoId,
        path: '', // Path se resuelve al cargar la entidad completa
      };
    }

    // Asignar grupos de modificadores si se proporcionan IDs
    if (
      createProductDto.modifierGroupIds &&
      createProductDto.modifierGroupIds.length > 0
    ) {
      const modifierGroups: ModifierGroup[] = [];
      for (const groupId of createProductDto.modifierGroupIds) {
        try {
          const group = await this.modifierGroupsService.findOne(groupId);
          modifierGroups.push(group);
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new NotFoundException(
              `ModifierGroup with ID ${groupId} not found during creation`,
            );
          }
          throw error;
        }
      }
      product.modifierGroups = modifierGroups;
    } else {
      product.modifierGroups = [];
    }

    // Crear el producto
    const createdProduct = await this.productRepository.create(product);

    // Si tiene variantes, crearlas
    if (
      createProductDto.hasVariants &&
      createProductDto.variants &&
      createProductDto.variants.length > 0
    ) {
      const variants: ProductVariant[] = [];
      for (const variantDto of createProductDto.variants) {
        const variant = await this.productVariantsService.create({
          productId: createdProduct.id,
          name: variantDto.name,
          price: variantDto.price,
          isActive: variantDto.isActive,
        });
        variants.push(variant);
      }
      createdProduct.variants = variants;
    }

    return createdProduct;
  }

  async findAll(
    findAllProductsDto: FindAllProductsDto,
  ): Promise<[Product[], number]> {
    return this.productRepository.findAll({
      page: findAllProductsDto.page || 1,
      limit: findAllProductsDto.limit || 10,
      subCategoryId: findAllProductsDto.subCategoryId,
      hasVariants: findAllProductsDto.hasVariants,
      isActive: findAllProductsDto.isActive,
      search: findAllProductsDto.search,
    });
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto, // Añadir coma
  ): Promise<Product> {
    // Obtener el producto existente con sus relaciones
    const product = await this.productRepository.findOne(id);

    // Actualizar campos escalares
    product.name = updateProductDto.name ?? product.name;
    product.price =
      updateProductDto.price === null
        ? null
        : (updateProductDto.price ?? product.price);
    product.hasVariants = updateProductDto.hasVariants ?? product.hasVariants;
    product.isActive = updateProductDto.isActive ?? product.isActive;
    product.subCategoryId =
      updateProductDto.subCategoryId ?? product.subCategoryId;
    product.estimatedPrepTime =
      updateProductDto.estimatedPrepTime ?? product.estimatedPrepTime;
    product.preparationScreenId =
      updateProductDto.preparationScreenId === null
        ? null
        : (updateProductDto.preparationScreenId ?? product.preparationScreenId);

    // Actualizar foto
    if (updateProductDto.photoId !== undefined) {
      product.photo = updateProductDto.photoId
        ? {
            id: updateProductDto.photoId,
            path: '',
          }
        : null;
      product.photoId = updateProductDto.photoId;
    }

    // Sincronizar grupos de modificadores
    if (updateProductDto.modifierGroupIds !== undefined) {
      if (updateProductDto.modifierGroupIds.length > 0) {
        const modifierGroups: ModifierGroup[] = [];
        for (const groupId of updateProductDto.modifierGroupIds) {
          try {
            const group = await this.modifierGroupsService.findOne(groupId);
            modifierGroups.push(group);
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw new NotFoundException(
                `ModifierGroup with ID ${groupId} not found during update`,
              );
            }
            throw error;
          }
        }
        product.modifierGroups = modifierGroups;
      } else {
        // Array vacío: eliminar todas las asociaciones
        product.modifierGroups = [];
      }
    }
    // Si modifierGroupIds es undefined, no se modifican las relaciones existentes.

    // Guardar producto y relaciones (modifierGroups)
    const savedProduct = await this.productRepository.save(product);

    // --- Sincronización de Variantes ---
    if (updateProductDto.variants !== undefined) {
      // Obtener las variantes actuales del producto
      const currentVariants =
        await this.productVariantsService.findAllByProductId(id);
      const currentVariantIds = currentVariants.map((v) => v.id); // Wrap v in parentheses

      const incomingVariantsData = updateProductDto.variants || [];
      const incomingVariantIds = new Set(
        incomingVariantsData.filter((v) => v.id).map((v) => v.id), // Wrap v and format
      );

      // 1. Actualizar o Crear variantes entrantes
      const processedVariantIds: string[] = [];
      for (const variantDto of incomingVariantsData) {
        if (variantDto.id) {
          // Actualizar variante existente
          if (currentVariantIds.includes(variantDto.id)) {
            await this.productVariantsService.update(variantDto.id, {
              name: variantDto.name,
              price: variantDto.price,
              isActive: variantDto.isActive,
            });
            processedVariantIds.push(variantDto.id);
          } else {
            // ID de variante inválido o no pertenece a este producto, ignorar.
            console.warn(
              `Variant with ID ${variantDto.id} provided for update but does not belong to product ${id}. Skipping.`, // Añadir coma si es necesario por el formatter
            );
          }
        } else {
          // Crear nueva variante
          const newVariant = await this.productVariantsService.create({
            productId: id,
            name: variantDto.name || '',
            price: variantDto.price || 0,
            isActive: variantDto.isActive ?? true,
          });
          processedVariantIds.push(newVariant.id);
        }
      }

      // 2. Eliminar variantes antiguas no incluidas en la petición
      const variantsToDelete = currentVariants.filter(
        (v) => !incomingVariantIds.has(v.id), // Añadir coma si es necesario por el formatter
      );
      for (const variantToDelete of variantsToDelete) {
        await this.productVariantsService.remove(variantToDelete.id);
      }
    }
    // Si updateProductDto.variants es undefined, no se modifican las variantes existentes.
    // --- Fin Sincronización de Variantes ---

    // Devolver el producto actualizado desde la operación de guardado
    return savedProduct;
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.softDelete(id);
  }

  // Los métodos assign/get/removeModifierGroups se eliminan
  // ya que la sincronización completa se maneja en el método update.
}
