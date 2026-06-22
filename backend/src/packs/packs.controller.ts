import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PacksService } from './packs.service';

@ApiTags('Industry Packs')
@Controller('packs')
export class PacksController {
  constructor(private readonly service: PacksService) {}

  @Get()
  @ApiOperation({ summary: 'List all active industry packs (public)' })
  list() {
    return this.service.listActive();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get pack by slug (public)' })
  async getOne(@Param('slug') slug: string) {
    const pack = await this.service.getBySlug(slug);
    if (!pack) throw new NotFoundException('Pack not found');
    return pack;
  }
}
