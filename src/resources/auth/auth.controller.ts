import {
  Controller,
  Request as Req,
  Response as Res,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SkipJwtauth } from '../../common/decorators/skip-jwtauth/skip-jwtauth.decorator';
import { SignupDto } from './dto/signup.dto';
import { UserDocument } from '../users/schemas/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipJwtauth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user as UserDocument);
  }

  @SkipJwtauth()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @SkipJwtauth()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: Request) {}

  @SkipJwtauth()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const jwt = await this.authService.login(req.user as UserDocument);
    res.redirect(`http://localhost:3000?token=${jwt.access_token}`);
  }
}
