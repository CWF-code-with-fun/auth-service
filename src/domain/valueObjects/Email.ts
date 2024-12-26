export class Email {
    private readonly value: string;

    constructor(value: string | Email) {
        if (value instanceof Email) {
            this.value = value.getValue();
        } else {
            if (!this.isValidEmail(value)) {
                throw new Error('Invalid email address');
            }
            this.value = value;
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
