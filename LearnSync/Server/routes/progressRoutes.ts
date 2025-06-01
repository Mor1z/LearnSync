import { Router } from 'express';
import { getUserProgress, updateProgress } from '../controllers/progressController';

const router = Router();

// Получить прогресс пользователя по ID
router.get('/:userId', getUserProgress);

// Обновить прогресс пользователя по уроку
router.post('/update', updateProgress);

export default router;