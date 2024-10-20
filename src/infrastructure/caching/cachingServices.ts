import { createClient } from 'redis';

export class CacheService {
    private client = createClient();

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }
}
