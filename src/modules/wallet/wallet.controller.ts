import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateDepositDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateWithdreawDto } from './dto/withdraw-dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  deposit(@Body() depositdto: CreateDepositDto) {
    return this.walletService.deposit(depositdto);
  }
  @Post('withdraw')
  withdraw(@Body() withdrawDto: CreateWithdreawDto) {
    return this.walletService.withdraw(withdrawDto);
  }

    // ✅ این endpoint برای callback زرین‌پال
    @Get('verify')
    async verify(
      @Query('Authority') authority: string,
      @Query('Status') status: string,
    ) {
      if (status !== 'OK') {
        throw new BadRequestException('Payment failed or canceled by user');
      }
  
      return this.walletService.verify(authority  );
    }
}
