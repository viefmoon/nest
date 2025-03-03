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
    description: 'List of preparation screens',
    type: [PreparationScreen],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query() filterOptions: FindAllPreparationScreensDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PreparationScreen[]> {
    return this.preparationScreensService.findAll(filterOptions, {
      page,
      limit,
    } as IPaginationOptions);
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
