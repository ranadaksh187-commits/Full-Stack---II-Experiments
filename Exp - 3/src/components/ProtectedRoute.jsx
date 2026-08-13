import { Navigate } from "react-router-dom";
import { decodeJWT } from "../utils/auth";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const token = localStorage.getItem("token");

  const user = decodeJWT(token);

  if (!user) {
    localStorage.removeItem("token");

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={`/portal/${user.role}`}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;