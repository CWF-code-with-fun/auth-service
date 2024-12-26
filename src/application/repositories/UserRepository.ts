import { User } from '../../domain/entities/User';

class UserRepository {
    private users: User[];

    constructor() {
        this.users = [];
    }

    public getAllUsers(): User[] {
        return this.users;
    }

    public getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    public addUser(user: User): void {
        this.users.push(user);
    }

    public updateUser(user: User): void {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
    }

    public deleteUser(id: number): void {
        this.users = this.users.filter(user => user.id !== id);
    }
}

export { UserRepository };