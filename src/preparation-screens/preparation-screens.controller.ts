import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PreparationScreensService } from './preparation-screens.service';
import { PreparationScreen } from './domain/preparation-screen';
import { CreatePreparationScreenDto } from './dto/create-preparation-screen.dto';
import { FindAllPreparationScreensDto } from './dto/find-all-preparation-screens.dto';
import { UpdatePreparationScreenDto } from './dto/update-preparation-screen.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Preparation Screens')
@Controller({
  path: 'preparation-screens',
  version: '1',
})
export class PreparationScreensController {
  constructor(
    private readonly preparationScreensService: PreparationScreensService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new preparation screen' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The preparation screen has been successfully created.',
    type: PreparationScreen,
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(
    @Body() createPreparationScreenDto: CreatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    return this.preparationScreensService.create(createPreparationScreenDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all preparation screens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of preparation screens',
    // Type should ideally represent the [PreparationScreen[], number] structure.
    // For Swagger, you might need a dedicated pagination response DTO or describe it here.
    // Example description: Returns an array where the first element is the list of screens and the second is the total count.
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: 'array', items: { $ref: '#/components/schemas/PreparationScreen' } },
          { type: 'number' },
        ],
      },
      // Provide a more complete and valid example object
      example: [[{ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Main Kitchen Screen', description: 'Primary screen for kitchen orders', isActive: true, createdAt: '2023-10-27T10:00:00Z', updatedAt: '2023-10-27T10:00:00Z', products: [{id: 'prod-uuid-1', name: 'Burger'}, {id: 'prod-uuid-2', name: 'Fries'}] }], 5],
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    // Use the consolidated DTO for all query parameters
    @Query() queryOptions: FindAllPreparationScreensDto,
  ): Promise<[PreparationScreen[], number]> { // Update return type to tuple
    // Extract pagination options from the DTO, providing defaults if not present
    const paginationOptions: IPaginationOptions = {
      page: queryOptions.page ?? 1,
      limit: queryOptions.limit ?? 10,
    };
    // Pass filter options (excluding page/limit) and pagination options separately
    // The service expects filterOptions and paginationOptions as separate arguments
    const { page, limit, ...filterOptions } = queryOptions;
    return this.preparationScreensService.findAll(filterOptions, paginationOptions);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get preparation screen by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the preparation screen',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The preparation screen has been successfully retrieved.',
    type: PreparationScreen,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Preparation screen not found',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string): Promise<PreparationScreen> {
    return this.preparationScreensService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update preparation screen by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the preparation screen',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The preparation screen has been successfully updated.',
    type: PreparationScreen,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Preparation screen not found',
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updatePreparationScreenDto: UpdatePreparationScreenDto,
  ): Promise<PreparationScreen> {
    return this.preparationScreensService.update(
      id,
      updatePreparationScreenDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete preparation screen by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the preparation screen',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The preparation screen has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Preparation screen not found',
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.preparationScreensService.remove(id);
  }
}
