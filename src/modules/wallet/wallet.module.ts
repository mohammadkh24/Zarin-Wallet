import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { walletType } from './entities/wallet.enum';
import { Wallet } from './entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ZarinpalService } from 'src/common/utils/zarinpal.util';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, UserEntity]) ],
  controllers: [WalletController],
  providers: [WalletService, UserService , ZarinpalService ],
})
export class WalletModule {}
