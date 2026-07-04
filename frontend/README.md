# Task Manager

A simple Task Manager SPA built with React and Vite as part of the Arbisoft AI-Focused Internship 2026 - Week 1.

## Features

- 3 routes: Home, Tasks, Add Task
- Shared Navbar layout
- Form with client-side validation
- ESLint + Prettier for code quality
- Pre-commit hooks with Husky and lint-staged
- Unit tests with Vitest and React Testing Library

## Tech Stack

- React 19
- Vite
- React Router v7
- ESLint + Prettier
- Husky + lint-staged
- Vitest + React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run test` | Run unit tests |

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx
├── pages/
│   ├── Home.jsx
│   ├── Tasks.jsx
│   └── AddTask.jsx
├── App.jsx
├── main.jsx
└── index.css
```