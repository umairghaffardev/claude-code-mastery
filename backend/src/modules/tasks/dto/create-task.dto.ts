import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, Priority } from '@prisma/client';

// DTOs define the shape of incoming request bodies.
// class-validator decorators enforce rules at runtime.
// NestJS ValidationPipe strips any properties not in the DTO (whitelist: true).
//
// Enums are imported from @prisma/client so there is ONE source of truth
// (the Prisma schema). Re-declaring local enums would create a distinct
// nominal type that does not assign to Prisma's generated create input.

export class CreateTaskDto {
  @ApiPropertyOptional({ example: 'Learn Claude Code MCP integration' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Study the Postgres MCP server docs' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
