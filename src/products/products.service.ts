import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './domain/product';
import { FindAllProductsDto } from './dto/find-all-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price || null;
    product.hasVariants = createProductDto.hasVariants || false;
    product.isActive = createProductDto.isActive ?? true;
    product.subCategoryId = createProductDto.subCategoryId;
    product.estimatedPrepTime = createProductDto.estimatedPrepTime;
    product.preparationScreenId = createProductDto.preparationScreenId || null;

    if (createProductDto.photoId) {
      product.photo = {
        id: createProductDto.photoId,
        path: '',
      };
    }

    return this.productRepository.create(product);
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

    return this.productRepository.update(id, product);
  }

  async remove(id: string): Promise<void> {
    return this.productRepository.softDelete(id);
  }
}
