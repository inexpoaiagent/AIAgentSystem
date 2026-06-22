import {
  Controller, Get, Put, Post, Delete, Param, Body, UseGuards, Query, ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { PacksService } from '../packs/packs.service';
import { User } from '@prisma/client';

class UpdateUserDto {
  @IsOptional() @IsString() status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  @IsOptional() @IsString() role?: 'SUPER_ADMIN' | 'ADMIN' | 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';
}

class ListQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
}

function requireAdmin(user: User) {
  if (!['SUPER_ADMIN', 'ADMIN', 'OWNER'].includes(user.role)) {
    throw new ForbiddenException('Admin access required');
  }
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly packs: PacksService,
  ) {}

  // ── Users ──────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users (admin only)' })
  listUsers(@CurrentUser() user: User, @Query() q: ListQueryDto) {
    requireAdmin(user);
    return this.service.listUsers(q.search, q.page ?? 1, q.limit ?? 20);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user status/role (admin only)' })
  updateUser(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    requireAdmin(user);
    return this.service.updateUser(id, dto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  deleteUser(@CurrentUser() user: User, @Param('id') id: string) {
    requireAdmin(user);
    return this.service.deleteUser(id);
  }

  // ── Companies ──────────────────────────────────────────────────────────────

  @Get('companies')
  @ApiOperation({ summary: 'List all companies (admin only)' })
  listCompanies(@CurrentUser() user: User, @Query() q: ListQueryDto) {
    requireAdmin(user);
    return this.service.listCompanies(q.search, q.page ?? 1, q.limit ?? 20);
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Get company detail (admin only)' })
  getCompany(@CurrentUser() user: User, @Param('id') id: string) {
    requireAdmin(user);
    return this.service.getCompanyDetail(id);
  }

  @Put('companies/:id/pack')
  @ApiOperation({ summary: 'Assign industry pack to a company (admin only)' })
  assignPack(@CurrentUser() user: User, @Param('id') id: string, @Body() body: { packId: string }) {
    requireAdmin(user);
    return this.service.assignPack(id, body.packId);
  }

  // ── Industry Packs CRUD ────────────────────────────────────────────────────

  @Get('packs')
  @ApiOperation({ summary: 'List all industry packs (admin)' })
  listPacks(@CurrentUser() user: User) {
    requireAdmin(user);
    return this.packs.listAll();
  }

  @Post('packs')
  @ApiOperation({ summary: 'Create industry pack (admin)' })
  createPack(@CurrentUser() user: User, @Body() body: Record<string, unknown>) {
    requireAdmin(user);
    return this.packs.create(body as any);
  }

  @Put('packs/:id')
  @ApiOperation({ summary: 'Update industry pack (admin)' })
  updatePack(@CurrentUser() user: User, @Param('id') id: string, @Body() body: Record<string, unknown>) {
    requireAdmin(user);
    return this.packs.update(id, body);
  }

  @Delete('packs/:id')
  @ApiOperation({ summary: 'Delete industry pack (admin)' })
  deletePack(@CurrentUser() user: User, @Param('id') id: string) {
    requireAdmin(user);
    return this.packs.delete(id);
  }

  // ── Business Categories ────────────────────────────────────────────────────

  @Get('categories')
  @ApiOperation({ summary: 'List all business categories' })
  listCategories(@CurrentUser() user: User) {
    requireAdmin(user);
    return this.service.listCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create business category' })
  createCategory(
    @CurrentUser() user: User,
    @Body() body: { name: string; slug: string; description?: string; icon?: string; sortOrder?: number },
  ) {
    requireAdmin(user);
    return this.service.createCategory(body);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update business category' })
  updateCategory(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; description: string; icon: string; isActive: boolean; sortOrder: number }>,
  ) {
    requireAdmin(user);
    return this.service.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete business category' })
  deleteCategory(@CurrentUser() user: User, @Param('id') id: string) {
    requireAdmin(user);
    return this.service.deleteCategory(id);
  }

  // ── Platform stats ─────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Platform-wide statistics (admin only)' })
  platformStats(@CurrentUser() user: User) {
    requireAdmin(user);
    return this.service.platformStats();
  }
}
