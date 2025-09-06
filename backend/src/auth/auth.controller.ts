import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

class RegisterBody {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Gender)
  gender: Gender;
}

class LoginBody {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBody) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: LoginBody) {
    return this.auth.login(body);
  }
}

