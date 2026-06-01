---
name: task-manager
description: >
  Use this skill when creating, scaffolding, or modifying Task-related features.
  Triggers on: "add task feature", "create task CRUD", "scaffold tasks module",
  "build task form", "task management", "TODO list feature".
---

# Task Manager Skill

This skill encodes the conventions for the Task Manager feature in this project.

## Prisma Schema Pattern

```prisma
model Task {
  id          String      @id @default(cuid())
  title       String
  description String?
  status      TaskStatus  @default(TODO)
  priority    Priority    @default(MEDIUM)
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## NestJS Module Pattern

Each module must have: `module.ts`, `controller.ts`, `service.ts`, `dto/create-X.dto.ts`, `dto/update-X.dto.ts`

### DTO Pattern (create-task.dto.ts)
```typescript
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM;
}
```

### Service Pattern (tasks.service.ts)
```typescript
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({ data: { ...dto, userId } });
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId); // ownership check
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // ownership check
    return this.prisma.task.delete({ where: { id } });
  }
}
```

### Controller Pattern (tasks.controller.ts)
```typescript
@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAll(user.id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user.id);
  }
}
```

## Frontend Pattern

### Zod Schema
```typescript
// lib/schemas/task.schema.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
```

### Form Pattern (react-hook-form + zod)
```typescript
// components/features/task-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, CreateTaskInput } from '@/lib/schemas/task.schema';

export function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { status: 'TODO', priority: 'MEDIUM' },
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      form.reset();
      onSuccess();
    } catch (err) {
      form.setError('root', { message: 'Failed to create task' });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Use shadcn/ui Form, FormField, FormItem, FormControl */}
    </form>
  );
}
```

## Status Badge Colors
```typescript
const statusColors = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};
```

## API Response Envelope
All API responses must follow:
```json
{
  "data": { ... },
  "error": null,
  "meta": { "timestamp": "ISO string" }
}
```
