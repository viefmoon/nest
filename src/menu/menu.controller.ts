import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
  QuerySubCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Menu')
@Controller({
  path: 'menu',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin) // Ejemplo: sólo admin puede modificar
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * Categorías
   */
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Crea una nueva categoría',
  })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Listado paginado de categorías',
  })
  findAllCategories(@Query() query: QueryCategoryDto) {
    return this.menuService.findAllCategories(query);
  }

  @Get('categories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Retorna una categoría por ID',
  })
  findCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Actualiza una categoría',
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    description: 'Elimina lógicamente una categoría',
  })
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeCategory(id);
  }

  /**
   * Subcategorías
   */
  @Post('subcategories')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Crea una nueva subcategoría',
  })
  createSubCategory(@Body() dto: CreateSubCategoryDto) {
    return this.menuService.createSubCategory(dto);
  }

  @Get('subcategories')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Listado paginado de subcategorías',
  })
  findAllSubCategories(@Query() query: QuerySubCategoryDto) {
    return this.menuService.findAllSubCategories(query);
  }

  @Get('subcategories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Retorna una subcategoría por ID',
  })
  findSubCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findSubCategoryById(id);
  }

  @Patch('subcategories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Actualiza una subcategoría',
  })
  updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.menuService.updateSubCategory(id, dto);
  }

  @Delete('subcategories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    description: 'Elimina lógicamente una subcategoría',
  })
  removeSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeSubCategory(id);
  }

  /**
   * Productos
   */
  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Crea un nuevo producto',
  })
  createProduct(@Body() dto: CreateProductDto) {
    return this.menuService.createProduct(dto);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Listado paginado de productos',
  })
  findAllProducts(@Query() query: QueryProductDto) {
    return this.menuService.findAllProducts(query);
  }

  @Get('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Retorna un producto por ID',
  })
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findProductById(id);
  }

  @Patch('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Actualiza un producto',
  })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.menuService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    description: 'Elimina lógicamente un producto',
  })
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeProduct(id);
  }
}
