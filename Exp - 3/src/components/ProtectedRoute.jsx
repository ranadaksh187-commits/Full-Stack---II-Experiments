import { Navigate } from "react-router-dom";
import { decodeJWT } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("token");

  const user = decodeJWT(token);

  // No valid token
  if (!user) {
    localStorage.removeItem("token");

    return <Navigate to="/" replace />;
  }

  // Role is not allowed
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to={`/portal/${user.role}`} replace />;
  }

  return children;
}

export default ProtectedRoute;