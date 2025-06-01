// server/seedData.ts

import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// Путь к файлу с данными пользователей
const USERS_FILE = path.join(__dirname, '../data/users.json');

/**
 * Интерфейс пользователя
 */
interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at?: string;
}

/**
 * Генерация тестовых данных
 */
const generateSeedData = async (): Promise<User[]> => {
    const users: User[] = [];

    // Создаем несколько тестовых пользователей
    const testUsers = [
        { username: 'john_doe', email: 'john@example.com', password: 'password123' },
        { username: 'jane_smith', email: 'jane@example.com', password: 'securepass456' },
        { username: 'admin_user', email: 'admin@example.com', password: 'admin123' },
    ];

    for (const user of testUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        users.push({
            id: Date.now() + users.length, // Уникальный ID
            username: user.username,
            email: user.email,
            password_hash: hashedPassword,
            created_at: new Date().toISOString(),
        });
    }

    return users;
};

/**
 * Запись данных в файл
 */
const writeSeedData = async (): Promise<void> => {
    try {
        const seedData = await generateSeedData();
        fs.writeFileSync(USERS_FILE, JSON.stringify(seedData, null, 2), 'utf8');
        console.log('Seed data successfully written to users.json');
    } catch (error) {
        console.error('Error writing seed data:', error);
    }
};

// Выполняем запись данных
writeSeedData();