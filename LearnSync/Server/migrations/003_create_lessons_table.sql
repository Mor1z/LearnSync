-- Создание таблицы lessons
CREATE TABLE IF NOT EXISTS lessons (
                                       id SERIAL PRIMARY KEY,                -- Уникальный идентификатор урока (автоинкремент)
                                       title VARCHAR(255) NOT NULL,          -- Название урока
    content TEXT NOT NULL,                -- Содержимое урока (текст или HTML)
    course_id INT NOT NULL,               -- ID курса, к которому относится урок (связь с таблицей courses)
    order_number INT NOT NULL,            -- Порядковый номер урока в курсе
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата создания записи
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата обновления записи
                             CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

-- Индекс для ускорения поиска по course_id
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
