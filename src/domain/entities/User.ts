import { Email } from '../valueObjects/Email';

export class User {
    constructor(
        public id: number,
        public email: Email,
        public password: string,
        public refreshToken?: string,
        public name?: string,

    ) {}

    changeEmail(newEmail: Email) {
        this.email = newEmail;
    }

    changePassword(newPassword: string) {
        this.password = newPassword;
    }

    setRefreshToken(refreshToken: string) {
        this.refreshToken = refreshToken;
    }
}
