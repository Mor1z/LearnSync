import { Router } from 'express';
import {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
} from '../controllers/lessonController';

const router = Router();

// Получить все уроки
router.get('/', getAllLessons);

// Получить урок по ID
router.get('/:id', getLessonById);

// Создать новый урок
router.post('/', createLesson);

// Обновить урок по ID
router.put('/:id', updateLesson);

// Удалить урок по ID
router.delete('/:id', deleteLesson);

export default router;