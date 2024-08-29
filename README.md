# Task Manager Application

## Overview
This Task Manager is a full-stack web application built with a Next.js frontend and an Express.js backend. It allows users to create, organize, and manage tasks across different stages of completion.

## Features
- User authentication (register, login)
- Google OAuth sign-in
- Create, read, update, and delete tasks
- Drag-and-drop interface for task management
- Responsive design for various screen sizes

## Tech Stack
- Frontend:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - react-beautiful-dnd (@hello-pangea/dnd)
- Backend:
  - Express.js
  - TypeScript
  - PostgreSQL with Drizzle ORM, hosted on Neon
- Authentication:
  - NextAuth.js (frontend)
  - Custom JWT implementation (backend)

## Prerequisites
- PostgreSQL database
- Bun

## Setup

### Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   bun install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database URL and JWT secret
4. Run database migrations:
   ```
    bun run db:generate
    bun run db:migrate
   ```
5. Start the development server:
   ```
   bun run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```
   cd website
   ```
2. Install dependencies:
   ```
   bun install
   ```
3. Set up your environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your backend API URL and NextAuth settings
4. Start the development server:
   ```
   bun run dev
   ```

## Usage
1. Open your browser and go to `http://localhost:3000`
2. Register a new account or log in
3. Start managing your tasks!
