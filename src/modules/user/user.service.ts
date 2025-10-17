import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { throwError } from 'rxjs';
import { CreateDepositDto } from '../wallet/dto/create-wallet.dto';
import { UserRole } from './types/types';
import { ServerMessage, userMessages } from 'src/common/enums/messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(page: number, limit: number, role?: string) {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (role) where.roles = Like(`%${role}%`);

      const [data, totalItems] = await this.userRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

      return {
        data,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    
  }
  async findOne(id: number) {

    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);

    return user

  }

  async changeRole(id: number, role: UserRole) {
   
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(userMessages.USER_NOT_FOUND)
    }

    user.role = role
    await this.userRepository.save(user)

    return {
      message : userMessages.USER_ROLE_CHANGED
    }
  }

  async removeUser(id : number) {

    const user = await this.userRepository.findOneBy({id})

    if (!user) {
      throw new NotFoundException(userMessages.USER_NOT_FOUND)
    }

    await this.userRepository.delete(id)
    return {
      message : userMessages.USER_REMOVED
    }
  } 


  async findOrCreateUser({ mobile }: { mobile: string }) {
      let user = await this.userRepository.findOne({ where: { mobile } });

    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد');
    }

    return user;
    
  }
}