export class Email {
    constructor(private readonly value: string) {
        if (!this.isValidEmail(value)) {
            throw new Error('Invalid email address');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getValue(): string {
        return this.value;
    }
}
