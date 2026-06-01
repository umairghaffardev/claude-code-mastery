import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

// PartialType makes all CreateTaskDto fields optional.
// This is the standard NestJS pattern for update DTOs.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
