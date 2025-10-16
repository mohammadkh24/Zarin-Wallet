import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { throwError } from 'rxjs';
import { CreateDepositDto } from '../wallet/dto/create-wallet.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();

    return user;
  }

  async findOrCreateUser({ mobile  }: { mobile: string }) {
    let user = await this.userRepository.findOne({ where: { mobile  } });

    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد');
    }

    return user;
  }
}
