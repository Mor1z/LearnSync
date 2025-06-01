// custom.d.ts

import { Request } from 'express';

declare module 'express' {
    interface Request {
        user?: any; // Можно заменить 'any' на конкретный тип пользователя
    }
}