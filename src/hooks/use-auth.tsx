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
import useCache from "./use-cache";

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
  const cache = useCache();


  // =======================================================

  const authService = useMemo(
    () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useAuthenticationService(myModule?.ipAddress);
    },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendant]);


  useAsync(
    async () => {
      if (!myModule) return null;
      const token = cache.get<string>("token");
      if (token) {
        return token;
      }
      return null;
    },
    (data) => {
      if (data) setToken(data);
    },
    () => {
      cache.delete("token");
      toast("Error al refrescar el token", {
        type: "error",
      });
    },
    () => { },
    [myModule]
  );

  useAsync<Attendant | null>(
    async () => {
      if (!myModule) return null;
      let profile = cache.get<Attendant>("profile");
      if (profile) {
        return profile;
      }
      if (token) {
        await delay(
          1000,
          () => {
            setLoading(true);
          },
          () => {
            setLoading(false);
          },
          async () => {
          }
        );
        profile = await authService.profile(token);
        cache.set("profile", profile);
        return profile;
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
    () => {
      setLoading(false);
    },

    [token, myModule]
  );

  useEffect(() => {
    if (token) cache.set("token", token);
  }, [token]);

  // =======================================================

  const handleLogout = async () => {
    cache.delete("token");
    cache.delete("profile");
    cache.delete("services");
    cache.delete("attention_profiles");
    setToken(null);
    await authService.logout(token!);
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
