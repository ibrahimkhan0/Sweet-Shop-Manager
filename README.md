# Sweet Shop Management System

A full-stack application for managing a sweet shop, built with Node.js, Express, TypeScript, Prisma, and React.

## Working Visual

https://github.com/user-attachments/assets/9413d65b-539e-47cc-a29a-400fca29725d

## Features

- **User Authentication**: Register and Login with JWT.
- **Sweets Management**: View, Search, Add, Edit, Delete sweets.
- **Inventory**: Purchase sweets (decreases stock) and Restock (Admin only).
- **Role-based Access**: Admin and User roles.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma (SQLite), Jest.
- **Frontend**: React, Vite, Tailwind CSS, Axios.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the server:
   ```bash
   npx nodemon src/server.ts
   ```
   The server runs on `http://localhost:3000`.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:5173`.

## Testing

To run backend tests:
```bash
cd backend
npm test
```

## My AI Usage

I used **GitHub Copilot** to assist with the development of this project.

- **Boilerplate Generation**: I used Copilot to generate the initial structure for Express controllers and React components.
- **Test Generation**: Copilot helped write the initial test cases for the backend API, which I then refined to match the specific requirements.
- **Debugging**: When encountering Prisma configuration issues, I used the AI to troubleshoot and find the correct configuration for SQLite.
- **Refactoring**: Copilot suggested improvements for code readability and type safety in TypeScript.

**Reflection**: AI significantly speeded up the development process, especially for repetitive tasks like writing CRUD operations and basic UI components. It allowed me to focus more on the business logic and architecture. However, I had to carefully review the generated code, especially for the Prisma configuration, as it sometimes suggested deprecated or incorrect options for the specific version I was using.
