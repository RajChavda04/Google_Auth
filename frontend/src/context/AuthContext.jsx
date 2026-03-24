import { createContext, useState, useCallback, useEffect } from "react";
import { showSuccess, showError } from "../utils/toast";
export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Register User
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        showError(data.message || "Registration failed");
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.user);
      showSuccess(data.message || "Registration successful");
      return { success: true, user: data.user };
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      showError(errorMessage || "Registration failed");
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login User
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {

      if (!email || !password){
        showError("Please enter email and password");
        return { success: false, message: "Please enter email and password" };
    }

      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
     
      if (!data.success) {
        showError(data.message);
        return { success: false, message: data.message }
      }

      setUser(data.user);
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      showSuccess(data.message || "Login successful");
      return { success: true, user: data.user }
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      showError(errorMessage || "Login failed");
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Google Login / Social Login
  // const googleLogin = useCallback(async (name, email) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/users/google-auth`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ name, email }),
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       showError(data.message || "Google login failed");
  //       throw new Error(data.message || "Google login failed");
  //     }

  //     setUser(data.user);
  //     localStorage.setItem("user", JSON.stringify(data.user));
  //     showSuccess(data.message || "Google login successful");
  //     return { success: true, user: data.user };
  //   } catch (err) {
  //     const errorMessage = err.message || "Google login failed";
  //     setError(errorMessage);
  //     showError(errorMessage || "Google login failed");
  //     return { success: false, message: errorMessage };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
  const googleLogin = useCallback(async (token) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/google-auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Google login failed");
        }

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        return { success: true, user: data.user };
      } catch (err) {
        const errorMessage =
          err?.message || "Something went wrong during Google login";

        setError(errorMessage);

        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    }, []);


  // Logout User
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
