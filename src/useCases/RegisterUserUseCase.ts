import { UserService } from '../domain/services/UserService';
import { Email } from '../domain/valueObjects/Email';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';

export class RegisterUserUseCase {
    private userService: UserService;
    constructor() {
        const userRepository = new PrismaUserRepository();
        this.userService = new UserService(userRepository);
    }

    async execute(email: string, password: string) {
        const emailVO = new Email(email);
        return this.userService.registerUser(emailVO, password);
    }
}
