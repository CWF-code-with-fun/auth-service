import { SsoRepository } from '../../domain/repositories/ssoRepository';

export class SsoUseCase {
    private ssoRepository: SsoRepository;
    constructor() {
        this.ssoRepository = new SsoRepository();
    }

    async execute(): Promise<void> {
        const sso = await this.ssoRepository.get();
        if (!sso) {
            throw new Error('SSO not found');
        }
        // do something
    }
}
