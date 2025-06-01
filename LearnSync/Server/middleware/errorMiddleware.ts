import { Request, Response, NextFunction } from 'express';

// Стандартная ошибка с сообщением и кодом
interface CustomError extends Error {
    statusCode?: number;
}

// Middleware обработки ошибок
const errorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Внутренняя ошибка сервера',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default errorMiddleware;
