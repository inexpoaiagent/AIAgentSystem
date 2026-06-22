import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsageType } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsageService } from './usage.service';
import { User } from '@prisma/client';

@ApiTags('Usage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usage')
export class UsageController {
  constructor(private readonly service: UsageService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Current billing period usage summary' })
  summary(@CurrentUser() user: User) {
    return this.service.getSummary(user.companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Usage history' })
  history(
    @CurrentUser() user: User,
    @Query('type') type?: UsageType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.service.getHistory(user.companyId, type, page, limit);
  }
}
