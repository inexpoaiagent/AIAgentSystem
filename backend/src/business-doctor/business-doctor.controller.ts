import { Controller, Post, Get, Body, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BusinessDoctorService } from './business-doctor.service';
import { User } from '@prisma/client';

class AnalyzeDto {
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() youtube?: string;
}

class CeoQuestionDto {
  @IsString() question: string;
  @IsOptional() @IsNumber() healthScore?: number;
  @IsOptional() @IsString() diagnosisSummary?: string;
}

@ApiTags('Business Doctor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('business-doctor')
export class BusinessDoctorController {
  constructor(private readonly service: BusinessDoctorService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Full AI Business Doctor analysis (crawl + LLM)' })
  analyze(@CurrentUser() user: User, @Body() dto: AnalyzeDto) {
    return this.service.analyze(user.companyId, user.id, {
      industry: dto.industry ?? '',
      website: dto.website ?? '',
      instagram: dto.instagram ?? '',
      facebook: dto.facebook ?? '',
      youtube: dto.youtube ?? '',
    });
  }

  @Post('stream')
  @ApiOperation({ summary: 'Streaming Business Doctor analysis (SSE)' })
  async stream(@CurrentUser() user: User, @Body() dto: AnalyzeDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    for await (const chunk of this.service.streamAnalysis(user.companyId, {
      industry: dto.industry ?? '',
      website: dto.website ?? '',
      instagram: dto.instagram ?? '',
      facebook: dto.facebook ?? '',
      youtube: dto.youtube ?? '',
    })) {
      res.write(chunk);
    }

    res.end();
  }

  @Post('ceo-question')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ask CEO Agent a growth question' })
  ceoQuestion(@CurrentUser() user: User, @Body() dto: CeoQuestionDto) {
    return this.service.askCeo(
      user.companyId,
      dto.question,
      dto.healthScore ?? 0,
      dto.diagnosisSummary ?? '',
    );
  }

  @Get('last-analysis')
  @ApiOperation({ summary: 'Get last Business Doctor result from company memory' })
  lastAnalysis(@CurrentUser() user: User) {
    return this.service.getLastAnalysis(user.companyId);
  }
}
