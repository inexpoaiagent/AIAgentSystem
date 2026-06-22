import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AgentTasksService } from './agent-tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '@prisma/client';

class RejectTaskDto {
  @IsOptional() @IsString() reason?: string;
}

@ApiTags('Agent Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agent-tasks')
export class AgentTasksController {
  constructor(private readonly service: AgentTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Dispatch a new agent task (matches POST /v1/agent-tasks)' })
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.service.create(user.companyId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List agent tasks with pagination' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  list(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.service.findAll(user.companyId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details including meeting and agents' })
  get(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(user.companyId, id);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a task pending human review' })
  approve(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.approve(user.companyId, id, user.id);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject a task' })
  reject(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: RejectTaskDto) {
    return this.service.reject(user.companyId, id, user.id, dto.reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a task' })
  cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.cancel(user.companyId, id, user.id);
  }
}
