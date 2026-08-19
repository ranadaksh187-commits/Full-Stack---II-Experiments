import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../auth/Auth.jsx";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");

  const credentials = {
    viewer: {
      username: "viewer",
      password: "view123",
    },
    editor: {
      username: "editor",
      password: "edit123",
    },
    admin: {
      username: "admin",
      password: "admin123",
    },
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const selectedUser = credentials[role];

    if (
      username === selectedUser.username &&
      password === selectedUser.password
    ) {
      loginUser(username, role);
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Post Manager</h1>

        <p className="login-subtitle">
          Login to manage your posts
        </p>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Select Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <div className="demo-info">

          <h3>Demo Credentials</h3>

          <p>
            <strong>Viewer:</strong>
            <br />
            Username: viewer
            <br />
            Password: view123
          </p>

          <p>
            <strong>Editor:</strong>
            <br />
            Username: editor
            <br />
            Password: edit123
          </p>

          <p>
            <strong>Admin:</strong>
            <br />
            Username: admin
            <br />
            Password: admin123
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;