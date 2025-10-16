import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [SmsService],
exports : [SmsService]
})
export class SmsModule {}
