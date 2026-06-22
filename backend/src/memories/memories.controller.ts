import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, IsInt, Min, Max } from 'class-validator';
import { MemoryType } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MemoriesService, CreateMemoryDto } from './memories.service';
import { User } from '@prisma/client';

class CreateMemoryBodyDto implements CreateMemoryDto {
  @IsEnum(MemoryType) type: MemoryType;
  @IsString() title: string;
  @IsString() content: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsInt() @Min(1) @Max(10) importance?: number;
}

@ApiTags('Memories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('memories')
export class MemoriesController {
  constructor(private readonly service: MemoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List company memories (company brain)' })
  list(
    @CurrentUser() user: User,
    @Query('type') type?: MemoryType,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.service.findAll(user.companyId, type, search, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Store a memory into the company brain' })
  create(@CurrentUser() user: User, @Body() dto: CreateMemoryBodyDto) {
    return this.service.create(user.companyId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a memory' })
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: Partial<CreateMemoryBodyDto>) {
    return this.service.update(user.companyId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a memory' })
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.delete(user.companyId, id);
  }
}
