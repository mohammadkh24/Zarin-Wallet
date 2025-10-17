import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { ServerMessage, userMessages, walletMessage } from 'src/common/enums/messages';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private userService: UserService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      const [data, totalItems] = await this.walletRepo.findAndCount({
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
    } catch (error) {
      throw new BadRequestException(ServerMessage.SERVER_ERROR);
    }
  }

  async getOne(id: number) {
    const transaction = await this.walletRepo.findOneBy({ id });

    if (!transaction) {
      throw new NotFoundException(walletMessage.TRANSACTION_NOT_FOUND);
    }

    return {
      data: {
        transaction,
      },
    };
  }

  async remove(id: number) {
    const transaction = await this.walletRepo.findOneBy({ id });

    if (!transaction) {
      throw new NotFoundException(walletMessage.TRANSACTION_NOT_FOUND);
    }

    await this.walletRepo.delete(id);

    return {
      message: walletMessage.TRANSACTION_REMOVED,
    };
  }

  async getUserTransActions(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);

    const userTransActions = await this.walletRepo.find({
      where: { userId: user.id },
      order: { created_at: 'DESC' },
    });

    return { data: userTransActions };
  }
}
