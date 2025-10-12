import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositDto } from './create-wallet.dto';

export class UpdateWalletDto extends PartialType(CreateDepositDto) {}
