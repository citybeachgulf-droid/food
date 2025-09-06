import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            gender: import("@prisma/client").$Enums.Gender;
            isKycVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
}
