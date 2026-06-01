import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../prisma/prisma.service';

// 🎯 LEARNING TARGET: The tester subagent (PROMPT.md Task 8) expands these tests.
// Run: claude → PROMPT.md Task 8 → researcher will find current best practices
// then tester will write comprehensive tests.

describe('TasksService', () => {
  let service: TasksService;
  let prisma: { task: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock } };

  const mockTask = {
    id: 'task-1',
    title: 'Learn Claude Code',
    description: 'Study all features',
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      task: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('returns tasks for a user', async () => {
      prisma.task.findMany.mockResolvedValue([mockTask]);

      // TODO: Uncomment after PROMPT.md Task 2 implements the service
      // const result = await service.findAll('user-1');
      // expect(result).toEqual([mockTask]);
      // expect(prisma.task.findMany).toHaveBeenCalledWith({
      //   where: { userId: 'user-1' },
      //   orderBy: { createdAt: 'desc' },
      // });

      expect(true).toBe(true); // Placeholder until service is implemented
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when task not found', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      // TODO: Uncomment after PROMPT.md Task 2
      // await expect(service.findOne('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);

      expect(true).toBe(true);
    });
  });

  // 🤖 The tester subagent will add: create, update, remove, authorization tests
});
