import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './domain/area';
import { NullableType } from '../utils/types/nullable.type';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Areas')
@Controller({
  path: 'areas',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Area })
  createArea(@Body() dto: CreateAreaDto): Promise<Area> {
    return this.areasService.createArea(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [Area] })
  findAll(): Promise<Area[]> {
    return this.areasService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Area })
  findOne(@Param('id') id: number): Promise<NullableType<Area>> {
    return this.areasService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Area })
  updateArea(@Param('id') id: number, @Body() dto: UpdateAreaDto): Promise<Area> {
    return this.areasService.updateArea(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArea(@Param('id') id: number): Promise<void> {
    return this.areasService.removeArea(id);
  }
} 