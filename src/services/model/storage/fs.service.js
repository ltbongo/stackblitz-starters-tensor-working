import fs from 'fs';
import path from 'path';

class FSService {
    ensureDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    }

    async writeFile(filePath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async writeJSON(filePath, data) {
        return this.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    async writeBuffer(filePath, buffer) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, Buffer.from(buffer), (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

export const fsService = new FSService();