import { IsString, IsArray, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalMode } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Improve SEO for landing page' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  message: string;

  @ApiPropertyOptional({ example: ['seo', 'content'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  agentSlugs?: string[];

  @ApiProperty({ enum: ApprovalMode, default: ApprovalMode.MANUAL })
  @IsEnum(ApprovalMode)
  approvalMode: ApprovalMode;
}
