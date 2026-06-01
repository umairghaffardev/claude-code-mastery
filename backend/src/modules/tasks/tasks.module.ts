import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

// Scaffolded in PROMPT.md Task 2 via the task-manager Agent Skill.
// JwtModule is imported so JwtAuthGuard can inject JwtService for token
// verification. (ConfigModule is global, so ConfigService is already available.)
@Module({
  imports: [JwtModule.register({})],
  controllers: [TasksController],
  providers: [TasksService, JwtAuthGuard],
})
export class TasksModule {}
