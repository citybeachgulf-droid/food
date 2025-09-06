import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Gender } from '@prisma/client';
interface RegisterDto {
    email: string;
    password: string;
    gender: Gender;
}
interface LoginDto {
    email: string;
    password: string;
}
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    private sign;
}
export {};
