import { Controller, Get, Put, Delete, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlan, BillingCycle } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { User } from '@prisma/client';

class ChangePlanDto {
  @IsEnum(SubscriptionPlan) plan: SubscriptionPlan;
  @IsOptional() @IsEnum(BillingCycle) billingCycle?: BillingCycle;
}

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current subscription with limits' })
  get(@CurrentUser() user: User) {
    return this.service.get(user.companyId);
  }

  @Put('plan')
  @ApiOperation({ summary: 'Change subscription plan' })
  changePlan(@CurrentUser() user: User, @Body() dto: ChangePlanDto) {
    return this.service.changePlan(user.companyId, dto.plan, dto.billingCycle ?? 'MONTHLY');
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@CurrentUser() user: User) {
    return this.service.cancel(user.companyId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List billing invoices' })
  invoices(@CurrentUser() user: User) {
    return this.service.getInvoices(user.companyId);
  }
}
