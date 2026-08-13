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


        {/* Student Portal */}

        <Route
          path="/portal/student"
          element={
            <ProtectedRoute
              allowedRoles={["student", "parent", "teacher", "management"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Parent Portal */}

        <Route
          path="/portal/parent"
          element={
            <ProtectedRoute
              allowedRoles={["parent", "teacher", "management"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Teacher / Staff Portal */}

        <Route
          path="/portal/teacher"
          element={
            <ProtectedRoute
              allowedRoles={["teacher", "management"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Management Portal */}

        <Route
          path="/portal/management"
          element={
            <ProtectedRoute
              allowedRoles={["management"]}
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