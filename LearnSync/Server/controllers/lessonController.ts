// server/controllers/lessonController.ts

import { Request, Response } from 'express';
import { LessonModel } from '../models/lessonModel'; // Модель урока

// Получить все уроки
export const getAllLessons = async (req: Request, res: Response): Promise<void> => {
    try {
        const lessons = await LessonModel.find().populate('course', 'title'); // Подтягиваем данные курса
        res.status(200).json({ message: 'Lessons retrieved successfully', lessons });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Получить урок по ID
export const getLessonById = async (req: Request, res: Response): Promise<void> => {
    try {
        const lessonId = req.params.id;

        const lesson = await LessonModel.findById(lessonId).populate('course', 'title');
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }

        res.status(200).json({ message: 'Lesson retrieved successfully', lesson });
    } catch (error) {
        console.error('Error fetching lesson by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Создать новый урок
export const createLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, course } = req.body;

        // Проверяем, существует ли курс с указанным ID
        const newLesson = new LessonModel({
            title,
            content,
            course,
        });

        await newLesson.save();

        res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Обновить урок по ID
export const updateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const lessonId = req.params.id;
        const { title, content } = req.body;

        const updatedLesson = await LessonModel.findByIdAndUpdate(
            lessonId,
            { title, content },
            { new: true } // Возвращаем обновленный объект
        );

        if (!updatedLesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }

        res.status(200).json({ message: 'Lesson updated successfully', lesson: updatedLesson });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Удалить урок по ID
export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const lessonId = req.params.id;

        const deletedLesson = await LessonModel.findByIdAndDelete(lessonId);
        if (!deletedLesson) {
            res.status(404).json({ message: 'Lesson not found' });
            return;
        }

        res.status(200).json({ message: 'Lesson deleted successfully', lesson: deletedLesson });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};