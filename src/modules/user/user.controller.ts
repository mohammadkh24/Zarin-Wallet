import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { get } from 'axios';
import { UserRole } from './types/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getAll();
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
  async removeUser(@Param('userId', ParseIntPipe) userId: number) {}
}
