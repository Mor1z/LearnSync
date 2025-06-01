-- Создание таблицы courses
CREATE TABLE IF NOT EXISTS courses (
                                       id SERIAL PRIMARY KEY,                -- Уникальный идентификатор курса (автоинкремент)
                                       title VARCHAR(255) NOT NULL,          -- Название курса
    description TEXT,                     -- Описание курса
    instructor_id INT NOT NULL,           -- ID преподавателя (связь с таблицей users)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата создания записи
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата обновления записи
                             CONSTRAINT fk_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- Индекс для ускорения поиска по instructor_id
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
