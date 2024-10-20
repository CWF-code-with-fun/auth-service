import fs from 'fs';
import path from 'path';

export class FileSystemService {
    async readFile(filePath: string): Promise<string> {
        return fs.promises.readFile(path.resolve(filePath), 'utf-8');
    }

    async writeFile(filePath: string, data: string): Promise<void> {
        await fs.promises.writeFile(path.resolve(filePath), data, 'utf-8');
    }
}
