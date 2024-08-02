import delay from "@/utils/delay";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useAsync from "./use-async";
import useAuthenticationService, {
  Attendant,
  AttendantResponse,
  attendantResponseToAttendant,
} from "./use-authentication-service";
import useMyModule from "./use-my-module";
import useEcho from "./operator/use-echo";

const AuthCtx = createContext<
  | {
    login: (email: string, password: string) => void;
    logout: () => void;
    attendant: Attendant | null;
    authenticated: boolean;
    loading: boolean;
  }
  | undefined
>({
  login: () => { },
  logout: () => { },
  attendant: null,
  authenticated: false,
  loading: true,
});

export const AuthenticatedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // =======================================================

  const { myModule } = useMyModule();

  const echo = useEcho();

  // =======================================================

  const authService = useMemo(
    () => useAuthenticationService(myModule?.ipAddress),
    [myModule]
  );

  // =======================================================

  useEffect(() => {
    echo.channel(`attendants.${attendant?.id}`)
      .listen(".attendant.updated", (data: {
        attendant: AttendantResponse;
      }) => {
        const updatedAttendant = attendantResponseToAttendant(data.attendant);
        setAttendant(updatedAttendant);
      });
    return () => {
      echo.leaveChannel(`attendants.${attendant?.id}`);
    }
  }, [attendant]);

  useAsync(
    async () => {
      if (!myModule) return null;
      const token = localStorage.getItem("token");
      if (token) return await authService.refreshToken(token);
      return token;
    },
    (data) => {
      setToken(data);
    },
    () => {
      localStorage.removeItem("token");
      toast("Error al refrescar el token", {
        type: "error",
      });
    },
    () => { },
    [authService, myModule]
  );

  useAsync<Attendant | null>(
    async () => {
      if (!myModule) return null;
      if (token) {
        return delay(
          3000,
          () => {
            setLoading(true);
          },
          () => { },
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
    () => { },

    [token, myModule]
  );

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  // =======================================================

  const handleLogout = () => {
    authService.logout(token!);
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
        authenticated: !!attendant,
        loading,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};
export default function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
