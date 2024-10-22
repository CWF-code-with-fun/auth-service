import { DomainError } from './DomainError';

export class DatabaseError extends DomainError {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}
