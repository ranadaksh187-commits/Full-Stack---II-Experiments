import { Navigate } from "react-router-dom";
import { getToken } from "../utils/storage.js";

function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;