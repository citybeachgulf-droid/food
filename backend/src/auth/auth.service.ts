import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Gender, Prisma } from '@prisma/client';

interface RegisterDto {
  email: string;
  password: string;
  gender: Gender;
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const data: Prisma.UserCreateInput = {
      email: dto.email,
      passwordHash,
      gender: dto.gender,
    } as Prisma.UserCreateInput;
    const user = await this.users.create(data);
    return this.sign(user.id, user.email, user.gender);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user.id, user.email, user.gender);
  }

  private async sign(userId: string, email: string, gender: Gender) {
    const payload = { sub: userId, email, gender };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}

