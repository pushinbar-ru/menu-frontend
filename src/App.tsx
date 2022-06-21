import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./reset.css";
import "./App.css";

import RequireAuth from "./model/RequireAuth";

import ClientHomePage from "./view/pages/client/HomePage";

import AdminHomePage from "./view/pages/admin/HomePage";
import AdminLoginPage from "./view/pages/admin/LoginPage";
import AdminEditProductPage from "./view/pages/admin/EditProductPage";
import AdminUntappdPage from "./view/pages/admin/UntappdPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientHomePage />} />
        <Route path="/admin">
          <Route
            index
            element={
              <RequireAuth>
                <AdminHomePage />
              </RequireAuth>
            }
          />
          <Route path="login" element={<AdminLoginPage />} />
          <Route
            path="untappd/:productId"
            element={
              <RequireAuth>
                <AdminUntappdPage />
              </RequireAuth>
            }
          />
          <Route
            path="products/:category/:id"
            element={
              <RequireAuth>
                <AdminEditProductPage />
              </RequireAuth>
            }
          />
        </Route>
        {/* TODO: Добавить NOT FOUND страничку, когда будет дизайн */}
        <Route path="*" element={<>NOT FOUND</>} />
      </Routes>
    </Router>
  );
};

export default App;
