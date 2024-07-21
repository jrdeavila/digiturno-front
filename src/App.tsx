import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import NotFoundPage from "@/pages/not-found";
import UsersPage from "@/pages/users";
import LoginPage from "@/pages/login";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} index />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<UsersPage />} path="/users" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;
