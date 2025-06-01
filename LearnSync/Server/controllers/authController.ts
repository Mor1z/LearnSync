// server/controllers/authController.ts

import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs'; // Для хеширования паролей
import * as jwt from 'jsonwebtoken'; // Для создания JWT
import * as dotenv from 'dotenv'; // Для загрузки переменных окружения
import { UserModel } from '../models/userModel'; // Модель пользователя

// Загружаем переменные окружения из .env
dotenv.config();

// Секретный ключ для подписи JWT
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Регистрация нового пользователя
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // Проверяем, существует ли пользователь с таким email
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });

        // Сохраняем пользователя в базе данных
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: { username, email } });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Вход пользователя в систему
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Находим пользователя по email
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Создаем JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Выход пользователя из системы
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Для простого решения можно просто удалить токен на стороне клиента
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

