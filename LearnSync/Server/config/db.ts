// server/config/db.ts

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения из .env
dotenv.config();

// URI для подключения к базе данных (берется из переменных окружения)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-learning-platform';

// Функция для подключения к базе данных
const connectDB = async (): Promise<void> => {
    try {
        // Подключение к MongoDB
        await mongoose.connect(MONGO_URI);

        console.log('MongoDB connected successfully ✅');
    } catch (error) {
        console.error('MongoDB connection error ❌:', error);

        // Если возникла ошибка, завершаем процесс с кодом 1
        process.exit(1);
    }
};

export default connectDB;