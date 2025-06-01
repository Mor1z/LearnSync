-- Создание таблицы progress
CREATE TABLE IF NOT EXISTS progress (
                                        id SERIAL PRIMARY KEY,                -- Уникальный идентификатор записи (автоинкремент)
                                        user_id INT NOT NULL,                 -- ID пользователя (связь с таблицей users)
                                        lesson_id INT NOT NULL,               -- ID урока (связь с таблицей lessons)
                                        completed BOOLEAN DEFAULT FALSE,      -- Флаг завершения урока (true/false)
                                        progress_percentage INT DEFAULT 0,    -- Процент завершения урока (0–100)
                                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата создания записи
                                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата обновления записи
                                        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE (user_id, lesson_id)           -- Уникальность: один пользователь может иметь только одну запись на урок
    );

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress(lesson_id);

