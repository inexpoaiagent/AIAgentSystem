import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VoiceService } from './voice.service';
import { User } from '@prisma/client';

class EndSessionDto {
  @IsInt() @Min(0) durationSeconds: number;
}

@ApiTags('Voice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('voice')
export class VoiceController {
  constructor(private readonly service: VoiceService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create voice session and get provider token (matches POST /v1/voice/sessions)' })
  create(@CurrentUser() user: User) {
    return this.service.createSession(user.id, user.companyId);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List voice sessions' })
  list(@CurrentUser() user: User) {
    return this.service.listSessions(user.id);
  }

  @Put('sessions/:id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End a voice session and record usage' })
  end(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: EndSessionDto) {
    return this.service.endSession(id, user.id, dto.durationSeconds);
  }
}
