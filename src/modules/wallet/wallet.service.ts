import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import axios from 'axios';
import { Wallet } from './entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';
import { walletType } from './entities/wallet.enum';
import { UserService } from '../user/user.service';
import { CreateDepositDto } from './dto/create-wallet.dto';
import { CreateWithdreawDto } from './dto/withdraw-dto';
import { ZarinpalService } from 'src/common/utils/zarinpal.util';
import { userMessages, walletMessage } from 'src/enums/messages';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private userService: UserService,
    @InjectDataSource() private dataSource: DataSource,
    private zarinpal: ZarinpalService,
  ) {}

  async deposit(depositDto: CreateDepositDto) {
   try {
    const { mobile, fullname, amount } = depositDto;
    const user = await this.userService.findOrCreateUser({ mobile, fullname });
    const invoiceNumber = Math.floor(1000 + Math.random() * 9000).toString(); 


    const { authority, url } = await this.zarinpal.requestPayment({
      amount,
      description: `شارژ کیف پول برای ${fullname}`,
      metadata: { mobile },
    });

    await this.walletRepo.save({
      amount,
      type: walletType.Deposit,
      userId: user.id,
      invoice_number:invoiceNumber,
      isPaid: false,
      authority
    });

    return { url, authority  };
   } catch (error) {
    console.log(error);
    throw new BadRequestException(error)
    
   }
  }

  async verify(authority: string) {
    try {
      const transaction = await this.walletRepo.findOneBy({
        authority
       });
       
   
       if (!transaction) throw new NotFoundException(walletMessage.TRANSACTION_NOT_FOUND);
   
       const user = await this.userService.findOne(transaction.userId);
       if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);
   
       const data = await this.zarinpal.verifyPayment(
         transaction.authority,
         transaction.amount,
       );
   
       if (data.code === 100) {
         const queryRunner = this.dataSource.createQueryRunner();
         await queryRunner.connect();
   
         try {
           await queryRunner.startTransaction();
   
           const newBalance =
             Number(user.balance ?? 0) + Number(transaction.amount);
   
           await queryRunner.manager.update(
             UserEntity,
             { id: user.id },
             { balance: newBalance },
           );
           await queryRunner.manager.update(
             Wallet,
             { id: transaction.id },
             { isPaid: true },
           );
   
           await queryRunner.commitTransaction();
   
           return {
             message: walletMessage.TRANSACTION_SUCCESS,
             ref_id: data.ref_id,
             invoice_number : transaction.invoice_number,
             newBalance : Number(newBalance).toLocaleString('en-US')
           };
         } catch (err) {
           // rollback فقط اگر تراکنش شروع شده باشد
           if (queryRunner.isTransactionActive) {
             await queryRunner.rollbackTransaction();
           }
           throw new BadRequestException(walletMessage.TRANSACTION_DB_ERROR);
         } finally {
           await queryRunner.release();
         }
       }
   
       return { message: walletMessage.TRANSACTION_ERROR };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error)
      
    }
  }

  async withdraw(withdrawDto: CreateWithdreawDto) {
    const { mobile, fullname, amount } = withdrawDto;

    const user = await this.userService.findOrCreateUser({ mobile, fullname });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userData = await queryRunner.manager.findOneBy(UserEntity, {
        id: user.id,
      });
      if (!userData) throw new NotFoundException(userMessages.USER_NOT_FOUND);
      if ((userData.balance ?? 0) < amount)
        throw new BadRequestException(walletMessage.INSUFFICIENT_BALANCE_WALLET);

      const invoiceNumber = Math.floor(1000 + Math.random() * 9000).toString()
      const newBalance = userData.balance - amount;

      await queryRunner.manager.update(
        UserEntity,
        { id: user.id },
        { balance: newBalance },
      );
      await queryRunner.manager.insert(Wallet, {
        amount,
        type: walletType.Withdraw,
        invoice_number: invoiceNumber,
        userId: user.id,
        isPaid: true,
      });

      await queryRunner.commitTransaction();

      return {
        message: walletMessage.WITHDRAW_SUCCESSFULL,
        data: {
          userId: user.id,
          amount : String(`-${amount}`),
          oldBalance: Number(userData.balance).toLocaleString('en-US'),
          newBalance : Number(newBalance).toLocaleString('en-US'),
          invoiceNumber
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
