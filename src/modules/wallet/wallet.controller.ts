import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateDepositDto } from './dto/create-wallet.dto';
import { CreateWithdreawDto } from './dto/withdraw-dto';
import { authGuard } from 'src/common/guards/auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(authGuard)
  @Post('deposit')
  deposit(@Body() depositdto: CreateDepositDto) {
    return this.walletService.deposit(depositdto);
  }

  @UseGuards(authGuard)
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
