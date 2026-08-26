import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  saveToken,
  logoutUser,
  type AuthUser,
} from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(
    getCurrentUser()
  );

  const login = (token: string) => {
    saveToken(token);

    const currentUser = getCurrentUser();

    setUser(currentUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth повинен використовуватись всередині AuthProvider"
    );
  }

  return context;
}