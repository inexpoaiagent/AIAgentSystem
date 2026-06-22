import { Controller, Get, Put, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CompaniesService } from './companies.service';
import { User } from '@prisma/client';

class ActivatePackDto {
  @IsNotEmpty() @IsString() packId!: string;
}

class UpdateCompanyDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() domain?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() youtube?: string;
  @IsOptional() @IsString() brandVoice?: string;
  @IsOptional() @IsString() locale?: string;
}

@ApiTags('Company')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('company')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current company profile' })
  get(@CurrentUser() user: User) {
    return this.service.findById(user.companyId);
  }

  @Put()
  @ApiOperation({ summary: 'Update company profile' })
  update(@CurrentUser() user: User, @Body() dto: UpdateCompanyDto) {
    return this.service.update(user.companyId, user.companyId, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Company usage statistics' })
  stats(@CurrentUser() user: User) {
    return this.service.getStats(user.companyId);
  }

  @Post('activate-pack')
  @ApiOperation({ summary: 'Activate an industry AI pack for the company' })
  activatePack(@CurrentUser() user: User, @Body() dto: ActivatePackDto) {
    return this.service.activatePack(user.companyId, dto.packId);
  }
}
