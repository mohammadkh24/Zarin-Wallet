import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { authGuard } from 'src/common/guards/auth.guard';
import { IsAdminGuard } from 'src/common/guards/isAdmin.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(authGuard, IsAdminGuard)
  @Get('')
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.transactionsService.findAll(page, limit);
  }

  @UseGuards(authGuard, IsAdminGuard)
  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(id);
  }

 
  @UseGuards(authGuard)
  @Get('/me')
  getUserTransactions(@Req() req: any) {
    return this.transactionsService.getUserTransActions(req.user.id);
  }
   
  @UseGuards(authGuard, IsAdminGuard)
  @Get('/:id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.getOne(id);
  }

}
