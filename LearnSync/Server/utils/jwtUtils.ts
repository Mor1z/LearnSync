import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key_here';

/**
 * Генерация JWT-токена
 */
export const generateToken = (payload: object, expiresIn: string = '1h'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Проверка JWT-токена
 */
export const verifyToken = (token: string): object | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as object;
    } catch (error) {
        console.error('JWT verification error:', error);
        return null;
    }
};

/**
 * Декодирование JWT-токена без проверки подписи
 */
export const decodeToken = (token: string): object | null => {
    try {
        return jwt.decode(token) as object;
    } catch (error) {
        console.error('JWT decoding error:', error);
        return null;
    }
};