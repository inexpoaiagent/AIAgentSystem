import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { AgentsModule } from './agents/agents.module';
import { AgentTasksModule } from './agent-tasks/agent-tasks.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { MemoriesModule } from './memories/memories.module';
import { VoiceModule } from './voice/voice.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsageModule } from './usage/usage.module';
import { AuditModule } from './audit/audit.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { BusinessDoctorModule } from './business-doctor/business-doctor.module';
import { AdminModule } from './admin/admin.module';
import { PacksModule } from './packs/packs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    AuthModule,
    CompaniesModule,
    WorkspaceModule,
    AgentsModule,
    AgentTasksModule,
    WorkflowsModule,
    MemoriesModule,
    VoiceModule,
    SubscriptionsModule,
    UsageModule,
    AuditModule,
    EventsModule,
    ChatModule,
    BusinessDoctorModule,
    AdminModule,
    PacksModule,
  ],
})
export class AppModule {}
