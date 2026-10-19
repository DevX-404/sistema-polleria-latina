-- =============================================================================
-- V2__seed_users.sql
-- Agrega columnas de bloqueo y usuarios iniciales con PINs cifrados (BCrypt)
-- PIN '1234' → $2a$10$77K7Ly4G52.3nVKC1bd6leWwA4EdL9xnhH0gTc8AAoW7n8Q5Mso4C  (BCrypt cost 10)
-- =============================================================================

-- Agrega columnas de control de intentos fallidos y bloqueo temporal
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS failed_attempts  INT                      DEFAULT 0,
    ADD COLUMN IF NOT EXISTS locked_until     TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Usuarios semilla con PIN '1234' cifrado en BCrypt (cost 10)
INSERT INTO users (username, password, role, enabled)
VALUES
    ('admin',   '$2a$10$77K7Ly4G52.3nVKC1bd6leWwA4EdL9xnhH0gTc8AAoW7n8Q5Mso4C', 'ADMIN',   TRUE),
    ('cajero1', '$2a$10$77K7Ly4G52.3nVKC1bd6leWwA4EdL9xnhH0gTc8AAoW7n8Q5Mso4C', 'CAJERO',  TRUE),
    ('mozo1',   '$2a$10$77K7Ly4G52.3nVKC1bd6leWwA4EdL9xnhH0gTc8AAoW7n8Q5Mso4C', 'MESERO',  TRUE),
    ('cocina1', '$2a$10$77K7Ly4G52.3nVKC1bd6leWwA4EdL9xnhH0gTc8AAoW7n8Q5Mso4C', 'COCINA',  TRUE)
ON CONFLICT (username) DO NOTHING;
