# Interprep

Interprep is a professional full-stack interview preparation monorepo that supports a modern product workflow. It includes a React + Vite frontend, an Express API backend, and a Docker-backed runner service for secure code execution.

## Repository overview

This repo is structured to support team development, maintainability, and operational readiness. It is organized into three modules:

- `client/` — React frontend with Redux Toolkit and Axios-based networking
- `server/` — Express backend with MongoDB persistence, auth flows, problems, and submissions
- `runner/` — Secure code execution service that runs submitted solutions inside Docker containers
- `Interprep_Server_Documentation.md` — backend design notes and implementation references

## Why this is professional

The current structure reflects a production-style monorepo because it:

- separates frontend, backend, and execution concerns
- supports independent development and testing for each module
- makes onboarding and handoff clearer for new team members
- keeps API contracts and auth workflows explicit and documented
- enables future scaling and deployment separation for services

## Tech stack

| Layer | Technologies |
|------|--------------|
| Frontend | React, Vite, Redux Toolkit, Axios, React Router, React Toastify |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Joi, bcrypt, Nodemailer, Winston |
| Runner | Node.js, Express, Docker |

## Getting started

### Prerequisites

- Node.js 18+
- npm 10+
- MongoDB available locally or remotely
- Docker installed and running for code execution

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install

cd ../runner
npm install
```

If you added new dev dependencies (Tailwind CSS, PostCSS, autoprefixer), run the `npm install` inside `client/` to ensure they are installed.

### Configure environment variables

Create a `.env` file inside `server/` with the following content:

```env
MONGO_URI=mongodb://127.0.0.1:27017/interprep
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

> Use a Gmail app password for `EMAIL_PASS` if you are sending mail from a Google account.

### Start the platform

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev

# Runner service
cd ../runner
npm start
```

Default ports in development:

- Frontend: `5173`
- Backend: `3000`
- Runner: `5000`

## Monorepo module responsibilities

- `client/` delivers the user interface, client-side routing, and auth state management.
- `server/` implements API routes, authentication, problem CRUD, submission flow, and runner integration.
- `runner/` executes code safely with Docker and returns verdicts to the backend.

## Frontend auth and API architecture

The React client includes a professional auth architecture that is easy to maintain and extend:

- `client/src/utils/axiosInstance.js` — shared Axios instance with request configuration and JWT handling
- `client/src/app/store.js` — Redux store setup and slice registration
- `client/src/features/auth/authAPI.js` — reusable auth API helpers for register, login, refresh, logout, and password actions
- `client/src/features/auth/authSlice.js` — auth slice for Redux state and actions
- `client/src/pages/Register.jsx` — registration page with validation and user feedback
- `client/src/pages/Login.jsx` — login experience for returning users
- `client/src/pages/VerifyEmail.jsx` — email verification flow
- `client/src/pages/ForgotPassword.jsx` — password recovery entry point
- `client/src/pages/ResetPassword.jsx` — password reset form
- `client/src/routes/AppRoutes.jsx` — route configuration for public and protected pages
- `client/src/components/ProtectedRoute.jsx` — guard that redirects unauthenticated users to login

Note: Tailwind CSS is used for styling the Login page and other UI components. The client includes `tailwind.config.cjs` and `postcss.config.cjs` preconfigured; run `npm install` in `client/` to install the required packages.

## API overview

### Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Problem and submission endpoints

- `GET /api/problem`
- `POST /api/problem` (admin only)
- `POST /api/submission`

### Frontend auth routes

The client now includes route-based authentication flow for:

- `/register`
- `/login`
- `/verifyEmail`
- `/forgotPassword`
- `/resetPassword`
- `/dashboard` (protected)

### Current user endpoint

The backend exposes an endpoint to return the current authenticated user profile:

- `GET /api/auth/me` — returns user info for the access token presented in the request (attach `Authorization: Bearer <accessToken>`)

## Environment variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | Secret for JWT access tokens | Yes |
| `REFRESH_TOKEN_SECRET` | Secret for JWT refresh tokens | Yes |
| `EMAIL_USER` | Email sender address | Yes |
| `EMAIL_PASS` | Email account password or app password | Yes |
| `CLIENT_URL` | Frontend base URL for email callbacks | Yes |
| `NODE_ENV` | Node environment mode | No |

## Development workflow

A professional workflow for this monorepo includes:

- Keep authentication pages, route guards, and Redux auth state in sync when making changes.
- Verify protected routes still redirect unauthenticated users correctly.
- Ensure email verification and password reset flows are wired to the expected frontend routes.

1. Create a feature branch for each change.
2. Keep changes scoped to the relevant module.
3. Run the affected module locally before pushing.
4. Update documentation with any API or env changes.
5. Review backend and frontend behavior together when auth or submission flows change.

## Notes for maintainers

- The server sends code execution jobs to `http://localhost:5000/run`.
- The runner uses Docker container images for JavaScript, Python, Java, and C++.
- Keep sensitive credentials out of source control.
- Use `Interprep_Server_Documentation.md` for backend design reference.

## Documentation

See `Interprep_Server_Documentation.md` for architecture, implementation, and backend route details.

## Contributing

1. Create a descriptive branch name.
2. Implement changes in the correct module.
3. Verify the affected paths locally.
4. Submit a pull request with clear summary and testing notes.

## License

ISC License
