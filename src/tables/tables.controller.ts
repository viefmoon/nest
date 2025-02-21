import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './domain/table';
import { NullableType } from '../utils/types/nullable.type';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Tables')
@Controller({
  path: 'tables',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Table })
  createTable(@Body() dto: CreateTableDto): Promise<Table> {
    return this.tablesService.createTable(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [Table] })
  findAll(): Promise<Table[]> {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Table })
  findOne(@Param('id') id: number): Promise<NullableType<Table>> {
    return this.tablesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Table })
  update(@Param('id') id: number, @Body() dto: UpdateTableDto): Promise<Table> {
    return this.tablesService.updateTable(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.tablesService.removeTable(id);
  }

  // Ejemplo para fusión de mesas
  @Post(':id/merge')
  @HttpCode(HttpStatus.NO_CONTENT)
  async mergeTables(
    @Param('id') parentId: number,
    @Body() body: { childTableIds: number[] },
  ): Promise<void> {
    return this.tablesService.mergeTables(parentId, body.childTableIds);
  }

  // Ejemplo para separar mesas
  @Post(':id/split')
  @HttpCode(HttpStatus.NO_CONTENT)
  async splitTables(@Param('id') tableId: number): Promise<void> {
    return this.tablesService.splitTables(tableId);
  }
} 