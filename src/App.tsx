import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import SectionalModulePage from "@/pages/sectional-module";
import UsersPage from "@/pages/users";
import LoadingPage from "./components/loading-page";
import useAuth from "./hooks/use-auth";
import useMyModule from "./hooks/use-my-module";
import OperatorPage from "./pages/operator";
import { useMemo } from "react";

const ModuleGuard = () => {
  const { info } = useMyModule();
  const { loading, authenticated } = useAuth();

  const render = useMemo(() => {
    if (loading) {
      console.log("ModuleGuard -> loading");
      return <LoadingPage />;
    }
    if (!authenticated) {
      console.log("ModuleGuard -> !authenticated");
      return <Navigate to="/login" />;
    }

    console.log("ModuleGuard -> authenticated");

    switch (info?.moduleTypeId) {
      case 1:
        return <Navigate to="/caja" />;
      case 2:
        return <Navigate to="/recepción" />;
      case 3:
        return <Navigate to="/pantalla" />;
      case 4:
        return <Navigate to="/modulo-seccional" />;
    }
  }, [authenticated, info?.moduleTypeId, loading]);
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
        <Route
          element={
            <>
              <span>
                <h1>RECEPCIÓN</h1>
              </span>
            </>
          }
          path="/recepción"
        />
        <Route element={<ModuleGuard />} path="/" />
        <Route element={<NotFoundPage />} path="*" />
        <Route element={<LoginPage />} path="/login" />
      </Route>
    </Routes>
  );
}

export default App;
