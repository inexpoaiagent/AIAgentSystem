import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WorkspaceService } from './workspace.service';
import { User } from '@prisma/client';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly service: WorkspaceService) {}

  @Get()
  @ApiOperation({ summary: 'Get workspace context (matches frontend TenantContext)' })
  get(@CurrentUser() user: User) {
    return this.service.getForCompany(user.companyId);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update workspace settings' })
  updateSettings(@CurrentUser() user: User, @Body() body: Record<string, unknown>) {
    return this.service.updateSettings(user.companyId, body);
  }
}
