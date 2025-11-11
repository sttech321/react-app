import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
export const UserContext = createContext();

/**
 * Safe localStorage helpers (keeps logic local so you can drop this file in easily)
 */
function safeGetJSON(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;           // not present
    if (typeof raw !== "string") return defaultValue; // unexpected type
    const cleaned = raw.trim();
    if (cleaned === "" || cleaned === "undefined") return defaultValue;
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`safeGetJSON: failed to parse "${key}" — removing broken value`, err);
    localStorage.removeItem(key); // remove broken value so next load won't crash
    return defaultValue;
  }
}

function safeSetJSON(key, value) {
  try {
    if (typeof value === "undefined" || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(`safeSetJSON: failed to set "${key}"`, err);
  }
}

export const UserProvider = ({ children }) => {
  // Initialize from localStorage safely
  const [user, setUser] = useState(() => safeGetJSON("user", null));

  // Keep localStorage in sync whenever user changes
  useEffect(() => {
    safeSetJSON("user", user);
  }, [user]);

  const login = (userData, token) => {
    try {
      console.log("login: persisting auth", { userData, token });
      if (typeof token === "undefined" || token === null) {
        // don't store undefined tokens
        localStorage.removeItem("auth_token");
      } else {
        localStorage.setItem("auth_token", token);
      }
      safeSetJSON("user", userData);
      setUser(userData);
    } catch (err) {
      console.error("login: failed to persist auth", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const update = (userData) => {
    console.log("Updating user in context:", userData);
    safeSetJSON("user", userData);
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, update }}>
      {children}
    </UserContext.Provider>
  );
};
