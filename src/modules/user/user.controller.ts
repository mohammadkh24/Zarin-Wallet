import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { get } from 'axios';
import { UserRole } from './types/types';
import { IsAdminGuard } from 'src/common/guards/isAdmin.guard';
import { authGuard } from 'src/common/guards/auth.guard';

@Controller('users')
@UseGuards(authGuard, IsAdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}


@Get("")
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: string,
  ) {
    return this.userService.findAll(page, limit, role);
  }

  @Get('/:userId')
  async getOneUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }

  @Patch('/:userId/role')
  async changeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('role') role: UserRole,
  ) {
    return this.userService.changeRole(userId , role)
  }

  @Delete('/:userId')
  async removeUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.removeUser(userId)
  }
}
