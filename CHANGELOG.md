# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Added styled `Login` page using Tailwind CSS V4 and updated client styles.
- Installed and configured Tailwind CSS (client-side) and PostCSS integration.
- Updated `AppRoutes.jsx` and `ProtectedRoute.jsx` for route configuration and auth guarding.
- Updated `authSlice` to persist `user` and initialize `isAuthenticated` from localStorage tokens.
- Backend: added `GET /api/auth/me` (current user provider) to expose the authenticated user profile.
- Documentation and README updated to reflect the above changes.

