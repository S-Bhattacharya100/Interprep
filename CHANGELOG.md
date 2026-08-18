# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Fixed `vite.config.js` to properly use `@tailwindcss/vite` plugin for Tailwind CSS v4 integration in Vite dev server and build.
- Updated `client/src/utils/axiosInstance.js` with request and response interceptors for robust JWT token handling and error management.
- Added styled `Login` page using Tailwind CSS V4 and updated client styles.
- Installed and configured Tailwind CSS (client-side) with Vite plugin, PostCSS, and Autoprefixer.
- Added `AuthInitializer` to bootstrap the authenticated user on app startup and set `authInitialized` after the current-user check completes.
- Updated `authSlice` to keep the current user in Redux instead of persisting it in localStorage, and added the `authInitialized` flag to control route rendering during startup.
- Removed the `auth/me` fetch logic from the `Dashboard` component and centralized it in the app-level initializer.
- Added `PublicRoute` so already-authenticated users are redirected away from login/register pages instead of seeing them unnecessarily.
- Fixed the `AuthInitializer` naming typo and improved login error handling to surface cleaner API errors.
- Updated `ProtectedRoute` and `PublicRoute` to wait for auth initialization before deciding whether to render protected or guest pages.
- Updated `main.jsx` to mount `AuthInitializer` around the app so auth state is ready before routing decisions are made.
- Backend: added `GET /api/auth/me` (current user provider) to expose the authenticated user profile.
- Documentation and README updated to reflect the latest auth flow and route changes.

