import { Route, Routes } from "react-router-dom";

import SectionalModulePage from "@/pages/sectional-module";
import NotFoundPage from "@/pages/not-found";
import UsersPage from "@/pages/users";
import LoginPage from "@/pages/login";
import { MyModuleProvider } from "./hooks/use-my-module";
import OperatorPage from "./pages/operator";

function App() {
  return (
    <Routes>
      <Route element={<MyModuleProvider />}>
        <Route path="/modulo-seccional">
          <Route element={<SectionalModulePage />} index />
          <Route element={<UsersPage />} path="/modulo-seccional/clientes" />
        </Route>
        <Route element={<OperatorPage />} path="/caja" />
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
        <Route element={<LoginPage />} path="/login" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}

export default App;
