import { IsPhoneNumber, IsString, Length, Matches } from 'class-validator';

export class sendOtpDto {
  @IsString()
  @IsPhoneNumber("IR")
  mobile:string;
}

export class checkOtpDto {
  @IsString()
  @IsPhoneNumber("IR")
  mobile: string;

  @IsString()
  @Length(4, 4, { message: 'کد OTP باید ۴ رقمی باشد' })
  code: string;
}