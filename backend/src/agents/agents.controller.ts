import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AgentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AgentsService } from './agents.service';
import { User } from '@prisma/client';

class UpdateAgentDto {
  @IsOptional() @IsEnum(AgentStatus) status?: AgentStatus;
  @IsOptional() config?: Record<string, unknown>;
}

@ApiTags('Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(private readonly service: AgentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all company agents' })
  list(@CurrentUser() user: User) {
    return this.service.findAll(user.companyId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'All agents with real-time task stats' })
  summary(@CurrentUser() user: User) {
    return this.service.getSummary(user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single agent' })
  get(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(user.companyId, id);
  }

  @Get(':id/kpis')
  @ApiOperation({ summary: 'Get agent KPIs and task stats' })
  kpis(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getKpis(user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update agent status or config' })
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateAgentDto) {
    if (dto.status) return this.service.setStatus(user.companyId, id, dto.status);
    if (dto.config) return this.service.updateConfig(user.companyId, id, dto.config);
  }
}
