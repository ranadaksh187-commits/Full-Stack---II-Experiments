import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>

      <Routes>

        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* Viewer / Creator Portal */}

        <Route
          path="/portal/viewer"
          element={
            <ProtectedRoute
              allowedRoles={[
                "viewer",
                "editor",
                "admin",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Editor Portal */}

        <Route
          path="/portal/editor"
          element={
            <ProtectedRoute
              allowedRoles={[
                "editor",
                "admin",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Admin Portal */}

        <Route
          path="/portal/admin"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </AuthProvider>
  );
}

export default App;