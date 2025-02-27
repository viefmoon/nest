import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './domain/product';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ProductVariantsService } from '../product-variants/product-variants.service';
import { ProductVariant } from '../product-variants/domain/product-variant';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log('createProductDto', createProductDto);
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price || null;
    product.hasVariants = createProductDto.hasVariants || false;
    product.isActive = createProductDto.isActive ?? true;
    product.subCategoryId = createProductDto.subCategoryId;
    product.estimatedPrepTime = createProductDto.estimatedPrepTime;
    product.preparationScreenId = createProductDto.preparationScreenId || null;
    product.photoId = createProductDto.photoId || null;

    if (createProductDto.photoId) {
      product.photo = {
        id: createProductDto.photoId,
        path: '',
      };
    }

    // Crear el producto primero
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
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne(id);

    const product = new Product();
    product.id = id;
    product.name = updateProductDto.name ?? existingProduct.name;
    product.price = updateProductDto.price ?? existingProduct.price;
    product.hasVariants =
      updateProductDto.hasVariants ?? existingProduct.hasVariants;
    product.isActive = updateProductDto.isActive ?? existingProduct.isActive;
    product.subCategoryId =
      updateProductDto.subCategoryId ?? existingProduct.subCategoryId;
    product.estimatedPrepTime =
      updateProductDto.estimatedPrepTime ?? existingProduct.estimatedPrepTime;
    product.preparationScreenId =
      updateProductDto.preparationScreenId ??
      existingProduct.preparationScreenId;

    if (updateProductDto.photoId !== undefined) {
      product.photo = updateProductDto.photoId
        ? {
            id: updateProductDto.photoId,
            path: '',
          }
        : null;
    } else if (existingProduct.photo) {
      product.photo = {
        id: existingProduct.photo.id,
        path: '',
      };
    }

    // Actualizar el producto
    await this.productRepository.update(id, product);

    // Manejar las variantes si se proporcionaron
    if (updateProductDto.variants && updateProductDto.variants.length > 0) {
      // Procesar las variantes a actualizar o crear
      for (const variantDto of updateProductDto.variants) {
        if (variantDto.id) {
          // Actualizar variante existente
          await this.productVariantsService.update(variantDto.id, {
            name: variantDto.name,
            price: variantDto.price,
            isActive: variantDto.isActive,
          });
        } else {
          // Crear nueva variante
          await this.productVariantsService.create({
            productId: id,
            name: variantDto.name || '',
            price: variantDto.price || 0,
            isActive: variantDto.isActive,
          });
        }
      }
    }

    // Eliminar variantes si se especificaron
    if (
      updateProductDto.variantsToDelete &&
      updateProductDto.variantsToDelete.length > 0
    ) {
      for (const variantId of updateProductDto.variantsToDelete) {
        await this.productVariantsService.remove(variantId);
      }
    }

    // Obtener el producto actualizado con sus variantes
    return this.productRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    return this.productRepository.softDelete(id);
  }
}
