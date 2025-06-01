// server/routes/courseRoutes.ts

import express, { Request, Response } from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const router = express.Router();

// Путь к файлу с данными курсов
const COURSES_FILE = path.join(__dirname, '../../data/courses.json');

// Расширение интерфейса Request для поддержки req.user
declare module 'express' {
    interface Request {
        user?: {
            userId: string;
        };
    }
}

// Интерфейс для курса
interface Course {
    id: number;
    title: string;
    description: string;
    instructor_id: string;
    created_at: string;
    updated_at?: string;
}

// Чтение и запись данных
const readCourses = (): Course[] => {
    if (!fs.existsSync(COURSES_FILE)) {
        fs.writeFileSync(COURSES_FILE, '[]', 'utf8');
        return [];
    }
    return JSON.parse(fs.readFileSync(COURSES_FILE, 'utf8'));
};

const writeCourses = (courses: Course[]) => {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf8');
};

// Получение всех курсов
router.get('/', (req: Request, res: Response) => {
    try {
        res.json({
            message: 'Courses retrieved successfully',
            courses: readCourses()
        });
    } catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Создание нового курса
router.post('/', authenticateUser, (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const instructorId = req.user?.userId;

        // Проверка обязательных полей
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        if (!instructorId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        // Создание нового курса
        const courses = readCourses();
        const newCourse: Course = {
            id: Date.now(),
            title,
            description,
            instructor_id: instructorId,
            created_at: new Date().toISOString(),
        };

        courses.push(newCourse);
        writeCourses(courses);

        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение конкретного курса
router.get('/:id', (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.id, 10);
        const course = readCourses().find(c => c.id === courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course retrieved successfully', course });
    } catch (error) {
        console.error('Error retrieving course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновление курса
router.put('/:id', authenticateUser, (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.id, 10);
        const { title, description } = req.body;
        const instructorId = req.user?.userId;

        // Проверки
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        if (!instructorId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        // Поиск и обновление курса
        const courses = readCourses();
        const index = courses.findIndex(c => c.id === courseId);

        if (index === -1) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (courses[index].instructor_id !== instructorId) {
            return res.status(403).json({ message: 'Unauthorized to update this course' });
        }

        const updatedCourse = {
            ...courses[index],
            title,
            description,
            updated_at: new Date().toISOString()
        };

        courses[index] = updatedCourse;
        writeCourses(courses);

        res.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Удаление курса
router.delete('/:id', authenticateUser, (req: Request, res: Response) => {
    try {
        const courseId = parseInt(req.params.id, 10);
        const instructorId = req.user?.userId;

        if (!instructorId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        const courses = readCourses();
        const index = courses.findIndex(c => c.id === courseId);

        if (index === -1) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (courses[index].instructor_id !== instructorId) {
            return res.status(403).json({ message: 'Unauthorized to delete this course' });
        }

        const [deleted] = courses.splice(index, 1);
        writeCourses(courses);

        res.json({ message: 'Course deleted successfully', course: deleted });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;