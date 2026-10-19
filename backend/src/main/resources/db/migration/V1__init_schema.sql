-- =============================================================================
-- V1__init_schema.sql
-- Migración inicial: tablas base del sistema Pollería Latina
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USERS
-- Almacena las credenciales y el rol de cada usuario del sistema.
-- Roles válidos: ADMIN, CAJERO, MESERO, COCINA
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id          BIGSERIAL                   PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL       UNIQUE,
    password    VARCHAR(100) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    enabled     BOOLEAN      NOT NULL       DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'CAJERO', 'MESERO', 'COCINA'))
);

-- -----------------------------------------------------------------------------
-- 2. RESTAURANT_TABLES
-- Representa las mesas físicas del local.
-- Estados válidos: AVAILABLE, OCCUPIED, RESERVED
-- -----------------------------------------------------------------------------
CREATE TABLE restaurant_tables (
    id          BIGSERIAL                   PRIMARY KEY,
    number      INT          NOT NULL       UNIQUE,
    capacity    INT          NOT NULL,
    status      VARCHAR(20)  NOT NULL       DEFAULT 'AVAILABLE',
    created_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_restaurant_tables_status CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED'))
);

-- -----------------------------------------------------------------------------
-- 3. CATEGORIES
-- Agrupa los productos del menú (p. ej. Pollos, Bebidas, Acompañamientos).
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
    id          BIGSERIAL                   PRIMARY KEY,
    name        VARCHAR(100) NOT NULL       UNIQUE,
    description TEXT,
    active      BOOLEAN      NOT NULL       DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. PRODUCTS
-- Artículos del menú asociados a una categoría.
-- -----------------------------------------------------------------------------
CREATE TABLE products (
    id          BIGSERIAL                   PRIMARY KEY,
    category_id BIGINT       NOT NULL       REFERENCES categories(id),
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    price       NUMERIC(10, 2) NOT NULL,
    available   BOOLEAN      NOT NULL       DEFAULT TRUE,
    image_url   VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP
);

-- Índice para consultas de productos por categoría
CREATE INDEX idx_products_category_id ON products (category_id);

-- -----------------------------------------------------------------------------
-- 5. MODIFIERS
-- Opciones adicionales de un producto (p. ej. tamaño, salsa extra).
-- Se eliminan en cascada al borrar el producto padre.
-- -----------------------------------------------------------------------------
CREATE TABLE modifiers (
    id          BIGSERIAL                   PRIMARY KEY,
    product_id  BIGINT       NOT NULL       REFERENCES products(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    extra_price NUMERIC(10, 2) NOT NULL     DEFAULT 0.00,
    created_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE   DEFAULT CURRENT_TIMESTAMP
);

-- Índice para consultas de modificadores por producto
CREATE INDEX idx_modifiers_product_id ON modifiers (product_id);
