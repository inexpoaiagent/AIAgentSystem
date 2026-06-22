import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { WorkflowStatus } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WorkflowsService, CreateWorkflowDto } from './workflows.service';
import { User } from '@prisma/client';

class CreateWorkflowBodyDto implements CreateWorkflowDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() trigger?: Record<string, unknown>;
  @IsOptional() nodes?: never[];
  @IsOptional() edges?: never[];
  @IsOptional() policies?: Record<string, unknown>;
}

class UpdateWorkflowBodyDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(WorkflowStatus) status?: WorkflowStatus;
  @IsOptional() trigger?: Record<string, unknown>;
  @IsOptional() nodes?: never[];
  @IsOptional() edges?: never[];
}

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly service: WorkflowsService) {}

  @Get()
  @ApiOperation({ summary: 'List workflows' })
  list(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.service.findAll(user.companyId, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a workflow' })
  create(@CurrentUser() user: User, @Body() dto: CreateWorkflowBodyDto) {
    return this.service.create(user.companyId, user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow detail' })
  get(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workflow' })
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateWorkflowBodyDto) {
    return this.service.update(user.companyId, id, user.id, dto as Partial<CreateWorkflowDto & { status: WorkflowStatus }>);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive workflow' })
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.delete(user.companyId, id, user.id);
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Trigger a workflow run' })
  run(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.run(user.companyId, id, user.id);
  }

  @Get(':id/runs')
  @ApiOperation({ summary: 'List workflow run history' })
  runs(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getRuns(user.companyId, id);
  }
}
