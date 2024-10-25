import { AuthRepository } from '../../domain/repositories/AuthRepository';

export class LogoutUseCase {
    private authRepository: AuthRepository;
    constructor() {
        this.authRepository = new AuthRepository();
    }

    async execute(): Promise<void> {
        await this.authRepository.logout();
    }
}
