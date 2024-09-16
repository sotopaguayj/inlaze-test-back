# Inaze Technical Test

## Descripción

Construir un back-end utilizando NestJS e implementar las siguientes funcionalidades básicas:

- Gestión de usuarios
- Autenticación y Gestión de Sesiones
- Gestión Básica de Favoritos

## Pasos para la instalación

1. Clonar el repositorio:
   ```bash
   git clone repo
   ```
2. Acceder a el repositorio:
   ```bash
   cd repo
   ```
3. Instalar dependencias:
   ```bash
   npm i
   ```
4. Iniciar la configuración de la base de datos:
   ```bash
   npx prisma init
   ```
5. Crear la base de datos:
   ```bash
   npx prisma db push
   ```
6. Iniciar Aplicación:
   ```bash
   npm run start:dev
   ```

## Rutas

| Método | Ruta            | Descripción                           |
| ------ | --------------- | ------------------------------------- |
| GET    | `/users`        | Obtener todos los usuarios            |
| POST   | `/users`        | Crear un nuevo usuario                |
| GET    | `/users/:id`    | Obtener un usuario por su ID          |
| PUT    | `/users/:id`    | Actualizar un usuario por su ID       |
| DELETE | `/users/:id`    | Eliminar un usuario por su ID         |
| POST   | `/auth/signin`  | Iniciar sesión y obtener un token JWT |
| POST   | `/auth/signup`  | Registrar un nuevo usuario            |
| POST   | `/auth/signout` | Finaliza la sesión del usuario        |
| GET    | `/favourite`    | Obtener los favoritos del usuario     |
| POST   | `/favourite`    | Añadir un elemento a favoritos        |
