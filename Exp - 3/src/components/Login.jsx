import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { generateMockJWT } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const users = {
  student: {
    username: "student",
    password: "Student@123",
    name: "Student User",
  },

  parent: {
    username: "parent",
    password: "Parent@123",
    name: "Parent User",
  },

  teacher: {
    username: "teacher",
    password: "Teacher@123",
    name: "Teacher User",
  },

  management: {
    username: "admin",
    password: "Admin@123",
    name: "Management User",
  },
};

function Login() {
  const [role, setRole] = useState("student");
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

  return (
    <div className="login-page">

      <div className="login-wrapper">

        {/* Left Branding Section */}
        <div className="brand-section">

          <div className="brand-icon">
            🎓
          </div>

          <h1>EduSecure</h1>

          <p>
            Secure University Authentication Portal
          </p>

          <div className="security-badge">
            🔐 JWT Protected
          </div>

        </div>


        {/* Login Section */}
        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to access your portal
          </p>


          {/* Role Selection */}
          <div className="role-selector">

            <button
              className={role === "student" ? "role active" : "role"}
              onClick={() => {
                setRole("student");
                setUsername("");
                setPassword("");
              }}
              type="button"
            >
              🎓
              <span>Student</span>
            </button>


            <button
              className={role === "parent" ? "role active" : "role"}
              onClick={() => {
                setRole("parent");
                setUsername("");
                setPassword("");
              }}
              type="button"
            >
              👨‍👩‍👦
              <span>Parent</span>
            </button>


            <button
              className={role === "teacher" ? "role active" : "role"}
              onClick={() => {
                setRole("teacher");
                setUsername("");
                setPassword("");
              }}
              type="button"
            >
              👨‍🏫
              <span>Staff</span>
            </button>


            <button
              className={role === "management" ? "role active" : "role"}
              onClick={() => {
                setRole("management");
                setUsername("");
                setPassword("");
              }}
              type="button"
            >
              👔
              <span>Management</span>
            </button>

          </div>


          {/* Login Form */}
          <form onSubmit={handleLogin}>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />


            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <strong>Demo Credentials</strong>

            <p>
              Username:{" "}
              <b>{users[role].username}</b>
            </p>

            <p>
              Password:{" "}
              <b>{users[role].password}</b>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;