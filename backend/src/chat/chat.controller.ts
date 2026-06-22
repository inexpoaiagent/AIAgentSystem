import { Controller, Post, Get, Body, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChatService, ChatMessage } from './chat.service';
import { User } from '@prisma/client';

class ChatRequestDto {
  @IsString() message: string;
  @IsOptional() @IsString() sessionId?: string;
  @IsOptional() @IsArray() history?: ChatMessage[];
}

class SaveProviderDto {
  @IsString() provider: string;
  @IsString() model: string;
  @IsString() apiKey: string;
  @IsOptional() enabled?: boolean;
}

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post('stream')
  @ApiOperation({ summary: 'Stream multi-agent chat response (SSE)' })
  async stream(
    @CurrentUser() user: User,
    @Body() dto: ChatRequestDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      for await (const chunk of this.service.streamChat(
        user.companyId,
        user.id,
        dto.message,
        dto.sessionId,
        dto.history ?? [],
      )) {
        res.write(chunk);
      }
    } finally {
      res.end();
    }
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Non-streaming agent chat' })
  sync(@CurrentUser() user: User, @Body() dto: ChatRequestDto) {
    return this.service.syncChat(user.companyId, user.id, dto.message, dto.history ?? []);
  }

  @Get('llm-status')
  @ApiOperation({ summary: 'Get LLM provider configuration status' })
  llmStatus() {
    return this.service.getLlmStatus();
  }

  @Post('llm-provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save LLM provider API key' })
  saveLlmProvider(@Body() dto: SaveProviderDto) {
    return this.service.saveLlmProvider(dto.provider, dto.model, dto.apiKey, dto.enabled ?? true);
  }
}
