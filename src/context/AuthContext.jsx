import { createContext, useState } from "react";

export const AuthContext = createContext();
const USERS_STORAGE_KEY = "users";
const USER_STORAGE_KEY = "user";

const getStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    localStorage.removeItem(USERS_STORAGE_KEY);
    return [];
  }
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(getStoredUsers);
  const [user, setUser] = useState(getStoredUser);

  const register = (data) => {
    const existingUser = users.find((storedUser) => storedUser.email === data.email);

    if (existingUser) {
      return {
        success: false,
        message: "Email already registered. Please login.",
      };
    }

    const updatedUsers = [...users, data];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    return { success: true };
  };

  const login = (data) => {
    const matchedUser = users.find(
      (storedUser) =>
        storedUser.email === data.email && storedUser.password === data.password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid credentials. Please register first or use correct details.",
      };
    }

    const sessionUser = { email: matchedUser.email };
    setUser(sessionUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sessionUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};