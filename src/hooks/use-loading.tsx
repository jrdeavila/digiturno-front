import LoadingPage from "@/components/loading-page";
import { createContext, useContext, useState } from "react";
interface LoadingCtxProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
const LoadingCtx = createContext<LoadingCtxProps | undefined>(undefined);

export const LoadingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <LoadingCtx.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <LoadingPage />}
    </LoadingCtx.Provider>
  );
};

export default function useLoading() {
  const context = useContext(LoadingCtx);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
