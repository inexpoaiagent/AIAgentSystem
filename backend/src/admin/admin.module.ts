import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PacksModule } from '../packs/packs.module';

@Module({
  imports: [PacksModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
