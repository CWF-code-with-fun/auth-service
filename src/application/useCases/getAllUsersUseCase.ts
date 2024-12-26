// useCases/getAllUsersUseCase.ts

import { UserService } from "../../domain/services/UserService";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";


export class GetAllUsersUseCase {
        private userService: UserService;
    
        constructor() {
            const userRepository = new PrismaUserRepository();
            this.userService = new UserService(userRepository);
        }

     execute() {
        return  this.userService.findAllUsers();
    }
}