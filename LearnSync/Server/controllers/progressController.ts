// server/controllers/progressController.ts

import { Request, Response } from 'express';
import { ProgressModel } from '../models/progressModel'; // Модель прогресса

// Получить прогресс пользователя по ID
export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const progress = await ProgressModel.find({ user: userId })
            .populate('lesson', 'title') // Подтягиваем данные урока
            .populate('course', 'title'); // Подтягиваем данные курса

        if (!progress || progress.length === 0) {
            res.status(404).json({ message: 'No progress found for this user' });
            return;
        }

        res.status(200).json({ message: 'User progress retrieved successfully', progress });
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Обновить прогресс пользователя по уроку
export const updateProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, lessonId, completed } = req.body;

        // Находим существующий прогресс пользователя по уроку
        let progress = await ProgressModel.findOne({ user: userId, lesson: lessonId });

        if (!progress) {
            // Если прогресса нет, создаем новый
            progress = new ProgressModel({
                user: userId,
                lesson: lessonId,
                completed,
            });
        } else {
            // Если прогресс уже существует, обновляем его
            progress.completed = completed;
        }

        await progress.save();

        res.status(200).json({ message: 'Progress updated successfully', progress });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};