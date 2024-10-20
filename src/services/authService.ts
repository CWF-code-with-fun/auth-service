import { RegisterUserUseCase } from '../useCases/RegisterUserUseCase';
import { LoginUserUseCase } from '../useCases/LoginUserUseCase';
import { RefreshTokenUseCase } from '../useCases/RefreshTokenUseCase';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';
import { UserService } from '../domain/services/UserService';

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

const registerUserUseCase = new RegisterUserUseCase();
const loginUserUseCase = new LoginUserUseCase();
const refreshTokenUseCase = new RefreshTokenUseCase(userService);

export class AuthService {
    async register(email: string, password: string) {
        return registerUserUseCase.execute(email, password);
    }

    async login(email: string, password: string) {
        return loginUserUseCase.execute(email, password);
    }

    async refreshToken(refreshToken: string) {
        return refreshTokenUseCase.execute(refreshToken);
    }
}
