import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Implemented in PROMPT.md Task 2 using the task-manager Skill.
//
// Patterns enforced here:
// 1. Ownership — every method scopes by userId so users only touch their rows.
// 2. NotFoundException — NestJS auto-maps this to HTTP 404.
// 3. PrismaService — injected via constructor (NestJS DI).
// 4. No raw SQL — all queries go through Prisma's parameterized client.
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    // findFirst (not findUnique) so the userId filter is part of the lookup —
    // this is both the existence check AND the ownership check in one query.
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    // `title` is runtime-required by the DTO's @MinLength(1) validator, but is
    // typed `string | undefined`. Narrow it explicitly so Prisma's required
    // `title` is satisfied without an unsafe non-null assertion.
    if (!dto.title) {
      throw new BadRequestException('title is required');
    }
    return this.prisma.task.create({
      data: { ...dto, title: dto.title, userId },
    });
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    await this.findOne(id, userId); // ownership check — throws 404 if not owned
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string): Promise<Task> {
    await this.findOne(id, userId); // ownership check — throws 404 if not owned
    return this.prisma.task.delete({ where: { id } });
  }
}
