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
import { AreasService } from './areas.service';
import { Area } from './domain/area';
import { CreateAreaDto } from './dto/create-area.dto';
import { FindAllAreasDto } from './dto/find-all-areas.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Areas')
@Controller({
  path: 'areas',
  version: '1',
})
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new area' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The area has been successfully created.',
    type: Area,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'An area with the same name already exists.',
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createAreaDto: CreateAreaDto): Promise<Area> {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of areas',
    type: [Area],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query() filterOptions: FindAllAreasDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Area[]> {
    return this.areasService.findAll(filterOptions, {
      page,
      limit,
    } as IPaginationOptions);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get area by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the area',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The area has been successfully retrieved.',
    type: Area,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Area not found',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string): Promise<Area> {
    return this.areasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update area by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the area',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The area has been successfully updated.',
    type: Area,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Area not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'An area with the same name already exists.',
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Area> {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete area by id' })
  @ApiParam({
    name: 'id',
    description: 'The id of the area',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The area has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Area not found',
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.areasService.remove(id);
  }
}
