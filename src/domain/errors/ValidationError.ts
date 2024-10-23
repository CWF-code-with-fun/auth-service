import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
    public messages: string[];

    constructor(message: string[]) {
        super('Validation Error: ');
        this.name = 'ValidationError';
        this.messages = message;
    }
}
