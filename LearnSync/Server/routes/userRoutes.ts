// server/routes/userRoutes.ts

import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { authenticateUser } from '../middleware/authMiddleware';
import * as dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();
const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret_key';
const USERS_FILE: string = path.join(__dirname, '../../data/users.json');

interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at?: string;
}

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
    };
}

const readUsers = (): User[] => {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]', 'utf8');
        return [];
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
};

const writeUsers = (users: User[]): void => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

// Регистрация
router.post('/register',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }

            const users = readUsers();
            if (users.some(u => u.email === email)) {
                res.status(400).json({ message: 'User with this email already exists' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser: User = {
                id: Date.now(),
                username,
                email,
                password_hash: hashedPassword,
                created_at: new Date().toISOString(),
            };

            users.push(newUser);
            writeUsers(users);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            next(error);
        }
    }
);

// Логин
router.post('/login',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            const users = readUsers();
            const user = users.find(u => u.email === email);
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } catch (error) {
            next(error);
        }
    }
);

// Профиль
router.get('/profile', authenticateUser,
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.userId;

            if (!userId) {
                res.status(403).json({ message: 'User not authenticated' });
                return;
            }

            const users = readUsers();
            const user = users.find(u => u.id === Number(userId));

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const { password_hash, ...userData } = user;
            res.json({ message: 'Profile retrieved successfully', user: userData });
        } catch (error) {
            next(error);
        }
    }
);

// Обновление профиля
router.put('/profile', authenticateUser,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.userId;

            if (!userId) {
                res.status(403).json({ message: 'User not authenticated' });
                return;
            }

            const { username, email, password } = req.body;
            if (!username && !email && !password) {
                res.status(400).json({ message: 'At least one field is required' });
                return;
            }

            const users = readUsers();
            const userIndex = users.findIndex(u => u.id === Number(userId));
            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const updatedUser = { ...users[userIndex] };
            if (username) updatedUser.username = username;
            if (email) updatedUser.email = email;
            if (password) {
                updatedUser.password_hash = await bcrypt.hash(password, 10);
            }

            updatedUser.updated_at = new Date().toISOString();
            users[userIndex] = updatedUser;
            writeUsers(users);

            const { password_hash, ...userData } = updatedUser;
            res.json({ message: 'Profile updated successfully', user: userData });
        } catch (error) {
            next(error);
        }
    }
);

export default router;