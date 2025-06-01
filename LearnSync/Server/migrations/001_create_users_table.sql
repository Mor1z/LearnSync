CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
                                     email VARCHAR(150) UNIQUE NOT NULL,
                                     password_hash VARCHAR(255) NOT NULL,
                                     role VARCHAR(20) DEFAULT 'student', -- student | instructor | admin
                                     avatar_url TEXT,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);