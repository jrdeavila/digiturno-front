import useAsync from "@/hooks/use-async";
import useAttendantService from "@/hooks/use-attendant-service";
import { Attendant } from "@/hooks/use-authentication-service";
import { createContext, useContext, useState } from "react";

interface AttendantContextType {
  attendants: Attendant[];
}

const AttendantCtx = createContext<AttendantContextType | undefined>(undefined);

const AttendantProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  // ================================================================

  const attendantService = useAttendantService();

  // ================================================================

  useAsync<Attendant[]>(
    async () => {
      return attendantService.getAttendants();
    },
    (data) => {
      setAttendants(data);
    },
    (error) => {
      console.error(error);
    },
    undefined,
    []
  );

  // ================================================================

  return (
    <AttendantCtx.Provider
      value={{
        attendants,
      }}
    >
      {children}
    </AttendantCtx.Provider>
  );
};

export function useAttendantResource() {
  const context = useContext(AttendantCtx);
  if (!context) {
    throw new Error(
      "useAttendantResource must be used within a AttendantProvider"
    );
  }
  return context;
}

export default AttendantProvider;
