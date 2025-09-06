import { AuthService } from './auth.service';
import { Gender } from '@prisma/client';
declare class RegisterBody {
    email: string;
    password: string;
    gender: Gender;
}
declare class LoginBody {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(body: RegisterBody): Promise<{
        accessToken: string;
    }>;
    login(body: LoginBody): Promise<{
        accessToken: string;
    }>;
}
export {};
