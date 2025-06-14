import { mockUsers } from "@/data/mockData";
import { AuthState, User, UserRole } from "@/types";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // In a real app, this would make an API call to verify credentials
    // For this demo, we'll simulate successful login if email is provided and role matches
    try {
      // For demo purposes, any non-empty email and password will work
      if (!email || !password) {
        toast.error("Please provide both email and password");
        return false;
      }

      // Find a mock user with this email and role
      const user = mockUsers.find(u => u.email === email && u.role === role);
      
      if (user) {
        // Simulate a successful login
        setAuthState({
          user,
          isAuthenticated: true,
        });
        toast.success(`Welcome back, ${user.name}`);
        return true;
      } else {
        // If no matching user in mockUsers
        toast.error("Invalid credentials or role mismatch");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
