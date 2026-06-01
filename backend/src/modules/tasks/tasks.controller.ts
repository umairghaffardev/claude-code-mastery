import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  AuthUser,
} from '../../common/decorators/current-user.decorator';

// Controller handles HTTP only — all business logic lives in TasksService.
// The { data, error, meta } envelope is applied globally by TransformInterceptor,
// so handlers return raw entities.
@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.tasksService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.create(dto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.tasksService.remove(id, user.id);
  }
}
