<<<<<<< HEAD
# MVP Teams Organization - Frontend

This document covers frontend flow and frontend architecture only.

## Frontend Flow

1. User lands on Login (`/`) or Signup (`/signup`).
2. After successful auth, app stores the user session and routes to `/dashboard`.
3. User can navigate to Organizations (`/organizations`) to manage organizations.
4. Teams (`/teams`) and Members (`/members`) are guarded.
5. If the user has no organization, guarded routes redirect to `/organizations`.
6. Profile (`/profile`) is available for logged-in users.

### Route Behavior

- Public routes:
  - `/`
  - `/signup`
- Protected routes:
  - `/dashboard`
  - `/organizations`
  - `/teams`
  - `/members`
  - `/profile`

### Session Behavior

- Auth state is managed through Auth Context.
- Session persists in `sessionStorage` under `user`.
- Protected navigation uses route-level guards and redirects.

## Frontend Architecture

### High-Level Layers

1. Routing Layer (`src/routes`)
	- Defines public/protected routes.
	- Applies organization guard for Teams and Members.
2. Layout Layer (`src/layouts`)
	- Shared page structure for auth pages and dashboard pages.
3. Page Layer (`src/pages`)
	- Screen-level views for Dashboard, Organization, Teams, Members, Profile, Login, Signup.
4. Component Layer (`src/components`)
	- Reusable UI blocks used by pages.
5. State/Context Layer (`src/context`)
	- Global auth/session state.
6. Data Layer (`src/api`)
	- API request functions, auth header helpers, and client-side cache logic.
7. Utility Layer (`src/utils`)
	- App constants and validation helpers.

### Folder Architecture

```text
ui/
  src/
	 api/            # API requests and cache helpers
	 components/     # Reusable UI components
	 context/        # Global auth/session context
	 layouts/        # Shared app layouts
	 pages/          # Route-level pages
	 routes/         # Route map and guards
	 utils/          # Constants and validators
```

### Data and UI Interaction Pattern

1. Page renders and triggers an action.
2. Action calls a function in `src/api`.
3. API layer returns parsed data (or error).
4. Page updates local/context state.
5. Reusable components render updated UI.
=======

>>>>>>> refs/rewritten/3-changed-the-flow-of-the-UI
