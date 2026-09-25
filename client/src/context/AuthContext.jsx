import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem("ndangira_auth");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setToken(parsed.token);
          setUser(parsed.user);

          const fresh = await getMe(parsed.token);
          setUser(fresh.user);
        } catch {
          localStorage.removeItem("ndangira_auth");
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const signIn = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem(
      "ndangira_auth",
      JSON.stringify({ user: userData, token: tokenValue })
    );
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ndangira_auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signOut, isLoggedIn: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}