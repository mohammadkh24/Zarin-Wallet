import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SmsService } from '../sms/sms.service';
import { randomInt } from 'crypto';
import { sendOtpDto, checkOtpDto  } from './dto/auth.dto';
import { AuthMessage, userMessages } from 'src/common/enums/messages';
import { UserRole } from '../user/types/types';
import { generateUniqueId } from 'src/common/utils/uniqueId.util';
import { TokensPayload } from './types/payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity)
    private readonly otpRepository: Repository<OTPEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly smsService: SmsService,
  ) {}

  // ارسال OTP
  async sendOtp(dto: sendOtpDto) {
    const { mobile } = dto;

    let user = await this.userRepository.findOneBy({ mobile });
    const userCount = await this.userRepository.count();

    // اگر کاربر وجود نداشت، بسازش
    if (!user) {
      const newUserId = await generateUniqueId(this.userRepository);
      user = this.userRepository.create({
        id: newUserId,
        mobile,
        role: userCount > 0 ? UserRole.USER : UserRole.ADMIN,
        mobileVerify: false,
      });
      await this.userRepository.save(user);
    }

    await this.createOtpForUser(user);
    return { message: AuthMessage.OTP_SENT};
  }

  // بررسی OTP
  async checkOtp(dto: checkOtpDto) {
    const { mobile, code } = dto;

    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: { otp: true },
    });

    if (!user || !user.otp)
      throw new BadRequestException(AuthMessage.INVALID_IDENTIFIER);

    if (String(user.otp.code) !== String(code))
      throw new BadRequestException(AuthMessage.INVALID_OTP);
    
    const now = new Date();
    if (user.otp.expires_in < now) {
      // اول null کن، بعد حذف
      const otpId = user.otpId!;
      user.otpId = null;
      user.otp = null;
      await this.userRepository.save(user);
      await this.otpRepository.delete({ id: otpId });
      throw new BadRequestException(AuthMessage.OTP_EXPIRED);
    }
    
    // تایید موفق
    user.mobileVerify = true;
    
    // همینجا هم OTP رو پاک کن به ترتیب درست
    const otpId = user.otpId!;
    user.otpId = null;
    user.otp = null;
    await this.userRepository.save(user);
    await this.otpRepository.delete({ id: otpId });
    
    // تولید توکن‌ها
    const tokens = await this.makeTokenForUser({
      id: user.id!,
      mobile: user.mobile!,
    });

    return { message: AuthMessage.LOGIN_SUCCESS, data: tokens };
  }

  // رفرش توکن
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshTokenSecret'),
      });

      if (!payload?.id)
        throw new BadRequestException(AuthMessage.INVALID_TOKEN);

      const user = await this.userRepository.findOneBy({ id: payload.id });
      if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);

      const tokens = await this.makeTokenForUser({
        id: user.id!,
        mobile: user.mobile!,
      });

      return { message: AuthMessage.TOKENS_REFRESHED, data: tokens };
    } catch {
      throw new BadRequestException(AuthMessage.INVALID_REFRESH_TOKEN);
    }
  }

  // دریافت اطلاعات کاربر
  async getMe(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);

    delete user.token;
    return { data: user };
  }

  // ایجاد OTP
  private async createOtpForUser(user: UserEntity) {
    const code = randomInt(1000, 10000).toString();
    const expiresIn = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه

    let otp = await this.otpRepository.findOneBy({ userId: user.id });

    if (otp && otp.expires_in > new Date()) {
      throw new BadRequestException(AuthMessage.OTP_NOT_EXPIRED);
    }

    otp = this.otpRepository.create({
      code,
      expires_in: expiresIn,
      userId: user.id,
    });

    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;

    await this.smsService.sendMobileOtp(user.mobile!, code);
    await this.userRepository.save(user);

    return { message: AuthMessage.OTP_CREATED };
  }

  // ساخت توکن
  private async makeTokenForUser(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.accessTokenSecret'),
      expiresIn: '30d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshTokenSecret'),
      expiresIn: '1y',
    });

    return { accessToken, refreshToken };
  }

  // اعتبارسنجی توکن دسترسی
  async validateAccessToken(token: string): Promise<UserEntity | null> {
    try {
      const payload = this.jwtService.verify<{ id: number; mobile?: string }>(
        token,
        { secret: this.configService.get('jwt.accessTokenSecret') },
      );
      if (!payload?.id) return null;
      return await this.userRepository.findOneBy({ id: payload.id });
    } catch {
      throw new UnauthorizedException(AuthMessage.TOKEN_EXPIRED);
    }
  }
}
