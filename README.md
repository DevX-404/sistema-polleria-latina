# Sistema Web para Pollería

Sistema web (PWA) para una pollería de barrio: el mozo toma el pedido desde su celular,
laptop o tablet y llega solo a la pantalla de cocina; la dueña o la cajera cobran, confirman
el pago e imprimen el ticket; y la dueña consulta pedidos, pagos y ventas.

## Stack

- Backend: Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Flyway
- Frontend: React, TypeScript, Vite, Tailwind (PWA)
- Base de datos: PostgreSQL 16
- Entorno: Docker Compose

## Estructura

- `backend/`: API en Spring Boot
- `frontend/`: aplicación web en React
- `docker-compose.yml`: PostgreSQL para desarrollo
- `.env.example`: variables de ejemplo (copiar como `.env`)

## Cómo levantar la base de datos

1. Copia las variables de ejemplo y cambia la contraseña: `copy .env.example .env`
2. Levanta PostgreSQL: `docker compose up -d`
3. Verifica que esté saludable: `docker compose ps`
4. Para apagarla: `docker compose down` (los datos se conservan en un volumen)

## Flujo de trabajo

- No se trabaja directamente sobre `main`.
- Cada tarea tiene su rama: `feature/<número>-<nombre-corto>`.
- Commits con prefijo: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- Cada rama se integra con un pull request que cierre su issue (`Closes #N`).