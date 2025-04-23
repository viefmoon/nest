import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ThermalPrintersService } from './thermal-printers.service';
import { CreateThermalPrinterDto } from './dto/create-thermal-printer.dto';
import { UpdateThermalPrinterDto } from './dto/update-thermal-printer.dto';
import { FindAllThermalPrintersDto } from './dto/find-all-thermal-printers.dto';
import { ThermalPrinter } from './domain/thermal-printer';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Impresoras Térmicas')
@Controller({
  path: 'thermal-printers',
  version: '1',
})
export class ThermalPrintersController {
  constructor(
    private readonly thermalPrintersService: ThermalPrintersService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva impresora térmica' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La impresora ha sido creada exitosamente.',
    type: ThermalPrinter,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe una impresora con el mismo nombre.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El área especificada no existe.',
  })
  create(@Body() createDto: CreateThermalPrinterDto): Promise<ThermalPrinter> {
    return this.thermalPrintersService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las impresoras térmicas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de impresoras térmicas',
    type: InfinityPaginationResponse(ThermalPrinter),
  })
  async findAll(
    @Query() filterOptions: FindAllThermalPrintersDto,
  ): Promise<InfinityPaginationResponseDto<ThermalPrinter>> {
    const page = filterOptions.page ?? 1;
    const limit = filterOptions.limit ?? 10;
    const [data] = await this.thermalPrintersService.findAll(
      filterOptions,
      { page, limit },
    );
    return infinityPagination(data, { page, limit });
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una impresora térmica por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Impresora térmica encontrada.',
    type: ThermalPrinter,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Impresora no encontrada.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ThermalPrinter> {
    return this.thermalPrintersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una impresora térmica' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La impresora ha sido actualizada exitosamente.',
    type: ThermalPrinter,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Impresora o área especificada no encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe otra impresora con el mismo nombre.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateThermalPrinterDto,
  ): Promise<ThermalPrinter> {
    return this.thermalPrintersService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una impresora térmica' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'La impresora ha sido eliminada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Impresora no encontrada.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.thermalPrintersService.remove(id);
  }
}
