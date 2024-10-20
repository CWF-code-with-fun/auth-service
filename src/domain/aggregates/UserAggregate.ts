import { User } from '../entities/User';
import { Email } from '../valueObjects/Email';

export class UserAggregate {
    constructor(private user: User) {}

    changeEmail(newEmail: Email) {
        this.user.changeEmail(newEmail);
    }

    changePassword(newPassword: string) {
        this.user.changePassword(newPassword);
    }

    setRefreshToken(refreshToken: string) {
        this.user.setRefreshToken(refreshToken);
    }

    getUser(): User {
        return this.user;
    }
}
