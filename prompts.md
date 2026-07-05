# AI Interaction Log — Week 3 (React Frontend + Full Stack Integration)

This log documents all AI tool usage during Week 3 of the Arbisoft internship, as required by my mentor. Each entry includes the day, the tool used, the purpose, and a summary of what was produced or fixed.

---

## Day 1 — React Project Setup & Routing

**Tool:** Claude (Sonnet)
**Purpose:** Set up a Vite + React frontend project with React Router, understand the component structure, and connect it to the Django backend built in Week 2.
**Summary:** Learned the difference between a Single Page Application (SPA) and a traditional multi-page app. Set up React Router with `BrowserRouter`, `Routes`, and `Route`. Built the initial page components (Home, Login, Register, Tasks, AddTask) and the Navbar. Understood how React renders a single `index.html` and swaps components client-side without page reloads.

---

## Day 2 — Axios & API Integration

**Tool:** Claude (Sonnet)
**Purpose:** Connect the React frontend to the Django REST API using Axios, handle API calls in a service layer.
**Summary:** Created a centralized `api.js` service using `axios.create()` with a base URL pointing to `http://localhost:8000/api`. Learned the difference between Axios and fetch, and why a centralized instance is better than calling Axios directly in components. Built `tasks.js` with `getTasks`, `createTask`, `updateTask`, and `deleteTask` functions.

---

## Day 3 — JWT Authentication in React

**Tool:** Claude (Sonnet)
**Purpose:** Implement login, register, and logout flows in React using JWT tokens stored in localStorage. Protect routes with a PrivateRoute component.
**Summary:** Built `AuthContext` with React Context API to share auth state across the entire app without prop drilling. Implemented login (stores `access_token` and `refresh_token` in localStorage), logout (clears tokens), and register flows. Built `PrivateRoute` component that redirects unauthenticated users to `/login`. Understood how `useContext` and `createContext` work together.

**Debugging note:** After implementing login, the Navbar was still showing Login/Register links even after a successful login. Diagnosed the bug with cursor — the Navbar was reading `user` from `useAuth()`, but `AuthContext` only exposes `isAuthenticated`. Since `user` was always `undefined`, the conditional render always showed the logged-out state. Fixed by changing `const { user, logout } = useAuth()` to `const { isAuthenticated, logout } = useAuth()`.

---

## Day 4 — Token Refresh & Axios Interceptors

**Tool:** Claude (Sonnet)
**Purpose:** Implement automatic JWT token refresh using Axios request and response interceptors so users stay logged in without manually re-authenticating.
**Summary:** Added a request interceptor to attach the `Authorization: Bearer <token>` header to every API call automatically. Added a response interceptor to catch `401 Unauthorized` responses, silently refresh the token using the refresh token, and retry the original failed request. Implemented a request queue to handle multiple simultaneous requests during a refresh cycle. Understood why token refresh must be handled at the service layer, not inside components.

---

## Day 5 — Form Handling & Validation

**Tool:** Claude (Sonnet)
**Purpose:** Build controlled forms for Login, Register, and AddTask pages with proper validation and error display.
**Summary:** Implemented controlled inputs using `useState` for each field. Learned why React uses controlled components (value + onChange) instead of uncontrolled refs for form data. Displayed server-side validation errors from the Django backend inline in the form.

**Debugging note:** The Register form was returning `"This field is required."` from the backend. Diagnosed with cursor — the Django `RegisterSerializer` requires a `password2` (confirm password) field, but the frontend form only collected `password`. Fixed by adding a Confirm Password field to `Register.jsx` and updating the `register()` function in `AuthContext` to pass `password2` in the API request body.

---

## Day 6 — UI Redesign & CSS Design System

**Tool:** Stitch (Google) + cursor (IDE agent)
**Purpose:** Redesign the frontend UI from a plain light-themed layout to a modern dark-themed design with a consistent design system.
**Summary:** Used Stitch to generate a new dark-mode UI. cursor placed the generated code into the correct files: `index.css` (full dark theme with CSS custom properties), `Tasks.jsx` (card grid layout with priority badges), `AddTask.jsx` (two-column form layout), and `Home.jsx` (gradient hero section). Added the Inter font from Google Fonts to `index.html`. Fixed three issues Stitch missed: the Inter font was referenced in CSS but never loaded in HTML; `.submit-btn` had no styles; and `select option` elements were invisible on dark backgrounds.

---

## Day 7 — Linting, Pre-commit Hooks & Git

**Tool:** Claude (Sonnet) + cursor (IDE agent)
**Purpose:** Fix ESLint errors caught by Husky pre-commit hooks and successfully commit the week's work.
**Summary:** Pre-commit hooks (Husky + lint-staged) ran Prettier and ESLint on every staged file before allowing a commit. ESLint caught four errors across three files that could not be auto-fixed:

1. **`Tasks.jsx`** — `fetchTasks` was called before it was declared (`no-use-before-define`), then after moving it, it was outside the `useEffect` dependency array (`react-hooks/exhaustive-deps`). Fixed by defining `fetchTasks` as an async function *inside* the `useEffect` callback — the standard React pattern for async effects.
2. **`AuthContext.jsx`** — `err` was caught in the `login` catch block but never used (`no-unused-vars`). Fixed by changing `catch (err)` to `catch`. Also missing `PropTypes` for the `children` prop on `AuthProvider` (`react/prop-types`). Fixed by importing `PropTypes` and defining `AuthProvider.propTypes`.
3. **`PrivateRoute.jsx`** — `children` prop missing from PropTypes validation. Fixed by adding PropTypes import and declaration.

Also learned why the backend had a `ModuleNotFoundError` for `corsheaders` and `django_filters` — the packages were listed in `requirements.txt` but never installed. Fixed by running `pip install -r requirements.txt`. Learned the importance of always activating a virtual environment (`venv`) before installing packages to keep project dependencies isolated from the global Python installation.

---

## General Notes

- All bugs were diagnosed before being fixed — understanding the root cause was prioritized over just making the error go away.
- Conventional commit format (feat/fix/chore/docs) was used throughout the week.
- The backend from Week 2 was reused without modification — all changes this week were on the frontend and integration layer.
- This log will be updated in future weeks as the project continues.
