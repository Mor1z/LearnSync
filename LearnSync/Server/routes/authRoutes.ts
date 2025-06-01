// server/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';

// Загружаем переменные окружения из .env
dotenv.config();

// Расширяем интерфейс Request для добавления свойства user
declare module 'express' {
    interface Request {
        user?: any; // Можно заменить 'any' на конкретный тип пользователя
    }
}

// Секретный ключ для подписи JWT
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

/**
 * Middleware для проверки аутентификации через JWT
 */
export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.userId) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
