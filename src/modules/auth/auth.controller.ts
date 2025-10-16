import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { checkOtpDto, sendOtpDto } from './dto/auth.dto';
import { authGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send')
  sendOtp(@Body() otpDto: sendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }
  
  @Post('/verify')
  checkOtp(@Body() checkOtpDto: checkOtpDto) {
    return this.authService.checkOtp(checkOtpDto);
  }

  @UseGuards(authGuard)
  @Get("/me")
  getMe(@Req() req:any) {
    return this.authService.getMe(req.user.id)
  }


  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
