import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { generateMockJWT } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const users = {
  viewer: {
    username: "viewer",
    password: "Student@123",
    name: "Viewer",
  },

  editor: {
    username: "editor",
    password: "Teacher@123",
    name: "Editor",
  },

  admin: {
    username: "admin",
    password: "Admin@123",
    name: "Administrator",
  },
};

function Login() {
  const [role, setRole] = useState("viewer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const selectedUser = users[role];

    if (
      username === selectedUser.username &&
      password === selectedUser.password
    ) {
      const token = generateMockJWT(username, role);

      login(token);

      navigate(`/portal/${role}`);
    } else {
      alert("Invalid username or password.");
    }
  };

  const changeRole = (selectedRole) => {
    setRole(selectedRole);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* Branding Section */}
        <div className="brand-section">

          <div className="brand-icon">
            📝
          </div>

          <h1>PostSecure</h1>

          <p>
            Secure Role-Based Post Management System
          </p>

          <div className="security-badge">
            🔐 JWT Protected
          </div>

        </div>


        {/* Login Card */}
        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Select your portal and sign in
          </p>


          {/* Role Selector */}
          <div className="role-selector">

            <button
              className={
                role === "viewer"
                  ? "role active"
                  : "role"
              }
              onClick={() => changeRole("viewer")}
              type="button"
            >
              👁️
              <span>Viewer / Creator</span>
            </button>


            <button
              className={
                role === "editor"
                  ? "role active"
                  : "role"
              }
              onClick={() => changeRole("editor")}
              type="button"
            >
              ✏️
              <span>Editor</span>
            </button>


            <button
              className={
                role === "admin"
                  ? "role active"
                  : "role"
              }
              onClick={() => changeRole("admin")}
              type="button"
            >
              👑
              <span>Admin</span>
            </button>

          </div>


          {/* Login Form */}
          <form onSubmit={handleLogin}>

            <label>
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <button
              className="login-button"
              type="submit"
            >
              Sign In →
            </button>

          </form>


          {/* Demo Credentials */}
          <div className="demo-box">

            <strong>
              Demo Credentials
            </strong>

            <p>
              Username:{" "}
              <b>
                {users[role].username}
              </b>
            </p>

            <p>
              Password:{" "}
              <b>
                {users[role].password}
              </b>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;