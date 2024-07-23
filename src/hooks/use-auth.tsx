import delay from "@/utils/delay";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAsync from "./use-async";
import useAuthenticationService, {
  Attendant,
} from "./use-authentication-service";

const AuthCtx = createContext<
  | {
      login: (email: string, password: string) => void;
      logout: () => void;
      attendant: Attendant | null;
      authenticated: boolean;
    }
  | undefined
>({
  login: () => {},
  logout: () => {},
  attendant: null,
  authenticated: false,
});

export const AuthenticatedProvider: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // =======================================================

  const authService = useAuthenticationService();
  const navigator = useNavigate();

  // =======================================================

  useAsync(
    async () => {
      const token = localStorage.getItem("token");
      if (token) return await authService.refreshToken(token);
      return token;
    },
    (data) => {
      setToken(data);
    },
    () => {
      toast("Error al refrescar el token", {
        type: "error",
      });
    },
    () => {},
    [authService]
  );

  useAsync<Attendant | null>(
    async () => {
      if (token) {
        return delay(
          1000,
          () => {
            setLoading(true);
          },
          () => {
            setLoading(false);
          },
          () => {
            return authService.profile(token);
          }
        );
      }
      return null;
    },
    (data) => {
      setLoading(false);
      setAttendant(data);
    },
    () => {
      toast("Error al cargar el perfil del usuario", {
        type: "error",
      });
    },
    () => {},

    [token]
  );

  useEffect(() => {
    if (attendant) {
      navigator("/caja");
    }
  }, [attendant, navigator]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  // =======================================================

  const handleLogout = () => {
    authService.logout(token!);
    navigator("/login");
    setToken(null);
    localStorage.removeItem("token");
  };

  const handleLogin = async (email: string, password: string) => {
    const token = await authService.login(email, password);
    setToken(token);
  };

  // =======================================================
  return (
    <AuthCtx.Provider
      value={{
        login: handleLogin,
        logout: handleLogout,
        attendant,
        authenticated: !!attendant && !loading,
      }}
    >
      <Outlet />
    </AuthCtx.Provider>
  );
};
export const Authenticated = () => {
  const { authenticated } = useAuth();
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
