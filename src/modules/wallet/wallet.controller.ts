import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateDepositDto } from './dto/create-wallet.dto';
import { CreateWithdreawDto } from './dto/withdraw-dto';
import { authGuard } from 'src/common/guards/auth.guard';
import { IsAdminGuard } from 'src/common/guards/isAdmin.guard';
import { UserService } from '../user/user.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(authGuard)
  @Post('deposit')
  deposit(@Body() depositdto: CreateDepositDto, @Req() req: any) {
    return this.walletService.deposit(depositdto, req.user.id);
  }

  @UseGuards(authGuard)
  @Post('withdraw')
  withdraw(@Body() withdrawDto: CreateWithdreawDto , @Req() req: any) {
    return this.walletService.withdraw(withdrawDto , req.user.id);
  }

  @Get('verify')
  async verify(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
  ) {
    if (status !== 'OK') {
      throw new BadRequestException('Payment failed or canceled by user');
    }

    return this.walletService.verify(authority);
  }
}
