import { createContext, useState } from "react";
import {
  getUserById,
  listOrganizations,
  listTeamsByOrganization,
  loginUser,
  resetApiCache,
  signupUser,
} from "../api/api";

export const AuthContext = createContext();
const USER_STORAGE_KEY = "user";

const getStoredUser = () => {
  try {
    const sessionUser = sessionStorage.getItem(USER_STORAGE_KEY);
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }
    const legacyLocalUser = localStorage.getItem(USER_STORAGE_KEY);
    if (legacyLocalUser) {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    return null;
  } catch (error) {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const decodeJwtUserId = (token) => {
  try {
    if (!token) {
      return "";
    }

    const parts = token.split(".");
    if (parts.length < 2) {
      return "";
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalizedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const payload = JSON.parse(atob(normalizedBase64));

    return payload?.sub || payload?.user_id || "";
  } catch (error) {
    return "";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const createSessionUser = ({ tokenData, fallbackEmail }) => {
    const userId = tokenData.id || decodeJwtUserId(tokenData.access_token);

    return {
      id: tokenData.id || userId || null,
      name: tokenData.name || "",
      email: tokenData.mail || fallbackEmail,
      isActive: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || "",
      roleId: tokenData.role_id ?? null,
      expiresAt: tokenData.expires_at ?? null,
    };
  };

  const hydrateUserProfile = (sessionUser, userId, accessToken) => {
    if (!userId) {
      return;
    }

    getUserById(userId, accessToken)
      .then((profile) => {
        const updatedSessionUser = {
          ...sessionUser,
          id: profile?.id || sessionUser.id,
          name: profile?.name || sessionUser.name,
          email: profile?.mail || sessionUser.email,
          isActive:
            typeof profile?.is_active === "boolean"
              ? profile.is_active
              : sessionUser.isActive,
        };
        setUser(updatedSessionUser);
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedSessionUser));
      })
      .catch(() => {
        // Keep auth flow fast even if profile endpoint is slow or unavailable.
      });
  };

  const warmOrganizations = (accessToken) => {
    listOrganizations(accessToken)
      .then((organizationsData) => {
        const firstOrganization = organizationsData?.organizations?.[0];
        if (firstOrganization?.id) {
          return listTeamsByOrganization(firstOrganization.id, accessToken);
        }
        return null;
      })
      .catch(() => {
        // Ignore warmup failures to keep auth resilient.
      });
  };

  const register = async ({ email, password, name }) => {
    try {
      await signupUser({ mail: email, password, name });

      const tokenData = await loginUser({ mail: email, password });
      if (!tokenData?.access_token) {
        return {
          success: false,
          message: "Signup succeeded but login token was not returned.",
        };
      }

      const sessionUser = createSessionUser({ tokenData, fallbackEmail: email });
      setUser(sessionUser);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sessionUser));

      const userId = sessionUser.id;
      warmOrganizations(tokenData.access_token);
      hydrateUserProfile(sessionUser, userId, tokenData.access_token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Signup failed",
      };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const tokenData = await loginUser({ mail: email, password });

      if (!tokenData?.access_token) {
        return {
          success: false,
          message: "Login succeeded but no access token was returned by backend.",
        };
      }

      const sessionUser = createSessionUser({ tokenData, fallbackEmail: email });
      const userId = sessionUser.id;

      setUser(sessionUser);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sessionUser));

      warmOrganizations(tokenData.access_token);
      hydrateUserProfile(sessionUser, userId, tokenData.access_token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Invalid credentials",
      };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    resetApiCache();
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};