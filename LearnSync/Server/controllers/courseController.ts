// server/controllers/courseController.ts

import { Request, Response } from 'express';
import { CourseModel } from '../models/courseModel'; // Модель курса

// Получить все курсы
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await CourseModel.find().populate('instructor', 'username'); // Подтягиваем данные инструктора
        res.status(200).json({ message: 'Courses retrieved successfully', courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Получить курс по ID
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const courseId = req.params.id;

        const course = await CourseModel.findById(courseId).populate('instructor', 'username');
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json({ message: 'Course retrieved successfully', course });
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Создать новый курс
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, instructor } = req.body;

        // Проверяем, существует ли пользователь с указанным ID инструктора
        const newCourse = new CourseModel({
            title,
            description,
            instructor,
        });

        await newCourse.save();

        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Обновить курс по ID
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const courseId = req.params.id;
        const { title, description } = req.body;

        const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            { title, description },
            { new: true } // Возвращаем обновленный объект
        );

        if (!updatedCourse) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Удалить курс по ID
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const courseId = req.params.id;

        const deletedCourse = await CourseModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};