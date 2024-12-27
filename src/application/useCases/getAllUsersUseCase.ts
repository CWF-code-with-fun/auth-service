import { UserService } from './../../domain/services/UserService';
// useCases/getAllUsersUseCase.ts

import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";


export class GetAllUsersUseCase {
        private userService: UserService;
    
        constructor() {
            const userRepository = new PrismaUserRepository();
            this.userService = new UserService(userRepository);
        }

        async execute({ offset, limit }: { offset: number; limit: number }) {
            return await this.userService.findAllUsers({ offset, limit });
        }
}