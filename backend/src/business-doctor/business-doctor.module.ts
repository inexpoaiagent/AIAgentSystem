import { Module } from '@nestjs/common';
import { BusinessDoctorController } from './business-doctor.controller';
import { BusinessDoctorService } from './business-doctor.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [BusinessDoctorController],
  providers: [BusinessDoctorService],
})
export class BusinessDoctorModule {}
