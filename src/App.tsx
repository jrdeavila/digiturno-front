import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import SectionalModulePage from "@/pages/sectional-module";
import UsersPage from "@/pages/users";
import { useMemo } from "react";
import LoadingPage from "./components/loading-page";
import useAuth from "./hooks/use-auth";
import useMyModule from "./hooks/use-my-module";
import OperatorPage from "./pages/operator";
import ReceptorPage from "./pages/receptor";
import ScreenPage from "./pages/screen";
import Qualification from "./pages/qualification";

const ModuleGuard = () => {
  const { type } = useMyModule();
  const { loading, authenticated } = useAuth();
  const render = useMemo(() => {
    if (loading) {
      return <LoadingPage />;
    }
    switch (type?.id) {
      case 2:
        return <Navigate to="/modulo-seccional" />;
      case 6:
        if (!authenticated) {
          return <Navigate to="/login" />;
        }
        return <Navigate to="/caja" />;
      case 1:
        if (!authenticated) {
          return <Navigate to="/login" />;
        }
        return <Navigate to="/caja" />;
      case 3:
        return <Navigate to="/recepción" />;

      case 4:
        return <Navigate to="/pantalla" />;

      case 5:
        return <Navigate to="/calificación" />;

    }
  }, [authenticated, type, loading]);
  return (
    <>
      {render}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<ModuleGuard />}>
        <Route path="/modulo-seccional">
          <Route element={<SectionalModulePage />} index />
          <Route element={<UsersPage />} path="/modulo-seccional/clientes" />
        </Route>
        <Route path="/caja" element={<OperatorPage />} />
        <Route element={<ReceptorPage />} path="/recepción" />
        <Route element={<ScreenPage />} path="/pantalla" />
        <Route element={<ModuleGuard />} path="/" />
        <Route element={<NotFoundPage />} path="*" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<Qualification />} path="/calificación" />
      </Route>
    </Routes>
  );
}

export default App;
