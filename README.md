# Week 3 — Full Stack Task Manager (React + Django)

A full stack task manager built during Week 3 of the Arbisoft internship. The frontend is a React SPA built with Vite, and the backend is the Django REST API from Week 2 — connected via JWT authentication.

---

## Project Structure

```
week3/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/    # Navbar, PrivateRoute
│   │   ├── context/       # AuthContext (JWT auth state)
│   │   ├── pages/         # Home, Login, Register, Tasks, AddTask
│   │   └── services/      # api.js (Axios instance), tasks.js
│   └── index.html
├── backend/           # Django REST API (from Week 2)
│   ├── accounts/      # Register, Login, JWT endpoints
│   ├── tasks/         # Task CRUD endpoints
│   └── taskmanager/   # Django project settings
└── prompts.md         # AI tool usage log
```

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 + Vite | SPA framework and build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP client with interceptors |
| CSS Custom Properties | Dark theme design system |
| Inter (Google Fonts) | Typography |
| ESLint + Prettier | Linting and formatting |
| Husky + lint-staged | Pre-commit hooks |
| Vitest + Testing Library | Unit testing |

### Backend
| Tool | Purpose |
|------|---------|
| Django 6 + DRF | REST API |
| SimpleJWT | JWT access + refresh tokens |
| django-cors-headers | CORS for frontend requests |
| django-filter | Filtering, search, ordering |
| SQLite | Development database |

---

## Features

- **Authentication** — Register, login, logout with JWT tokens
- **Token Refresh** — Axios interceptors silently refresh expired access tokens
- **Private Routes** — Unauthenticated users are redirected to `/login`
- **Task Management** — Create, view, and delete tasks
- **Priority Badges** — Visual high/medium/low priority labels on task cards
- **Dark UI** — Full dark theme with CSS variables and card grid layout
- **Pre-commit Hooks** — Prettier + ESLint run automatically before every commit

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Create an admin superuser
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register/` | Register a new user | No |
| POST | `/api/token/` | Login — returns access + refresh tokens | No |
| POST | `/api/token/refresh/` | Refresh access token | No |
| GET | `/api/tasks/` | List all tasks for logged-in user | Yes |
| POST | `/api/tasks/` | Create a new task | Yes |
| PATCH | `/api/tasks/:id/` | Update a task | Yes |
| DELETE | `/api/tasks/:id/` | Delete a task | Yes |

---

## Frontend Scripts

```bash
npm run dev        # Start development server
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
npm run format     # Run Prettier
npm run test       # Run Vitest tests
```

---

## Key Concepts Covered This Week

- **React Context API** — Sharing auth state globally without prop drilling
- **Axios Interceptors** — Attaching tokens to requests and handling 401 refresh flows
- **Controlled Components** — React's pattern for form input state management
- **PrivateRoute pattern** — Route-level authentication guards
- **useEffect + async** — Proper pattern for async data fetching inside effects
- **ESLint rules** — `react-hooks/exhaustive-deps`, `no-use-before-define`, `react/prop-types`
- **Virtual environments** — Isolating Python dependencies per project

---

## Django Admin

To view tasks and users in a GUI:

1. Create a superuser: `python manage.py createsuperuser`
2. Go to: `http://localhost:8000/admin/`
3. Log in with your superuser credentials

---

## Related Repos

- **Week 2 Backend concepts:** `week2-backend-concepts`
- **Week 3 Learning notes:** `week3-concepts`