import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserEntity } from '../user/entities/user.entity';
import nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {AuthMessage} from "../../common/enums/messages"

@Injectable()
export class SmsService {
  private readonly smsApiUrl = 'http://ippanel.com/api/select'; // نسخه 1 با پترن

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async sendMobileOtp(phone: string, otp: string) {
    const smsConfig = this.configService.get('sms');
    const username = smsConfig?.SMS_USERNAME;
    const password = smsConfig?.SMS_PASSWORD;
    const fromNum = smsConfig?.SMS_FROM;
    const patternCode = smsConfig?.VERIFY_PATTERN_CODE;
  
    if (!username || !password || !fromNum || !patternCode) {
      throw new InternalServerErrorException(AuthMessage.SMS_CONFIG_MISSING);
    }
  
    const payload = {
      op: 'pattern',
      user: username,
      pass: password,
      fromNum,
      toNum: phone,
      patternCode,
      inputData: [{ 'verification-code': otp }],
    };
  
    try {
      const response = await axios.post(this.smsApiUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const smsId = Array.isArray(response.data) ? response.data[0] : response.data;
  
      if (!isNaN(Number(smsId))) {
        return { success: true, message: AuthMessage.OTP_SENT, smsId };
      } else {
        throw new InternalServerErrorException(AuthMessage.SMS_FAILED);
      }
    } catch (error) {
      console.error('SMS Error:', error.response?.data || error.message);
      throw new InternalServerErrorException(AuthMessage.SMS_FAILED);
    }
  }
  
}
