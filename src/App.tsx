import { Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import SectionalModulePage from "@/pages/sectional-module";
import UsersPage from "@/pages/users";
import { Authenticated, AuthenticatedProvider } from "./hooks/use-auth";
import { MyModuleProvider } from "./hooks/use-my-module";
import OperatorPage from "./pages/operator";

function App() {
  return (
    <Routes>
      <Route element={<AuthenticatedProvider />}>
        <Route element={<MyModuleProvider />}>
          <Route path="/modulo-seccional">
            <Route element={<SectionalModulePage />} index />
            <Route element={<UsersPage />} path="/modulo-seccional/clientes" />
          </Route>
          <Route path="/caja" element={<Authenticated />}>
            <Route element={<OperatorPage />} index />
          </Route>
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
          <Route element={<NotFoundPage />} path="*" />
        </Route>
        <Route element={<LoginPage />} path="/login" />
      </Route>
    </Routes>
  );
}

export default App;
