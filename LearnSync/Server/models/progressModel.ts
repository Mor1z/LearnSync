// server/models/progressModel.ts

import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }, // Ссылка на урок
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Ссылка на курс
    completed: { type: Boolean, default: false }, // Флаг завершения урока
    createdAt: { type: Date, default: Date.now },
});

export const ProgressModel = mongoose.model('Progress', progressSchema);