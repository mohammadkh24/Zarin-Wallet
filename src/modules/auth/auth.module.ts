import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SmsService } from '../sms/sms.service';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity , OTPEntity]) , SmsModule ],
  controllers: [AuthController],
  providers: [AuthService , JwtService , SmsService],
  exports : [AuthService  , JwtService , TypeOrmModule]
})
export class AuthModule {}
