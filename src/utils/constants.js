export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_BASE_URL || "http://localhost:8000/auth/v1";

export const CORE_API_BASE_URL =
  process.env.REACT_APP_CORE_API_BASE_URL || "http://localhost:8001/core/v1";

export const ROUTES = {
  LOGIN: "/",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  ORGANIZATIONS: "/organizations",
  TEAMS: "/teams",
  MEMBERS: "/members",
  PROFILE: "/profile",
};